"use client"

import { useEffect, useRef, useState } from 'react'

interface Station {
  station_id: string
  name: string
  province: string
  latitude: number
  longitude: number
  status: 'green' | 'yellow' | 'red'
  percent_of_bank: number
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

export function LeafletStationMap({ stations, reaches = [], onStationClick, selectedProvince }: LeafletStationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const polylinesRef = useRef<any[]>([])
  const labelsRef = useRef<any[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  console.log('[LeafletStationMap] Props received:', { stations, reaches })

  useEffect(() => {
    if (!mapRef.current || isInitialized) return

    const initMap = async () => {
      const L = await import('leaflet')
      
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)

      if (mapRef.current && (mapRef.current as any)._leaflet_id) {
        console.log('[v0] Map container already initialized, skipping')
        return
      }

      const map = L.map(mapRef.current!, {
        center: [18.7883, 98.9853],
        zoom: 10,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      leafletMapRef.current = map
      setIsInitialized(true)
    }

    initMap()

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
        setIsInitialized(false)
      }
    }
  }, [])

  useEffect(() => {
    console.log('[LeafletStationMap] Zoom to province effect triggered', { selectedProvince, isInitialized })
    if (!isInitialized || !leafletMapRef.current || !selectedProvince) {
      return
    }

    const zoomToProvince = async () => {
      const L = await import('leaflet')
      const map = leafletMapRef.current

      const provinceStations = stations.filter(s => s.province === selectedProvince)
      
      if (provinceStations.length > 0) {
        const bounds = L.latLngBounds(provinceStations.map(s => [s.latitude, s.longitude]))
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 })
      }
    }

    zoomToProvince()
  }, [selectedProvince, stations, isInitialized])

  useEffect(() => {
    console.log('[LeafletStationMap] updateMapContent effect triggered', { isInitialized })
    if (!isInitialized || !leafletMapRef.current) {
      console.log('[LeafletStationMap] Not initialized or map ref null, skipping')
      return
    }

    const updateMapContent = async () => {
      const L = await import('leaflet')
      const map = leafletMapRef.current

      markersRef.current.forEach(marker => marker.remove())
      polylinesRef.current.forEach(polyline => polyline.remove())
      labelsRef.current.forEach(label => label.remove())
      markersRef.current = []
      polylinesRef.current = []
      labelsRef.current = []

      console.log('[LeafletStationMap] Processing stations:', stations.length)

      const createMarkerIcon = (status: string) => {
        const color = status === 'red' ? '#ef4444' : status === 'yellow' ? '#f59e0b' : '#10b981'
        return L.divIcon({
          html: `
            <div style="position: relative;">
              <div style="
                width: 30px;
                height: 30px;
                background: ${color};
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
              </div>
              <div style="
                position: absolute;
                width: 30px;
                height: 30px;
                background: ${color};
                border-radius: 50%;
                opacity: 0.4;
                animation: pulse 2s infinite;
                top: 0;
                left: 0;
              "></div>
            </div>
            <style>
              @keyframes pulse {
                0% { transform: scale(1); opacity: 0.6; }
                50% { transform: scale(1.5); opacity: 0.3; }
                100% { transform: scale(2); opacity: 0; }
              }
            </style>
          `,
          className: 'custom-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        })
      }

      const stationOrderMap = new Map<string, string>()
      reaches.forEach(reach => {
        stationOrderMap.set(reach.downstream_station, reach.upstream_station)
      })

      const getPreviousStation = (stationId: string): string | null => {
        return stationOrderMap.get(stationId) || null
      }

      stations.forEach(station => {
        const marker = L.marker([station.latitude, station.longitude], {
          icon: createMarkerIcon(station.status)
        }).addTo(map)

        const prevStationId = getPreviousStation(station.station_id)
        const prevStation = prevStationId ? stations.find(s => s.station_id === prevStationId) : null
        
        let timeText = ''

        if (prevStation && prevStation.latest_reading?.ts && station.latest_reading?.ts) {
          const prevTime = new Date(prevStation.latest_reading.ts).getTime()
          const stationTime = new Date(station.latest_reading.ts).getTime()
          const diffHours = (stationTime - prevTime) / (1000 * 60 * 60)

          if (diffHours >= 1) {
            const hours = Math.floor(diffHours)
            const minutes = Math.round((diffHours - hours) * 60)
            if (minutes > 0) {
              timeText = `<div style="font-size: 12px; color: #64748b; margin-bottom: 4px;"><strong>ห่างจากสถานีก่อนหน้า:</strong> ${hours} ชม ${minutes} นาที</div>`
            } else {
              timeText = `<div style="font-size: 12px; color: #64748b; margin-bottom: 4px;"><strong>ห่างจากสถานีก่อนหน้า:</strong> ${hours} ชม</div>`
            }
          } else if (diffHours > 0) {
            const minutes = Math.round(diffHours * 60)
            timeText = `<div style="font-size: 12px; color: #64748b; margin-bottom: 4px;"><strong>ห่างจากสถานีก่อนหน้า:</strong> ${minutes} นาที</div>`
          } else if (diffHours === 0) {
            timeText = '<div style="font-size: 12px; color: #64748b; margin-bottom: 4px;"><strong>ห่างจากสถานีก่อนหน้า:</strong> 0 นาที</div>'
          } else {
            timeText = `<div style="font-size: 12px; color: #ef4444; margin-bottom: 4px;"><strong>ห่างจากสถานีก่อนหน้า:</strong> -${Math.abs(Math.floor(diffHours))} ชม ${Math.abs(Math.round((diffHours - Math.floor(diffHours)) * 60))} นาที</div>`
          }
        } else {
          timeText = '<div style="font-size: 12px; color: #64748b; margin-bottom: 4px;"><strong>ห่างจากสถานีก่อนหน้า:</strong> ไม่มีข้อมูล</div>'
        }

        const popupContent = `
          <div style="min-width: 200px; font-family: sans-serif;">
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #1f2937;">
              ${station.name}
            </div>
            ${timeText}
            <div style="font-size: 12px; color: #4b5563; margin-bottom: 4px;">
              <strong>ระดับน้ำ:</strong> ${station.latest_reading?.water_level_m?.toFixed(2) || 'N/A'} ม.
            </div>
            <div style="font-size: 12px; color: #4b5563; margin-bottom: 8px;">
              <strong>ใกล้ตลิ่ง:</strong> ${station.percent_of_bank.toFixed(1)}%
            </div>
            <div style="
              padding: 4px 8px;
              background: ${station.status === 'red' ? '#fee2e2' : station.status === 'yellow' ? '#fef3c7' : '#d1fae5'};
              color: ${station.status === 'red' ? '#991b1b' : station.status === 'yellow' ? '#92400e' : '#065f46'};
              border-radius: 4px;
              font-size: 11px;
              font-weight: 600;
              text-align: center;
            ">
              ${station.status === 'red' ? 'อันตราย' : station.status === 'yellow' ? 'เฝ้าระวัง' : 'ปกติ'}
            </div>
          </div>
        `

        marker.bindPopup(popupContent)
        
        marker.on('click', () => {
          if (onStationClick) {
            onStationClick(station.station_id)
          }
        })

        markersRef.current.push(marker)
      })

      if (reaches && reaches.length > 0) {
        let cumulativeTime = 0

        reaches.forEach(reach => {
          const upstreamStation = stations.find(s => s.station_id === reach.upstream_station)
          const downstreamStation = stations.find(s => s.station_id === reach.downstream_station)

          if (upstreamStation && downstreamStation) {
            const polyline = L.polyline(
              [
                [upstreamStation.latitude, upstreamStation.longitude],
                [downstreamStation.latitude, downstreamStation.longitude]
              ],
              {
                color: '#3b82f6',
                weight: 3,
                opacity: 0.7,
                dashArray: '10, 10',
              }
            ).addTo(map)

            const midLat = (upstreamStation.latitude + downstreamStation.latitude) / 2
            const midLng = (upstreamStation.longitude + downstreamStation.longitude) / 2

            const endTime = cumulativeTime + reach.typical_travel_hr
            const timeRange = `${cumulativeTime.toFixed(1)}-${endTime.toFixed(1)} ชม.`

            const travelTimeLabel = L.divIcon({
              html: `
                <div style="
                  background: white;
                  padding: 4px 12px;
                  border-radius: 12px;
                  font-size: 12px;
                  font-weight: 600;
                  color: #1f2937;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                  border: 2px solid #3b82f6;
                  white-space: nowrap;
                ">
                  ⏱️ ${timeRange}
                </div>
              `,
              className: 'travel-time-label',
              iconSize: [100, 30],
              iconAnchor: [50, 15],
            })

            const label = L.marker([midLat, midLng], { icon: travelTimeLabel }).addTo(map)

            polyline.bindTooltip(
              `${upstreamStation.name} → ${downstreamStation.name}<br>เวลาเดินทาง: ${reach.typical_travel_hr} ชั่วโมง`,
              { sticky: true }
            )

            polylinesRef.current.push(polyline)
            labelsRef.current.push(label)

            cumulativeTime = endTime
          }
        })
      }

      if (stations.length > 0) {
        const bounds = L.latLngBounds(stations.map(s => [s.latitude, s.longitude]))
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    }

    updateMapContent()
  }, [stations, reaches, onStationClick, isInitialized])

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
