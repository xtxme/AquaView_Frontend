'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 1. Declare a variable for chart configuration
const CHART_PRIMARY_COLOR = '#3B82F6'; // Blue
const CHART_SECONDARY_COLOR = '#8B5CF6'; // Purple

// 2. Styled Components using Class Selectors
const StyledChartCard = styled.div`
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);

  & .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  & .chart-title {
    font-size: 18px;
    font-weight: 600;
    color: #1E293B;
    margin: 0;
  }

  & .controls {
    display: flex;
    gap: 12px;
  }

  & .toggle-btn {
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid #3B82F6;
    background: transparent;
    color: #3B82F6;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #EFF6FF;
    }

    &.active {
      background: #3B82F6;
      color: white;
      box-shadow: 0px 2px 4px rgba(59, 130, 246, 0.3);
    }
  }

  & .chart-area {
    height: 300px;
    width: 100%;
  }
`;

const data = [
  { time: '1:00', p1: 2.0, p2: 1.0 },
  { time: '3:00', p1: 3.0, p2: 2.0 },
  { time: '5:00', p1: 2.0, p2: 1.0 },
  { time: '7:00', p1: 4.0, p2: 3.0 },
  { time: '9:00', p1: 3.0, p2: 2.0 },
  { time: '11:00', p1: 5.0, p2: 4.0 },
  { time: '13:00', p1: 4.0, p2: 3.0 },
  { time: '15:00', p1: 3.0, p2: 2.0 },
  { time: '17:00', p1: 4.0, p2: 3.0 },
  { time: '19:00', p1: 5.0, p2: 4.0 },
  { time: '21:00', p1: 6.0, p2: 5.0 },
  { time: '23:00', p1: 5.0, p2: 4.0 },
];

export function WaterLevelChart() {
  const [activeTab, setActiveTab] = useState<'p1' | 'p2' | 'both'>('both');

  return (
    <StyledChartCard>
      <div className="chart-header">
        <h3 className="chart-title">การเปลี่ยนแปลงระดับน้ำสถานี</h3>
        <div className="controls">
          <button
            className={`toggle-btn ${activeTab === 'p1' ? 'active' : ''}`}
            onClick={() => setActiveTab('p1')}
          >
            ตรวจ P1
          </button>
          <button
            className={`toggle-btn ${activeTab === 'p2' ? 'active' : ''}`}
            onClick={() => setActiveTab('p2')}
          >
            ตรวจ P2
          </button>
        </div>
      </div>

      <div className="chart-area">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }}
            />
            {(activeTab === 'p1' || activeTab === 'both') && (
              <Line
                type="monotone"
                dataKey="p1"
                stroke={CHART_PRIMARY_COLOR}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            )}
            {(activeTab === 'p2' || activeTab === 'both') && (
              <Line
                type="monotone"
                dataKey="p2"
                stroke={CHART_SECONDARY_COLOR}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </StyledChartCard>
  );
}
