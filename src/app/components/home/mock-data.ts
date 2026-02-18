const MOCK_STATIONS: Array<{
  station_id: string
  name: string
  province: string
  district: string
  latitude: number
  longitude: number
  bank_level_m: number
  sensor_height_m: number
  status: 'green' | 'yellow' | 'red'
  percent_of_bank: number
  latest_reading: {
    water_level_m: number
    ts: string
  }
}> = []

const now = new Date()

const station001 = {
  station_id: 'ST001',
  name: 'สถานีแม่ริม',
  province: 'เชียงใหม่',
  district: 'แม่ริม',
  latitude: 18.9186,
  longitude: 98.9219,
  bank_level_m: 4.5,
  sensor_height_m: 0.5,
  status: 'green' as const,
  percent_of_bank: 45.2,
  latest_reading: {
    water_level_m: 2.034,
    ts: now.toISOString()
  }
}

const station002 = {
  station_id: 'ST002',
  name: 'สถานีเมืองเชียงใหม่',
  province: 'เชียงใหม่',
  district: 'เมืองเชียงใหม่',
  latitude: 18.7883,
  longitude: 98.9853,
  bank_level_m: 5.2,
  sensor_height_m: 0.5,
  status: 'yellow' as const,
  percent_of_bank: 86.5,
  latest_reading: {
    water_level_m: 4.498,
    ts: new Date(now.getTime() - 2.5 * 60 * 60 * 1000).toISOString()
  }
}

const station003 = {
  station_id: 'ST003',
  name: 'สถานีสันทราย',
  province: 'เชียงใหม่',
  district: 'สันทราย',
  latitude: 18.8431,
  longitude: 99.0158,
  bank_level_m: 4.8,
  sensor_height_m: 0.5,
  status: 'red' as const,
  percent_of_bank: 108.2,
  latest_reading: {
    water_level_m: 5.194,
    ts: new Date(now.getTime() - (2.5 + 1.8) * 60 * 60 * 1000).toISOString()
  }
}

const station004 = {
  station_id: 'ST004',
  name: 'สถานีลำพูน',
  province: 'ลำพูน',
  district: 'เมืองลำพูน',
  latitude: 18.5744,
  longitude: 99.0081,
  bank_level_m: 5.5,
  sensor_height_m: 0.5,
  status: 'red' as const,
  percent_of_bank: 126.4,
  latest_reading: {
    water_level_m: 6.952,
    ts: new Date(now.getTime() - (2.5 + 1.8 + 4.2) * 60 * 60 * 1000).toISOString()
  }
}

MOCK_STATIONS.push(station001, station002, station003, station004)

const MOCK_REACHES: Array<{
  upstream_station: string
  downstream_station: string
  typical_travel_hr: number
}> = [
  {
    upstream_station: 'ST001',
    downstream_station: 'ST002',
    typical_travel_hr: 2.5
  },
  {
    upstream_station: 'ST002',
    downstream_station: 'ST003',
    typical_travel_hr: 1.8
  },
  {
    upstream_station: 'ST003',
    downstream_station: 'ST004',
    typical_travel_hr: 4.2
  }
]

export { MOCK_STATIONS, MOCK_REACHES }
