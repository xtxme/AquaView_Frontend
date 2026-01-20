'use client';

import React from 'react';
import styled from 'styled-components';
import { Waves, Battery, Clock, AlertTriangle } from 'lucide-react';

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6B7280;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
`;

const Value = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #1F2937;
`;

const SubText = styled.div<{ color?: string }>`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: ${({ color }) => color || '#9CA3AF'};
`;

interface StationStatsProps {
  waterLevel: number;
  bankLevel: number;
  battery: number;
  lastUpdate: string;
}

export const StationStats: React.FC<StationStatsProps> = ({ waterLevel, bankLevel, battery, lastUpdate }) => {
  const percentage = (waterLevel / bankLevel) * 100;

  // Format date
  const date = new Date(lastUpdate);
  const formattedDate = new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

  return (
    <StatsGrid>
      <StatCard>
        <CardHeader>
          <Waves size={16} />
          <span>ระดับน้ำปัจจุบัน</span>
        </CardHeader>
        <Value>{waterLevel.toFixed(2)} ม.</Value>
        <SubText>จากระดับตลิ่ง {bankLevel} ม.</SubText>
      </StatCard>

      <StatCard>
        <CardHeader>
          <AlertTriangle size={16} />
          <span>ความจุลำน้ำ</span>
        </CardHeader>
        <Value>{percentage.toFixed(1)}%</Value>
        <SubText color={percentage > 80 ? '#DC2626' : '#059669'}>
          {percentage > 80 ? 'ใกล้ล้นตลิ่ง' : 'อยู่ในเกณฑ์ปกติ'}
        </SubText>
      </StatCard>

      <StatCard>
        <CardHeader>
          <Clock size={16} />
          <span>ข้อมูลล่าสุด</span>
        </CardHeader>
        <Value>{formattedDate}</Value>
        <SubText>อัปเดตอัตโนมัติ</SubText>
      </StatCard>
    </StatsGrid>
  );
};
