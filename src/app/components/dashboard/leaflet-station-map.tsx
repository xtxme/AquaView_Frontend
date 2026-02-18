"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import type { GeoJSON as LeafletGeoJSON, Map as LeafletMap, Marker, Polyline } from 'leaflet'
import type { Feature, GeoJsonObject, LineString, MultiLineString, Position } from 'geojson'
import { buildStationPopupContent } from '@/app/components/home/station-popup-content'
import { fetchRiverGeometryFromOverpass } from '@/lib/osm/fetch-river-geometry'
import { getRiverConfigByKey } from '@/lib/osm/config'
import { computeReachDistanceOnRiver } from '@/lib/osm/reach-distance'
import type { BBox, ReachRiverDistance, RiverGeometry } from '@/lib/osm/types'

interface Station {
    station_id: string
    name: string
    latitude: number
    longitude: number
    status: 'green' | 'yellow' | 'red'
    percent_of_bank: number
    province: string
    latest_reading?: {
        water_level_m: number | null
        ts: string
    }
}

interface Reach {
    upstream_station: string
    downstream_station: string
    typical_travel_hr: number
}

interface LeafletStationMapProps {
    stations: Station[]
    reaches?: Reach[]
    onStationClick?: (stationId: string) => void
    selectedProvince?: string
    riverKey?: string
}

type LeafletModule = typeof import('leaflet')
type ReachDistanceMap = Map<string, ReachRiverDistance>

function buildStationsBbox(stations: Station[]): BBox | null {
    if (stations.length === 0) {
        return null
    }

    const longitudes = stations.map((station) => station.longitude)
    const latitudes = stations.map((station) => station.latitude)

    return [
        Math.min(...longitudes),
        Math.min(...latitudes),
        Math.max(...longitudes),
        Math.max(...latitudes),
    ]
}

function getReachKey(reach: Reach): string {
    return `${reach.upstream_station}->${reach.downstream_station}`
}

function computePolylineMidpoint(coordinates: Position[]): [number, number] | null {
    if (coordinates.length < 2) {
        return null
    }

    const toRad = (value: number) => (value * Math.PI) / 180
    const earthRadiusM = 6371000

    const segmentLengths: number[] = []
    let totalLength = 0

    for (let index = 1; index < coordinates.length; index += 1) {
        const [lon1, lat1] = coordinates[index - 1]
        const [lon2, lat2] = coordinates[index]
        const dLat = toRad(lat2 - lat1)
        const dLon = toRad(lon2 - lon1)
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const segmentLength = earthRadiusM * c
        segmentLengths.push(segmentLength)
        totalLength += segmentLength
    }

    if (totalLength <= 0) {
        const [lon, lat] = coordinates[Math.floor(coordinates.length / 2)]
        return [lat, lon]
    }

    const midpointTarget = totalLength / 2
    let traversed = 0

    for (let index = 1; index < coordinates.length; index += 1) {
        const segmentLength = segmentLengths[index - 1]
        if (traversed + segmentLength >= midpointTarget) {
            const ratio = (midpointTarget - traversed) / segmentLength
            const [lon1, lat1] = coordinates[index - 1]
            const [lon2, lat2] = coordinates[index]
            const lat = lat1 + (lat2 - lat1) * ratio
            const lon = lon1 + (lon2 - lon1) * ratio
            return [lat, lon]
        }
        traversed += segmentLength
    }

    const [lon, lat] = coordinates[coordinates.length - 1]
    return [lat, lon]
}

function computeGreatCircleDistanceKm(
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
): number {
    const toRad = (value: number) => (value * Math.PI) / 180
    const earthRadiusKm = 6371
    const dLat = toRad(to.latitude - from.latitude)
    const dLon = toRad(to.longitude - from.longitude)
    const lat1 = toRad(from.latitude)
    const lat2 = toRad(to.latitude)

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return earthRadiusKm * c
}

function formatReachTime(hoursFloat: number): string {
    const hours = Math.floor(hoursFloat)
    const minutes = Math.round((hoursFloat - hours) * 60)

    if (hours > 0 && minutes > 0) {
        return `${hours} ชั่วโมง ${minutes} นาที`
    }
    if (hours > 0) {
        return `${hours} ชั่วโมง`
    }
    return `${minutes} นาที`
}

function buildReachTooltip(timeText: string, distance?: number): string {
    if (typeof distance === 'number') {
        return `เวลาเดินทาง: ${timeText}<br/>ระยะตามลำน้ำ: ${distance.toFixed(2)} กม.`
    }
    return `เวลาเดินทาง: ${timeText}<br/>ระยะตามลำน้ำ: ไม่พบช่วงแม่น้ำที่ต่อเนื่อง`
}

export function LeafletStationMap({
    stations,
    reaches = [],
    onStationClick,
    selectedProvince,
    riverKey = 'ping'
}: LeafletStationMapProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapRefDirect = useRef<LeafletMap | null>(null)
    const markersRef = useRef<Marker[]>([])
    const polylinesRef = useRef<Polyline[]>([])
    const labelsRef = useRef<Marker[]>([])
    const riverLayerRef = useRef<LeafletGeoJSON | null>(null)
    const stationsRef = useRef(stations)
    const reachesRef = useRef(reaches)
    const onStationClickRef = useRef(onStationClick)
    const riverGeometryRef = useRef<RiverGeometry | null>(null)
    const reachDistanceMapRef = useRef<ReachDistanceMap>(new Map())
    const highlightLayerRef = useRef<LeafletGeoJSON | null>(null)
    const distanceLabelRef = useRef<Marker | null>(null)
    const [L, setL] = useState<LeafletModule | null>(null)
    const [, setActiveReachKey] = useState<string | null>(null)

    useEffect(() => {
        stationsRef.current = stations
    }, [stations])

    useEffect(() => {
        reachesRef.current = reaches
    }, [reaches])

    useEffect(() => {
        onStationClickRef.current = onStationClick
    }, [onStationClick])

    const clearReachHighlight = useCallback(() => {
        if (!mapRefDirect.current) {
            return
        }

        if (highlightLayerRef.current) {
            mapRefDirect.current.removeLayer(highlightLayerRef.current)
            highlightLayerRef.current = null
        }

        if (distanceLabelRef.current) {
            mapRefDirect.current.removeLayer(distanceLabelRef.current)
            distanceLabelRef.current = null
        }
    }, [])

    const buildReachDistanceMap = useCallback((
        riverFeature: Feature<LineString | MultiLineString>,
        currentStations: Station[],
        currentReaches: Reach[]
    ): ReachDistanceMap => {
        const stationMap = new Map(currentStations.map((station) => [station.station_id, station]))
        const nextMap: ReachDistanceMap = new Map()

        currentReaches.forEach((reach) => {
            const upstream = stationMap.get(reach.upstream_station)
            const downstream = stationMap.get(reach.downstream_station)
            if (!upstream || !downstream) {
                return
            }

            const result = computeReachDistanceOnRiver(
                riverFeature,
                [upstream.longitude, upstream.latitude],
                [downstream.longitude, downstream.latitude],
                reach.upstream_station,
                reach.downstream_station
            )

            if (!result) {
                return
            }

            nextMap.set(getReachKey(reach), result)
        })

        return nextMap
    }, [])

    useEffect(() => {
        let isCancelled = false

        const initMap = async () => {
            if (!mapRef.current || mapRefDirect.current) {
                return
            }

            try {
                const leaflet = await import('leaflet')

                if (isCancelled || !mapRef.current || mapRefDirect.current) {
                    return
                }

                setL(leaflet)

                if (!document.getElementById('leaflet-cdn-css')) {
                    const link = document.createElement('link')
                    link.id = 'leaflet-cdn-css'
                    link.rel = 'stylesheet'
                    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
                    document.head.appendChild(link)
                }

                if (!document.getElementById('leaflet-marker-effect-css')) {
                    const style = document.createElement('style')
                    style.id = 'leaflet-marker-effect-css'
                    style.textContent = `
                      .aqv-marker-wrap {
                        width: 56px;
                        height: 56px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                      }

                      .aqv-marker-pulse {
                        position: absolute;
                        width: 56px;
                        height: 56px;
                        border-radius: 50%;
                        background: var(--tone-soft);
                        animation: aqv-pulse 1.9s ease-in-out infinite;
                      }

                      .aqv-marker-core {
                        width: 44px;
                        height: 44px;
                        border-radius: 50%;
                        background: var(--tone);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: var(--shadow-soft), inset 0 0 0 2px var(--overlay-white-strong);
                        position: relative;
                        z-index: 1;
                      }

                      .aqv-marker-inner {
                        width: 34px;
                        height: 34px;
                        border-radius: 50%;
                        background: var(--overlay-white-soft);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      }

                      @keyframes aqv-pulse {
                        0% { transform: scale(0.9); opacity: 0.65; }
                        70% { transform: scale(1.08); opacity: 0.18; }
                        100% { transform: scale(1.08); opacity: 0; }
                      }
                    `
                    document.head.appendChild(style)
                }

                const map = leaflet.map(mapRef.current, {
                    center: [18.7883, 98.9853],
                    zoom: 10,
                    zoomControl: true,
                })

                leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap',
                    maxZoom: 19,
                }).addTo(map)

                mapRefDirect.current = map

                const createMarkerIcon = (status: 'green' | 'yellow' | 'red') => {
                    const tone = {
                        green: 'var(--status-safe)',
                        yellow: 'var(--status-warning)',
                        red: 'var(--status-danger)',
                    }[status]
                    const toneSoft = {
                        green: 'var(--status-safe-bg)',
                        yellow: 'var(--status-warning-bg)',
                        red: 'var(--status-danger-bg)',
                    }[status]

                    return leaflet.divIcon({
                        html: `
                            <div class="aqv-marker-wrap" style="--tone:${tone};--tone-soft:${toneSoft};">
                                <div class="aqv-marker-pulse"></div>
                                <div class="aqv-marker-core">
                                    <div class="aqv-marker-inner">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--color-surface)" aria-hidden="true">
                                            <path d="M12 2.25c0 0-7 6.58-7 11.2A7 7 0 0 0 19 13.45c0-4.62-7-11.2-7-11.2z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        `,
                        className: 'custom-marker',
                        iconSize: [56, 56],
                        iconAnchor: [28, 28],
                    })
                }

                const currentStations = stationsRef.current
                const currentReaches = reachesRef.current
                const currentOnStationClick = onStationClickRef.current

                const stationOrderMap = new Map<string, string>()
                currentReaches.forEach(reach => {
                    stationOrderMap.set(reach.downstream_station, reach.upstream_station)
                })

                const getPreviousStation = (stationId: string): string | null => {
                    return stationOrderMap.get(stationId) || null
                }

                currentStations.forEach(station => {
                    const marker = leaflet.marker([station.latitude, station.longitude], {
                        icon: createMarkerIcon(station.status)
                    }).addTo(map)
                    marker.setZIndexOffset(1000)

                    const prevStationId = getPreviousStation(station.station_id)
                    const prevStation = prevStationId ? currentStations.find(s => s.station_id === prevStationId) ?? null : null

                    const popupContent = buildStationPopupContent(station, prevStation)

                    marker.bindPopup(popupContent, {
                        closeButton: false,
                        autoClose: true,
                        closeOnClick: false,
                    })

                    marker.on('mouseover', () => {
                        marker.openPopup()
                    })

                    marker.on('mouseout', () => {
                        marker.closePopup()
                    })

                    marker.on('click', () => {
                        if (currentOnStationClick) {
                            currentOnStationClick(station.station_id)
                        }
                    })

                    markersRef.current.push(marker)
                })

                if (currentReaches.length > 0) {
                    currentReaches.forEach(reach => {
                        const upstreamStation = currentStations.find(s => s.station_id === reach.upstream_station)
                        const downstreamStation = currentStations.find(s => s.station_id === reach.downstream_station)

                        if (upstreamStation && downstreamStation) {
                            const polyline = leaflet.polyline(
                                [[upstreamStation.latitude, upstreamStation.longitude], [downstreamStation.latitude, downstreamStation.longitude]],
                                { color: 'var(--color-secondary)', weight: 3, opacity: 0.7, dashArray: '10, 10' }
                            ).addTo(map)

                            const midLat = (upstreamStation.latitude + downstreamStation.latitude) / 2
                            const midLng = (upstreamStation.longitude + downstreamStation.longitude) / 2

                            const timeText = formatReachTime(reach.typical_travel_hr)
                            const reachKey = getReachKey(reach)
                            const computedDistance = reachDistanceMapRef.current.get(reachKey)?.distanceKm
                            const previewDistanceKm = computedDistance ?? computeGreatCircleDistanceKm(
                                { latitude: upstreamStation.latitude, longitude: upstreamStation.longitude },
                                { latitude: downstreamStation.latitude, longitude: downstreamStation.longitude }
                            )
                            const distancePrefix = computedDistance ? 'ระยะทางน้ำ' : 'ระยะทางน้ำ (ตัวอย่าง)'

                            const travelTimeLabel = leaflet.divIcon({
                                html: `<div style="background: var(--color-surface); padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; color: var(--color-text); box-shadow: var(--shadow-soft); border: 2px solid var(--color-secondary); white-space: nowrap;">
                                    <div>⏱️ ${timeText}</div>
                                    <div style="margin-top:2px; font-size:11px; color:#1D4ED8;">💧 ${distancePrefix} ${previewDistanceKm.toFixed(1)} กม.</div>
                                </div>`,
                                className: 'travel-time-label',
                                iconSize: [190, 44],
                                iconAnchor: [95, 22],
                            })

                            const label = leaflet.marker([midLat, midLng], { icon: travelTimeLabel }).addTo(map)
                            label.setZIndexOffset(500)

                            polyline.bindTooltip(
                                `${upstreamStation.name} → ${downstreamStation.name}<br>${buildReachTooltip(timeText, previewDistanceKm)}`,
                                { sticky: true }
                            )

                            polyline.on('mouseover', () => {
                                setActiveReachKey(reachKey)
                                clearReachHighlight()

                                const reachDistance = reachDistanceMapRef.current.get(reachKey)
                                const tooltipContent = reachDistance
                                    ? `${upstreamStation.name} → ${downstreamStation.name}<br>${buildReachTooltip(timeText, reachDistance.distanceKm)}`
                                    : `${upstreamStation.name} → ${downstreamStation.name}<br>${buildReachTooltip(timeText)}`
                                polyline.bindTooltip(tooltipContent, { sticky: true })
                                polyline.openTooltip()

                                if (!reachDistance) {
                                    return
                                }

                                const segmentLayer = leaflet.geoJSON(reachDistance.segmentGeojson as GeoJsonObject, {
                                    style: {
                                        color: '#2563EB',
                                        weight: 6,
                                        opacity: 0.95,
                                        lineCap: 'round',
                                    },
                                }).addTo(map)
                                segmentLayer.bringToFront()
                                highlightLayerRef.current = segmentLayer

                                const segmentCoordinates = reachDistance.segmentGeojson.geometry.coordinates as Position[]
                                const midpoint = computePolylineMidpoint(segmentCoordinates)
                                if (midpoint) {
                                    const distanceIcon = leaflet.divIcon({
                                        html: `<div style="background:#ffffff; padding:4px 10px; border-radius:12px; font-size:12px; font-weight:700; color:#1D4ED8; box-shadow: var(--shadow-soft); border:2px solid #2563EB; white-space:nowrap;">${reachDistance.distanceKm.toFixed(2)} กม.</div>`,
                                        className: 'reach-distance-label',
                                        iconSize: [110, 30],
                                        iconAnchor: [55, 15],
                                    })
                                    const distanceMarker = leaflet.marker(midpoint, { icon: distanceIcon }).addTo(map)
                                    distanceMarker.setZIndexOffset(800)
                                    distanceLabelRef.current = distanceMarker
                                }
                            })

                            polyline.on('mouseout', () => {
                                setActiveReachKey((prev) => {
                                    if (prev === getReachKey(reach)) {
                                        return null
                                    }
                                    return prev
                                })
                                clearReachHighlight()
                            })

                            polylinesRef.current.push(polyline)
                            labelsRef.current.push(label)
                        }
                    })
                }

                if (currentStations.length > 0) {
                    const bounds = leaflet.latLngBounds(currentStations.map(s => [s.latitude, s.longitude]))
                    map.fitBounds(bounds, { padding: [50, 50] })
                }

            } catch (error) {
                console.error('[LeafletStationMap] Error:', error)
            }
        }

        initMap()

        return () => {
            isCancelled = true
            if (mapRefDirect.current) {
                mapRefDirect.current.remove()
                mapRefDirect.current = null
            }
            markersRef.current = []
            polylinesRef.current = []
            labelsRef.current = []
            reachDistanceMapRef.current.clear()
            riverGeometryRef.current = null
            setActiveReachKey(null)
            clearReachHighlight()
            riverLayerRef.current = null
        }
    }, [clearReachHighlight])

    useEffect(() => {
        if (!L || !mapRefDirect.current || stations.length === 0) {
            return
        }

        const map = mapRefDirect.current
        const river = getRiverConfigByKey(riverKey)
        const bbox = buildStationsBbox(stations)
        let cancelled = false

        if (!river || !bbox) {
            return
        }

        const loadRiverGeometry = async () => {
            try {
                const riverGeometry = await fetchRiverGeometryFromOverpass(river, bbox)
                if (cancelled || !mapRefDirect.current) {
                    return
                }

                if (riverLayerRef.current) {
                    map.removeLayer(riverLayerRef.current)
                    riverLayerRef.current = null
                }

                const layer = L.geoJSON(riverGeometry.geojson as GeoJsonObject, {
                    style: {
                        color: '#0EA5E9',
                        weight: 5,
                        opacity: 0.82,
                        dashArray: riverGeometry.source === 'way-fallback' ? '14 10' : undefined,
                        lineCap: 'round',
                    },
                }).addTo(map)

                layer.bringToBack()
                riverLayerRef.current = layer
                riverGeometryRef.current = riverGeometry

                reachDistanceMapRef.current = buildReachDistanceMap(
                    riverGeometry.geojson as Feature<LineString | MultiLineString>,
                    stations,
                    reaches
                )
            } catch (error) {
                if (!cancelled) {
                    console.error('[LeafletStationMap] Failed to load river geometry:', error)
                    riverGeometryRef.current = null
                    reachDistanceMapRef.current = new Map()
                    clearReachHighlight()
                }
            }
        }

        loadRiverGeometry()

        return () => {
            cancelled = true
            if (mapRefDirect.current && riverLayerRef.current) {
                mapRefDirect.current.removeLayer(riverLayerRef.current)
                riverLayerRef.current = null
            }
            riverGeometryRef.current = null
            reachDistanceMapRef.current = new Map()
            clearReachHighlight()
        }
    }, [L, buildReachDistanceMap, clearReachHighlight, reaches, riverKey, stations])

    useEffect(() => {
        if (selectedProvince && mapRefDirect.current && L && stations.length > 0) {
            const provinceStations = stations.filter(s => s.province === selectedProvince)
            
            if (provinceStations.length > 0) {
                const bounds = L.latLngBounds(provinceStations.map(s => [s.latitude, s.longitude]))
                mapRefDirect.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 })
            }
        }
    }, [selectedProvince, stations, L])

    return (
        <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200">
            <div ref={mapRef} className="w-full h-full min-h-[500px]" />
            <div className="absolute bottom-4 left-4 bg-slate-900/95 backdrop-blur-sm rounded-lg shadow-xl p-4 border border-slate-700 z-[1000]">
                <div className="text-sm font-semibold mb-3 text-white">เกณฑ์ระดับน้ำ</div>
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border-2 shadow-sm" style={{ backgroundColor: 'var(--status-safe-bg)', borderColor: 'var(--status-safe)' }}></div>
                        <span className="text-xs" style={{ color: 'var(--status-safe)' }}>ปกติ &lt; 80% ของระดับอันตราย</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border-2 shadow-sm" style={{ backgroundColor: 'var(--status-warning-bg)', borderColor: 'var(--status-warning)' }}></div>
                        <span className="text-xs" style={{ color: 'var(--status-warning)' }}>เฝ้าระวัง 80% - 99.9%</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border-2 shadow-sm" style={{ backgroundColor: 'var(--status-danger-bg)', borderColor: 'var(--status-danger)' }}></div>
                        <span className="text-xs" style={{ color: 'var(--status-danger)' }}>อันตราย ≥ 100%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
