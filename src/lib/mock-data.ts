// Mock Data สำหรับระบบเฝ้าระวังระดับน้ำ
// ข้อมูลจำลองที่สอดคล้องกันสำหรับ 4 สถานีตามแม่น้ำปิง

import { Station, Reading, Reach, Threshold, Alert } from './types'

// ========== STATIONS ==========
const mockStations: Station[] = [
    {
        station_id: 'ST001',
        name: 'สถานีแม่ริม',
        province: 'เชียงใหม่',
        district: 'แม่ริม',
        latitude: 18.9186,
        longitude: 98.9219,
        bank_level_m: 4.5,
        sensor_height_m: 0.5,
        description: 'สถานีต้นน้ำแม่น้ำปิง ติดตั้งที่อำเภอแม่ริม จังหวัดเชียงใหม่',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        station_id: 'ST002',
        name: 'สถานีเมืองเชียงใหม่',
        province: 'เชียงใหม่',
        district: 'เมืองเชียงใหม่',
        latitude: 18.7883,
        longitude: 98.9853,
        bank_level_m: 5.2,
        sensor_height_m: 0.5,
        description: 'สถานีกลางเมืองเชียงใหม่ ใกล้สะพานนวรัฐ',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        station_id: 'ST003',
        name: 'สถานีสันทราย',
        province: 'เชียงใหม่',
        district: 'สันทราย',
        latitude: 18.8431,
        longitude: 99.0158,
        bank_level_m: 4.8,
        sensor_height_m: 0.5,
        description: 'สถานีท้ายน้ำอำเภอสันทราย จังหวัดเชียงใหม่',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        station_id: 'ST004',
        name: 'สถานีลำพูน',
        province: 'ลำพูน',
        district: 'เมืองลำพูน',
        latitude: 18.5744,
        longitude: 99.0081,
        bank_level_m: 5.5,
        sensor_height_m: 0.5,
        description: 'สถานีปลายน้ำที่จังหวัดลำพูน',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    }
]

// ========== READINGS (24 ชั่วโมงข้อมูลย้อนหลัง) ==========
// สร้างข้อมูลที่แสดงภาวะน้ำหลาก: น้ำขึ้นจากสถานีต้นน้ำ และเดินทางไปสถานีปลายน้ำ
const mockReadings: Reading[] = []

const now = new Date()
const hoursBack = 24

// สร้างข้อมูลสำหรับแต่ละสถานี
mockStations.forEach((station, stationIndex) => {
    for (let i = hoursBack; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)

        // จำลองการไหลของน้ำ: สถานีต้นน้ำมีน้ำขึ้นก่อน แล้วค่อยๆ ไหลลงไป
        const timeDelay = stationIndex * 2 // แต่ละสถานีห่างกัน 2 ชั่วโมง
        const adjustedHour = i - timeDelay

        let waterLevel: number
        let status: 'green' | 'yellow' | 'red'

        if (adjustedHour < 0) {
            // ยังไม่มีน้ำมาถึง (สถานีปลายน้ำ)
            waterLevel = 0.8 + Math.random() * 0.3 // 0.8-1.1m (ปกติ)
            status = 'green'
        } else if (adjustedHour >= 18) {
            // ภาวะปกติ
            waterLevel = 1.0 + Math.random() * 0.5 // 1.0-1.5m
            status = 'green'
        } else if (adjustedHour >= 12) {
            // เริ่มมีน้ำขึ้น
            const riseRate = (18 - adjustedHour) / 6
            waterLevel = 1.5 + riseRate * 1.5 + Math.random() * 0.3 // 1.5-3.3m
            status = waterLevel / station.bank_level_m > 0.7 ? 'yellow' : 'green'
        } else if (adjustedHour >= 6) {
            // น้ำสูงสุด (peak)
            waterLevel = 3.2 + Math.random() * 0.8 // 3.2-4.0m
            status = waterLevel / station.bank_level_m > 0.8 ? 'red' : 'yellow'
        } else {
            // น้ำเริ่มลด
            const fallRate = adjustedHour / 6
            waterLevel = 4.0 - (1 - fallRate) * 1.0 + Math.random() * 0.3 // 3.0-4.0m
            status = waterLevel / station.bank_level_m > 0.7 ? 'yellow' : 'green'
        }

        const ultrasonic_depth = station.sensor_height_m + station.bank_level_m - waterLevel

        mockReadings.push({
            id: `R${stationIndex}${String(i).padStart(3, '0')}`,
            station_id: station.station_id,
            ts: timestamp.toISOString(),
            ultrasonic_depth_m: parseFloat(ultrasonic_depth.toFixed(3)),
            water_level_m: parseFloat(waterLevel.toFixed(3)),
            battery_pct: 85 + Math.random() * 10,
            raw_payload: JSON.stringify({
                device: station.station_id,
                timestamp: timestamp.toISOString(),
                depth: ultrasonic_depth,
                battery: 85 + Math.random() * 10
            }),
            created_at: timestamp.toISOString()
        })
    }
})

// เรียงข้อมูลตามเวลา (ใหม่สุดก่อน)
mockReadings.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())

// ========== REACHES (เส้นทางน้ำ) ==========
const mockReaches: Reach[] = [
    {
        id: 'RC001',
        upstream_station: 'ST001',
        downstream_station: 'ST002',
        distance_m: 18000, // 18 km
        typical_travel_hr: 2.5,
        description: 'แม่ริม → เมืองเชียงใหม่',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'RC002',
        upstream_station: 'ST002',
        downstream_station: 'ST003',
        distance_m: 12000, // 12 km
        typical_travel_hr: 1.8,
        description: 'เมืองเชียงใหม่ → สันทราย',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'RC003',
        upstream_station: 'ST003',
        downstream_station: 'ST004',
        distance_m: 35000, // 35 km
        typical_travel_hr: 4.2,
        description: 'สันทราย → ลำพูน',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    }
]

// ========== THRESHOLDS (ค่าเกณฑ์) ==========
const mockThresholds: Threshold[] = [
    {
        id: 'TH001',
        station_id: 'ST001',
        yellow_threshold_m: 3.0,
        red_threshold_m: 4.0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'TH002',
        station_id: 'ST002',
        yellow_threshold_m: 3.5,
        red_threshold_m: 4.5,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'TH003',
        station_id: 'ST003',
        yellow_threshold_m: 3.2,
        red_threshold_m: 4.3,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'TH004',
        station_id: 'ST004',
        yellow_threshold_m: 3.8,
        red_threshold_m: 5.0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    }
]

// ========== ALERTS (ตัวอย่างการแจ้งเตือน) ==========
const mockAlerts: Alert[] = [
    {
        id: 'AL001',
        station_id: 'ST001',
        alert_type: 'threshold_breach',
        severity: 'yellow',
        message: 'ระดับน้ำที่สถานีแม่ริมถึงระดับเฝ้าระวัง (3.2m)',
        water_level_m: 3.2,
        triggered_at: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
        resolved_at: null,
        is_active: true,
        created_at: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'AL002',
        station_id: 'ST002',
        alert_type: 'pre_alert',
        severity: 'yellow',
        message: 'คาดการณ์ระดับน้ำที่สถานีเมืองเชียงใหม่จะถึงระดับเฝ้าระวังในอีก 2.5 ชั่วโมง',
        water_level_m: 2.8,
        triggered_at: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
        resolved_at: null,
        is_active: true,
        created_at: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'AL003',
        station_id: 'ST001',
        alert_type: 'threshold_breach',
        severity: 'red',
        message: 'ระดับน้ำที่สถานีแม่ริมถึงระดับอันตราย (4.1m)',
        water_level_m: 4.1,
        triggered_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        resolved_at: null,
        is_active: true,
        created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
    }
]

// ========== HELPER FUNCTIONS ==========

// ดึงข้อมูลล่าสุดของแต่ละสถานี
function getLatestReadings(): (Reading & { station: Station })[] {
    const latest: (Reading & { station: Station })[] = []

    mockStations.forEach(station => {
        const stationReadings = mockReadings
            .filter(r => r.station_id === station.station_id)
            .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())

        if (stationReadings.length > 0) {
            latest.push({
                ...stationReadings[0],
                station
            })
        }
    })

    return latest
}

// คำนวณสถานะตามระดับน้ำ
function calculateStatus(waterLevel: number, bankLevel: number): 'green' | 'yellow' | 'red' {
    const percentage = (waterLevel / bankLevel) * 100

    if (percentage >= 80) return 'red'
    if (percentage >= 70) return 'yellow'
    return 'green'
}

// ดึงข้อมูลย้อนหลัง 24 ชั่วโมงของสถานี
function getStationHistory(stationId: string, hours: number = 24): Reading[] {
    return mockReadings
        .filter(r => r.station_id === stationId)
        .slice(0, hours)
}

// คำนวณ delta ระหว่างชั่วโมง
function calculateDelta(current: number, previous: number | null): number {
    if (previous === null) return 0
    return parseFloat((current - previous).toFixed(3))
}

// ตัวอย่างข้อมูลสำหรับ Ingestion API
const sampleIngestPayload = {
    device_id: "ST001",
    timestamp: new Date().toISOString(),
    ultrasonic_depth_m: 1.234,
    battery_pct: 87.5,
    temperature_c: 28.5,
    signal_strength: -65
}

// ตัวอย่าง Response ที่คาดหวังจาก API
const expectedApiResponses = {
    stations: mockStations,
    latestReadings: getLatestReadings(),
    stationDetail: {
        station: mockStations[0],
        latestReading: mockReadings.find(r => r.station_id === 'ST001'),
        history: getStationHistory('ST001', 24),
        reaches: mockReaches.filter(r =>
            r.upstream_station === 'ST001' || r.downstream_station === 'ST001'
        ),
        threshold: mockThresholds.find(t => t.station_id === 'ST001'),
        activeAlerts: mockAlerts.filter(a => a.station_id === 'ST001' && a.is_active)
    }
}

export const MOCK_STATIONS = mockStations
export const MOCK_READINGS = mockReadings
export const MOCK_REACHES = mockReaches
export const MOCK_THRESHOLDS = mockThresholds
export const MOCK_ALERTS = mockAlerts

export function getMockStationWithLatestReading(stationId: string) {
    const station = mockStations.find(s => s.station_id === stationId)
    if (!station) return null

    const latestReading = mockReadings
        .filter(r => r.station_id === stationId)
        .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())[0]

    const threshold = mockThresholds.find(t => t.station_id === stationId)

    const percentOfBank = latestReading?.water_level_m
        ? (latestReading.water_level_m / station.bank_level_m) * 100
        : 0

    let status: 'green' | 'yellow' | 'red' = 'green'
    if (threshold) {
        const greenMaxPct = 70
        const yellowMaxPct = 80
        const redMaxPct = 90

        if (percentOfBank >= redMaxPct) {
            status = 'red'
        } else if (percentOfBank >= yellowMaxPct) {
            status = 'yellow'
        }
    }

    return {
        ...station,
        latest_reading: latestReading,
        percent_of_bank: percentOfBank,
        status,
        thresholds: threshold ? [{
            green_max_pct: 70,
            yellow_max_pct: 80,
            red_max_pct: 90,
            ...threshold
        }] : []
    }
}
