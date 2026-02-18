'use client';

import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';

type WaterDataPoint = {
  time: string;
  timestamp: number;
  p1: number;
  p2: number;
  isPrediction?: boolean;
};

type WaterLevelChartProps = {
  title?: string;
  data: WaterDataPoint[];
  maxValue?: number;
  predictionStartIndex?: number; // จุดเริ่มคาดการณ์
};

// 1. Declare constants for styling
const CHART_PRIMARY_COLOR = 'var(--chart-line-primary)';
const CHART_SECONDARY_COLOR = 'var(--chart-line-secondary)';
const ACTIVE_BUTTON_COLOR = 'var(--color-secondary)';
const INACTIVE_BUTTON_BG = 'var(--color-surface-soft)';
const INACTIVE_BUTTON_TEXT = 'var(--color-text-muted)';

// 2. Styled Components
const StyledChartCard = styled.div`
  background: var(--color-surface);
  border-radius: 18px;
  padding: 24px;
  box-shadow: var(--shadow-card);
  font-family: 'Kanit', sans-serif;
  width: 100%;
  max-width: 900px;
  min-height: 520px;
  margin: 32px auto 0;

  & .chart-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    width: 100%;
  }

  & .chart-title {
    font-family: 'Kanit', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0;
    flex: 1;
  }

  & .header-controls {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  & .controls {
    display: flex;
    align-items: center;
    gap: 0;
  }

  & .legend-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  & .legend-btn {
    font-family: 'Kanit', sans-serif;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text-muted);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: var(--color-secondary);
    }

    &.active {
      border-color: transparent;
      background: var(--color-surface-soft);
    }

    &.p1 {
      .legend-dot {
        background: ${CHART_PRIMARY_COLOR};
      }
    }

    &.p2 {
      .legend-dot {
        background: ${CHART_SECONDARY_COLOR};
      }
    }
  }

  & .legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  & .toggle-btn {
    font-family: 'Kanit', sans-serif;
    padding: 10px 20px;
    border-radius: 9999px;
    border: none;
    background: ${INACTIVE_BUTTON_BG};
    color: ${INACTIVE_BUTTON_TEXT};
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;

    &:first-child {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      padding-right: 24px;
    }

    &:last-child {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      padding-left: 24px;
    }

    &:hover {
      background: var(--color-border);
    }

    &.active {
      background: ${ACTIVE_BUTTON_COLOR};
      color: white;
      box-shadow: var(--shadow-soft);
    }
  }

  & .divider {
    width: 1px;
    height: 24px;
    background: var(--color-border);
  }

  & .chart-area {
    height: 450px;
    width: 100%;
    min-height: 340px;
    min-width: 0;
  }

  & .empty-state {
    height: 100%;
    border: 1px dashed var(--color-border);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-muted);
    font-size: 16px;
    text-align: center;
    padding: 16px;
  }

  @media (max-width: 900px) {
    padding: 18px;
    min-height: 420px;

    & .chart-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    & .header-controls {
      width: 100%;
      flex-wrap: wrap;
      gap: 10px;
    }

    & .chart-area {
      height: 320px;
    }
  }
`;

export default function WaterLevelChart({
  title = "กราฟแสดงระดับน้ำปัจจุบัน",
  data,
  maxValue = 100,
  predictionStartIndex,
}: WaterLevelChartProps) {
  const [unit, setUnit] = useState<"m" | "%">("m");
  const [showP1, setShowP1] = useState(true);
  const [showP2, setShowP2] = useState(true);

  // แปลงหน่วยข้อมูล
  const convertedData = useMemo(() => {
    if (unit === "m") {
      return data;
    }
    return data.map(d => ({
      ...d,
      p1: (d.p1 / maxValue) * 100,
      p2: (d.p2 / maxValue) * 100,
    }));
  }, [data, unit, maxValue]);

  // predictionStartIndex คือ index ของ "จุดแรกที่เป็นคาดการณ์"
  const validPredictionStartIndex = useMemo(() => {
    if (
      typeof predictionStartIndex !== "number" ||
      !Number.isInteger(predictionStartIndex) ||
      predictionStartIndex <= 0 ||
      predictionStartIndex >= convertedData.length
    ) {
      return null;
    }
    return predictionStartIndex;
  }, [predictionStartIndex, convertedData.length]);

  const chartData = useMemo(() => {
    return convertedData.map((point, index) => {
      const isPrediction = validPredictionStartIndex !== null && index >= validPredictionStartIndex;
      const isPredictionBridgePoint =
        validPredictionStartIndex !== null && index === validPredictionStartIndex - 1;

      return {
        ...point,
        p1Actual: isPrediction ? null : point.p1,
        p2Actual: isPrediction ? null : point.p2,
        p1Prediction: isPrediction || isPredictionBridgePoint ? point.p1 : null,
        p2Prediction: isPrediction || isPredictionBridgePoint ? point.p2 : null,
      };
    });
  }, [convertedData, validPredictionStartIndex]);

  const predictionDividerIndex = useMemo(() => {
    if (validPredictionStartIndex === null) {
      return null;
    }
    return Math.max(validPredictionStartIndex - 1, 0);
  }, [validPredictionStartIndex]);

  const timeByTimestamp = useMemo(
    () => new Map(chartData.map(point => [point.timestamp, point.time])),
    [chartData]
  );

  return (
    <StyledChartCard>
      {/* Header */}
      <div className="chart-header">
        {/* Title (left) */}
        <h2 className="chart-title">
          {title}
        </h2>

        {/* Controls (right) */}
        <div className="header-controls">
          {/* P1 P2 Legend */}
          <div className="legend-controls">
            <button
              className={`legend-btn p1 ${showP1 ? "active" : ""}`}
              onClick={() => setShowP1(!showP1)}
              aria-pressed={showP1}
            >
              <span className="legend-dot"></span>
              P1
            </button>
            <button
              className={`legend-btn p2 ${showP2 ? "active" : ""}`}
              onClick={() => setShowP2(!showP2)}
              aria-pressed={showP2}
            >
              <span className="legend-dot"></span>
              P2
            </button>
          </div>

          {/* เมตร | เปอร์เซ็น */}
          <div className="controls">
            <button
              onClick={() => setUnit("m")}
              className={`toggle-btn ${unit === "m" ? "active" : ""}`}
              aria-pressed={unit === "m"}
            >
              เมตร (ม.)
            </button>
            <div className="divider" />
            <button
              onClick={() => setUnit("%")}
              className={`toggle-btn ${unit === "%" ? "active" : ""}`}
              aria-pressed={unit === "%"}
            >
              เปอร์เซ็น (%)
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-area">
        {chartData.length === 0 ? (
          <div className="empty-state">ไม่พบข้อมูลกราฟตามตัวกรองที่เลือก</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value: number) => timeByTimestamp.get(value) || ""}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={{ stroke: 'var(--color-border)' }}
              tick={{
                fill: 'var(--color-text-muted)',
                fontSize: 12,
                fontFamily: "'Kanit', sans-serif"
              }}
              interval={2}
            />
            <YAxis
              unit={unit === "%" ? "%" : "ม."}
              domain={unit === "%" ? [0, 100] : ["auto", "auto"]}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={{ stroke: 'var(--color-border)' }}
              tick={{
                fill: 'var(--color-text-muted)',
                fontSize: 12,
                fontFamily: "'Kanit', sans-serif"
              }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0) {
                  return null;
                }

                const hasPredictionSeries = payload.some((entry) =>
                  String(entry?.name || "").includes("(คาดการณ์)")
                );

                const visiblePayload = payload.filter((entry) => {
                  if (typeof entry?.value !== "number") return false;
                  if (!hasPredictionSeries) return true;
                  return String(entry?.name || "").includes("(คาดการณ์)");
                });

                if (visiblePayload.length === 0) {
                  return null;
                }

                const timeLabel =
                  typeof label === "number" ? timeByTimestamp.get(label) : undefined;

                return (
                  <div
                    style={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: 'var(--shadow-soft)',
                      backgroundColor: 'var(--color-surface)',
                      fontFamily: "'Kanit', sans-serif",
                      padding: '12px',
                    }}
                  >
                    <p style={{ margin: '0 0 8px 0', color: 'var(--color-text)', fontWeight: 600 }}>
                      {timeLabel ? `เวลา ${timeLabel}` : 'เวลา'}
                    </p>
                    {visiblePayload.map((entry) => {
                      const value = entry.value as number;
                      const formattedValue =
                        unit === "%" ? `${value.toFixed(1)} %` : `${value} ม.`;

                      return (
                        <p
                          key={`${entry.dataKey}-${entry.name}`}
                          style={{
                            margin: '0 0 6px 0',
                            color: entry.color || 'var(--color-text-muted)',
                            fontWeight: 500,
                          }}
                        >
                          {`${entry.name}: ${formattedValue}`}
                        </p>
                      );
                    })}
                  </div>
                );
              }}
            />

            {/* เส้นแนวตั้งแบ่งเวลาปัจจุบัน */}
            {predictionDividerIndex !== null && (
              <ReferenceLine
                x={chartData[predictionDividerIndex]?.timestamp}
                stroke="var(--color-text-subtle)"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{ value: 'เวลาปัจจุบัน', position: 'left', fill: 'var(--color-text-muted)', fontSize: 11, fontFamily: "'Kanit', sans-serif", fontWeight: 500 }}
              />
            )}

            {/* Historical Lines (สีจริง) */}
            {showP1 && (
              <Line
                type="monotone"
                dataKey="p1Actual"
                name="P1"
                stroke={CHART_PRIMARY_COLOR}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />
            )}
            {showP2 && (
              <Line
                type="monotone"
                dataKey="p2Actual"
                name="P2"
                stroke={CHART_SECONDARY_COLOR}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />
            )}

            {/* Prediction Lines (สีเทาประ) */}
            {showP1 && validPredictionStartIndex !== null && (
              <Line
                type="monotone"
                dataKey="p1Prediction"
                name="P1 (คาดการณ์)"
                stroke="var(--chart-line-prediction)"
                strokeWidth={3}
                strokeDasharray="8 4"
                dot={false}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />
            )}
            {showP2 && validPredictionStartIndex !== null && (
              <Line
                type="monotone"
                dataKey="p2Prediction"
                name="P2 (คาดการณ์)"
                stroke="var(--chart-line-prediction)"
                strokeWidth={3}
                strokeDasharray="8 4"
                dot={false}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />
            )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </StyledChartCard>
  );
}
