'use client';

import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
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
const CHART_PRIMARY_COLOR = '#5B6CFF'; // Blue for P1
const CHART_SECONDARY_COLOR = '#E23BAA'; // Pink for P2
const ACTIVE_BUTTON_COLOR = '#2563EB';
const INACTIVE_BUTTON_BG = '#F3F4F6';
const INACTIVE_BUTTON_TEXT = '#6B7280';

// 2. Styled Components
const StyledChartCard = styled.div`
  background: #FFFFFF;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(1, 32, 95, 0.1);
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 900px;
  min-height: 550px;
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
    font-family: 'Inter', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #1E3A8A;
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
    font-family: 'Inter', sans-serif;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid #E5E7EB;
    background: #FFFFFF;
    color: #374151;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #2563EB;
    }

    &.active {
      border-color: transparent;
      background: #F3F4F6;
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
    font-family: 'Inter', sans-serif;
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
      background: #E5E7EB;
    }

    &.active {
      background: ${ACTIVE_BUTTON_COLOR};
      color: white;
      box-shadow: 0px 2px 8px rgba(37, 99, 235, 0.3);
    }
  }

  & .divider {
    width: 1px;
    height: 24px;
    background: rgba(0, 0, 0, 0.3);
  }

  & .chart-area {
    height: 450px;
    width: 100%;
    min-height: 400px;
    min-width: 300px;
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

  // แบ่งข้อมูลเป็น 2 ส่วน: Historical และ Prediction
  const { historicalData, predictionData } = useMemo(() => {
    if (!predictionStartIndex || predictionStartIndex <= 0) {
      return {
        historicalData: convertedData,
        predictionData: [] as WaterDataPoint[]
      };
    }
    // Historical: ถึงจุด predictionStartIndex - 1 (ไม่รวมจุดต่อเนื่อง)
    // Prediction: เริ่มจาก predictionStartIndex - 1 (รวมจุดต่อเนื่อง)
    return {
      historicalData: convertedData.slice(0, predictionStartIndex - 1),
      predictionData: convertedData.slice(predictionStartIndex - 1)
    };
  }, [convertedData, predictionStartIndex]);

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
            >
              <span className="legend-dot"></span>
              P1
            </button>
            <button
              className={`legend-btn p2 ${showP2 ? "active" : ""}`}
              onClick={() => setShowP2(!showP2)}
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
            >
              เมตร (ม.)
            </button>
            <div className="divider" />
            <button
              onClick={() => setUnit("%")}
              className={`toggle-btn ${unit === "%" ? "active" : ""}`}
            >
              เปอร์เซ็น (%)
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-area">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => {
                const dataPoint = data.find(d => d.timestamp === value);
                return dataPoint?.time || '';
              }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
              tick={{
                fill: '#6B7280',
                fontSize: 12,
                fontFamily: "'Inter', sans-serif"
              }}
              interval={2}
            />
            <YAxis
              unit={unit === "%" ? "%" : "ม."}
              domain={unit === "%" ? [0, 100] : ["auto", "auto"]}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
              tick={{
                fill: '#6B7280',
                fontSize: 12,
                fontFamily: "'Inter', sans-serif"
              }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                backgroundColor: '#FFFFFF',
                fontFamily: "'Inter', sans-serif"
              }}
              formatter={(value: number | undefined) =>
                value === undefined ? 'N/A' : unit === "%" ? `${value.toFixed(1)} %` : `${value} ม.`
              }
            />

            {/* เส้นแนวตั้งแบ่งเวลาปัจจุบัน */}
            {predictionStartIndex && predictionStartIndex > 0 && (
              <ReferenceLine
                x={convertedData[predictionStartIndex - 1]?.time}
                stroke="#9CA3AF"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{ value: 'เวลาปัจจุบัน', position: 'left', fill: '#6B7280', fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
              />
            )}

            {/* Historical Lines (สีจริง) */}
            {showP1 && (
              <Line
                type="monotone"
                dataKey="p1"
                data={historicalData}
                name="P1"
                stroke={CHART_PRIMARY_COLOR}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
            )}
            {showP2 && (
              <Line
                type="monotone"
                dataKey="p2"
                data={historicalData}
                name="P2"
                stroke={CHART_SECONDARY_COLOR}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
            )}

            {/* Prediction Lines (สีเทาประ) */}
            {showP1 && predictionData.length > 0 && (
              <Line
                type="monotone"
                dataKey="p1"
                data={predictionData}
                name="P1 (คาดการณ์)"
                stroke="#9CA3AF"
                strokeWidth={4}
                strokeDasharray="8 4"
                dot={false}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />
            )}
            {showP2 && predictionData.length > 0 && (
              <Line
                type="monotone"
                dataKey="p2"
                data={predictionData}
                name="P2 (คาดการณ์)"
                stroke="#9CA3AF"
                strokeWidth={4}
                strokeDasharray="8 4"
                dot={false}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </StyledChartCard>
  );
}
