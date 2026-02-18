import type { RiverConfig } from '@/lib/osm/types'

export const RIVER_CONFIGS: RiverConfig[] = [
  { key: 'ping', names: ['แม่น้ำปิง', 'Ping River', 'Mae Nam Ping'] },
  { key: 'chao-phraya', names: ['แม่น้ำเจ้าพระยา', 'Chao Phraya River'] },
  { key: 'wang', names: ['แม่น้ำวัง', 'Wang River'] },
  { key: 'yom', names: ['แม่น้ำยม', 'Yom River'] },
  { key: 'nan', names: ['แม่น้ำน่าน', 'Nan River'] },
]

export function getRiverConfigByKey(riverKey: string): RiverConfig | undefined {
  return RIVER_CONFIGS.find((river) => river.key === riverKey)
}
