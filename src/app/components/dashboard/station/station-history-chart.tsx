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

type ChartPoint = StationHistoryPoint & {
  actual: number | null;
  prediction: number | null;
};

const ChartCard = styled.section`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 14px;

  .chart-caption {
    margin: 0 0 10px;
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
    height: 280px;
  }

  .chart-legend {
    margin: 0 0 8px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 14px;
    font-family: var(--font-kanit), sans-serif;
    font-size: 13px;
    color: var(--color-text);
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .dot.actual {
    background: var(--color-secondary);
  }

  .dot.prediction {
    border: 2px dashed var(--color-text-muted);
  }

  .trend-summary {
    margin: 8px 0 0;
    color: var(--color-text-muted);
    font-family: var(--font-kanit), sans-serif;
    font-size: 14px;
    line-height: 1.4;
  }
`;

interface StationHistoryChartProps {
  data: StationHistoryPoint[];
  maxValue: number;
  predictionStartIndex?: number;
  predictionLabel?: string;
  trendSummary?: string;
}

export default function StationHistoryChart({
  data,
  maxValue,
  predictionStartIndex,
  predictionLabel = 'คาดการณ์ 6 ชั่วโมงข้างหน้า',
  trendSummary
}: StationHistoryChartProps) {
  const hasPredictionDivider =
    typeof predictionStartIndex === 'number' &&
    Number.isInteger(predictionStartIndex) &&
    predictionStartIndex > 0 &&
    predictionStartIndex < data.length;

  const chartData: ChartPoint[] = data.map((point, index) => {
    const inPrediction = hasPredictionDivider && index >= predictionStartIndex;
    const bridge = hasPredictionDivider && index === predictionStartIndex - 1;
    return {
      ...point,
      actual: inPrediction ? null : point.waterLevel,
      prediction: inPrediction || bridge ? point.waterLevel : null
    };
  });

  if (chartData.length === 0) {
    return (
      <ChartCard>
        <p className="chart-caption">
          <Calendar size={12} />
          กราฟระดับน้ำ 24 ชั่วโมงย้อนหลัง
        </p>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="dot actual" />
            ข้อมูลจริง
          </span>
          <span className="legend-item">
            <span className="dot prediction" />
            {predictionLabel}
          </span>
        </div>
        <div className="chart-area" style={{ display: 'grid', placeItems: 'center' }}>
          ไม่มีข้อมูลสำหรับแสดงผล
        </div>
        {trendSummary ? <p className="trend-summary">{trendSummary}</p> : null}
      </ChartCard>
    );
  }

  return (
    <ChartCard>
      <p className="chart-caption">
        <Calendar size={12} />
        กราฟระดับน้ำ 24 ชั่วโมงย้อนหลัง
      </p>
      <div className="chart-legend" aria-label="คำอธิบายกราฟ">
        <span className="legend-item">
          <span className="dot actual" />
          ข้อมูลจริง
        </span>
        <span className="legend-item">
          <span className="dot prediction" />
          {predictionLabel}
        </span>
      </div>
      <div className="chart-area">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
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
              dataKey="actual"
              stroke="var(--color-secondary)"
              strokeWidth={2.4}
              dot={{ r: 2, fill: 'var(--color-secondary)' }}
              activeDot={{ r: 4 }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="prediction"
              stroke="var(--color-text-muted)"
              strokeWidth={2}
              strokeDasharray="6 6"
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {trendSummary ? <p className="trend-summary">{trendSummary}</p> : null}
    </ChartCard>
  );
}
