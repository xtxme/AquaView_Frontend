"use client"

import { useEffect, useRef, useState } from 'react'
import type { GeoJSON as LeafletGeoJSON, Map as LeafletMap, Marker, Polyline } from 'leaflet'
import type { GeoJsonObject } from 'geojson'
import { buildStationPopupContent } from '@/app/components/home/station-popup-content'
import { fetchRiverGeometryFromOverpass } from '@/lib/osm/fetch-river-geometry'
import { getRiverConfigByKey } from '@/lib/osm/config'
import type { BBox } from '@/lib/osm/types'

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
    const [L, setL] = useState<LeafletModule | null>(null)

    useEffect(() => {
        stationsRef.current = stations
    }, [stations])

    useEffect(() => {
        reachesRef.current = reaches
    }, [reaches])

    useEffect(() => {
        onStationClickRef.current = onStationClick
    }, [onStationClick])

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

                            const hours = Math.floor(reach.typical_travel_hr)
                            const minutes = Math.round((reach.typical_travel_hr - hours) * 60)
                            const timeText = hours > 0 && minutes > 0 ? `${hours} ชั่วโมง ${minutes} นาที` : hours > 0 ? `${hours} ชั่วโมง` : `${minutes} นาที`

                            const travelTimeLabel = leaflet.divIcon({
                                html: `<div style="background: var(--color-surface); padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; color: var(--color-text); box-shadow: var(--shadow-soft); border: 2px solid var(--color-secondary); white-space: nowrap;">⏱️ ${timeText}</div>`,
                                className: 'travel-time-label',
                                iconSize: [150, 30],
                                iconAnchor: [75, 15],
                            })

                            const label = leaflet.marker([midLat, midLng], { icon: travelTimeLabel }).addTo(map)
                            label.setZIndexOffset(500)

                            polyline.bindTooltip(`${upstreamStation.name} → ${downstreamStation.name}<br>เวลาเดินทาง: ${timeText}`, { sticky: true })

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
            riverLayerRef.current = null
        }
    }, [])

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
            } catch (error) {
                if (!cancelled) {
                    console.error('[LeafletStationMap] Failed to load river geometry:', error)
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
        }
    }, [L, riverKey, stations])

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
