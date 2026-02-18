"use client"

import { useEffect, useRef, useState } from 'react'
import type { Map as LeafletMap, Marker, Polyline } from 'leaflet'

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
}

type LeafletModule = typeof import('leaflet')

export function LeafletStationMap({ stations, reaches = [], onStationClick, selectedProvince }: LeafletStationMapProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapRefDirect = useRef<LeafletMap | null>(null)
    const markersRef = useRef<Marker[]>([])
    const polylinesRef = useRef<Polyline[]>([])
    const labelsRef = useRef<Marker[]>([])
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
                            <div style="width:56px;height:56px;display:flex;align-items:center;justify-content:center;">
                                <div style="width:56px;height:56px;border-radius:50%;background:${toneSoft};display:flex;align-items:center;justify-content:center;">
                                    <div style="width:44px;height:44px;border-radius:50%;background:${tone};display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-soft), inset 0 0 0 2px var(--overlay-white-strong);">
                                        <div style="width:34px;height:34px;border-radius:50%;background:var(--overlay-white-soft);display:flex;align-items:center;justify-content:center;">
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--color-surface)" aria-hidden="true">
                                                <path d="M12 2.25c0 0-7 6.58-7 11.2A7 7 0 0 0 19 13.45c0-4.62-7-11.2-7-11.2z"/>
                                            </svg>
                                        </div>
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
                    const prevStation = prevStationId ? currentStations.find(s => s.station_id === prevStationId) : null

                    let timeText = ''
                    if (prevStation && prevStation.latest_reading?.ts && station.latest_reading?.ts) {
                        const prevTime = new Date(prevStation.latest_reading.ts).getTime()
                        const stationTime = new Date(station.latest_reading.ts).getTime()
                        const diffHours = (stationTime - prevTime) / (1000 * 60 * 60)

                        if (diffHours >= 1) {
                            const hours = Math.floor(diffHours)
                            const minutes = Math.round((diffHours - hours) * 60)
                            if (minutes > 0) {
                                timeText = `<div style="font-size: 12px; color: var(--color-text-muted); margin-bottom: 4px;">${hours} ชั่วโมง ${minutes} นาที</div>`
                            } else {
                                timeText = `<div style="font-size: 12px; color: var(--color-text-muted); margin-bottom: 4px;">${hours} ชั่วโมง</div>`
                            }
                        } else if (diffHours > 0) {
                            const minutes = Math.round(diffHours * 60)
                            timeText = `<div style="font-size: 12px; color: var(--color-text-muted); margin-bottom: 4px;">${minutes} นาที</div>`
                        } else if (diffHours === 0) {
                            timeText = '<div style="font-size: 12px; color: var(--color-text-muted); margin-bottom: 4px;">0 นาที</div>'
                        } else {
                            timeText = `<div style="font-size: 12px; color: var(--status-danger); margin-bottom: 4px;">-${Math.abs(Math.floor(diffHours))} ชั่วโมง ${Math.abs(Math.round((diffHours - Math.floor(diffHours)) * 60))} นาที</div>`
                        }
                    } else {
                        timeText = '<div style="font-size: 12px; color: var(--color-text-muted); margin-bottom: 4px;">ไม่มีข้อมูล</div>'
                    }

                    const popupContent = `<div style="min-width: 200px; font-family: sans-serif;">
                        <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: var(--color-text);">${station.name}</div>
                        ${timeText}
                        <div style="font-size: 12px; color: var(--color-text-muted); margin-bottom: 4px;"><strong>ระดับน้ำ:</strong> ${station.latest_reading?.water_level_m?.toFixed(2) || 'N/A'} ม.</div>
                        <div style="font-size: 12px; color: var(--color-text-muted); margin-bottom: 8px;"><strong>ใกล้ตลิ่ง:</strong> ${station.percent_of_bank.toFixed(1)}%</div>
                        <div style="padding: 4px 8px; background: ${station.status === 'red' ? 'var(--status-danger-bg)' : station.status === 'yellow' ? 'var(--status-warning-bg)' : 'var(--status-safe-bg)'}; color: ${station.status === 'red' ? 'var(--status-danger)' : station.status === 'yellow' ? 'var(--status-warning)' : 'var(--status-safe)'}; border-radius: 4px; font-size: 11px; font-weight: 600; text-align: center;">${station.status === 'red' ? 'อันตราย' : station.status === 'yellow' ? 'เฝ้าระวัง' : 'ปกติ'}</div>
                    </div>`

                    marker.bindPopup(popupContent)

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
        }
    }, [])

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
                        <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                        <span className="text-xs text-gray-200">ปกติ &lt; 80% ของระดับอันตราย</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow-sm"></div>
                        <span className="text-xs text-gray-200">เฝ้าระวัง ≥ 80%</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
                        <span className="text-xs text-gray-200">อันตราย ≥ 100%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
