export interface PopupStationData {
  station_id: string
  name: string
  status: 'green' | 'yellow' | 'red'
  percent_of_bank: number
  latest_reading?: {
    water_level_m: number | null
    ts: string
  }
}

export function buildStationPopupContent(station: PopupStationData, prevStation: PopupStationData | null): string {
  void prevStation
  const statusStyle = {
    green: { bg: 'var(--status-safe-bg)', fg: 'var(--status-safe)', text: 'ปกติ' },
    yellow: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning)', text: 'เฝ้าระวัง' },
    red: { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger)', text: 'อันตราย' },
  }[station.status]

  return `<div style="min-width: 200px; font-family: var(--font-kanit), sans-serif;">
    <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: var(--color-text);">${station.name}</div>
    <div style="font-size: 12px; color: var(--color-text-muted); margin-bottom: 4px;"><strong>ระดับน้ำ:</strong> ${station.latest_reading?.water_level_m?.toFixed(2) || 'N/A'} ม.</div>
    <div style="font-size: 12px; color: var(--color-text-muted); margin-bottom: 8px;"><strong>ใกล้ตลิ่ง:</strong> ${station.percent_of_bank.toFixed(1)}%</div>
    <div style="padding: 4px 8px; background: ${statusStyle.bg}; color: ${statusStyle.fg}; border-radius: 4px; font-size: 11px; font-weight: 600; text-align: center;">${statusStyle.text}</div>
  </div>`
}
