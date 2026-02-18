'use client'

interface WaterLevelLegendItemProps {
    dotBackgroundColor: string
    dotBorderColor: string
    textColor: string
    label: string
}

function WaterLevelLegendItem({
    dotBackgroundColor,
    dotBorderColor,
    textColor,
    label,
}: WaterLevelLegendItemProps) {
    return (
        <div className="flex items-center gap-3">
            <div
                className="w-4 h-4 rounded-full border-2 shadow-sm"
                style={{ backgroundColor: dotBackgroundColor, borderColor: dotBorderColor }}
            />
            <span className="text-xs" style={{ color: textColor }}>{label}</span>
        </div>
    )
}

export function WaterLevelLegend() {
    return (
        <div className="absolute bottom-4 left-4 bg-slate-900/95 backdrop-blur-sm rounded-lg shadow-xl p-4 border border-slate-700 z-[1000]">
            <div className="text-sm font-semibold mb-3 text-white">เกณฑ์ระดับน้ำ</div>
            <div className="space-y-2">
                <WaterLevelLegendItem
                    dotBackgroundColor="var(--status-safe-bg)"
                    dotBorderColor="var(--status-safe)"
                    textColor="var(--status-safe)"
                    label="ปกติ < 80% ของระดับอันตราย"
                />
                <WaterLevelLegendItem
                    dotBackgroundColor="var(--status-warning-bg)"
                    dotBorderColor="var(--status-warning)"
                    textColor="var(--status-warning)"
                    label="เฝ้าระวัง 80% - 99.9%"
                />
                <WaterLevelLegendItem
                    dotBackgroundColor="var(--status-danger-bg)"
                    dotBorderColor="var(--status-danger)"
                    textColor="var(--status-danger)"
                    label="อันตราย ≥ 100%"
                />
            </div>
        </div>
    )
}
