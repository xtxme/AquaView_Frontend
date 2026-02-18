'use client';

import React from 'react';
import styled from 'styled-components';
import { Calendar } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

type StationHistoryPoint = {
  time: string;
  waterLevel: number;
};

const ChartCard = styled.section`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 14px 14px 12px;

  .chart-caption {
    margin: 0 0 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--color-text);
    font-family: var(--font-kanit), sans-serif;
    font-size: 12px;
    font-weight: 500;
  }

  .chart-area {
    width: 100%;
    height: 250px;
  }
`;

interface StationHistoryChartProps {
  data: StationHistoryPoint[];
  maxValue: number;
  predictionStartIndex?: number;
}

export default function StationHistoryChart({
  data,
  maxValue,
  predictionStartIndex
}: StationHistoryChartProps) {
  const hasPredictionDivider =
    typeof predictionStartIndex === 'number' &&
    Number.isInteger(predictionStartIndex) &&
    predictionStartIndex > 0 &&
    predictionStartIndex < data.length;

  if (data.length === 0) {
    return (
      <ChartCard>
        <p className="chart-caption">
          <Calendar size={12} />
          กราฟระดับน้ำ 24 ชั่วโมงย้อนหลัง
        </p>
        <div className="chart-area" style={{ display: 'grid', placeItems: 'center' }}>
          ไม่มีข้อมูลสำหรับแสดงผล
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard>
      <p className="chart-caption">
        <Calendar size={12} />
        กราฟระดับน้ำ 24 ชั่วโมงย้อนหลัง
      </p>
      <div className="chart-area">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tick={{ fill: 'var(--color-text-muted)', fontSize: 11, fontFamily: 'var(--font-kanit), sans-serif' }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={{ stroke: 'var(--color-border)' }}
              minTickGap={12}
            />
            <YAxis
              domain={[0, Number((maxValue * 1.1).toFixed(1))]}
              tick={{ fill: 'var(--color-text-muted)', fontSize: 11, fontFamily: 'var(--font-kanit), sans-serif' }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={{ stroke: 'var(--color-border)' }}
              width={42}
            />
            {hasPredictionDivider ? (
              <ReferenceLine
                x={data[predictionStartIndex].time}
                stroke="var(--color-text-muted)"
                strokeDasharray="6 6"
                strokeWidth={1.5}
              />
            ) : null}
            <Tooltip
              labelStyle={{ fontFamily: 'var(--font-kanit), sans-serif' }}
              contentStyle={{
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                fontFamily: 'var(--font-kanit), sans-serif'
              }}
              formatter={(value) => [
                typeof value === 'number' ? `${value.toFixed(2)} ม.` : '-',
                'ระดับน้ำ'
              ]}
            />
            <Line
              type="monotone"
              dataKey="waterLevel"
              stroke="var(--color-secondary)"
              strokeWidth={2}
              dot={{ r: 2, fill: 'var(--color-secondary)' }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
