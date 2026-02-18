'use client';

import React from 'react';
import styled from 'styled-components';
import { Flag, MapPin, Waves } from 'lucide-react';

const Card = styled.section`
  background: var(--color-surface-soft);
  border-radius: 18px;
  padding: 20px;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
  margin-bottom: 16px;
`;

const MetaItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-primary);
  font-family: var(--font-kanit), sans-serif;
  font-size: 20px;
  font-weight: 500;

  svg {
    width: 18px;
    height: 18px;
    color: var(--color-secondary);
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  max-width: 560px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: var(--color-surface);
  border: 1.5px solid var(--color-secondary);
  border-radius: 16px;
  padding: 18px;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .label {
    margin: 0;
    color: var(--color-text);
    font-family: var(--font-kanit), sans-serif;
    font-size: 27px;
    font-weight: 500;
    line-height: 1.2;
  }

  .value {
    margin: 6px 0 0;
    color: var(--color-text);
    font-family: var(--font-kanit), sans-serif;
    font-size: 38px;
    font-weight: 600;
    line-height: 1.15;
  }
`;

interface StationOverviewCardProps {
  province: string;
  district: string;
  bankLevel: number;
  waterLevel: number;
  nearOverflowPercentage: number;
}

export default function StationOverviewCard({
  province,
  district,
  bankLevel,
  waterLevel,
  nearOverflowPercentage
}: StationOverviewCardProps) {
  return (
    <Card>
      <MetaRow>
        <MetaItem>
          <MapPin />
          <span>{province} - {district}</span>
        </MetaItem>
        <MetaItem>
          <Waves />
          <span>ริมตลิ่ง: {bankLevel.toFixed(2)} ม.</span>
        </MetaItem>
        <MetaItem>
          <Flag />
          <span>สถานีต้นน้ำแม่น้ำปิง</span>
        </MetaItem>
      </MetaRow>

      <StatGrid>
        <StatCard>
          <p className="label">ระดับน้ำปัจจุบัน</p>
          <p className="value">{waterLevel.toFixed(2)} ม.</p>
        </StatCard>
        <StatCard>
          <p className="label">ใกล้ตลิ่ง</p>
          <p className="value">{nearOverflowPercentage.toFixed(1)} %</p>
        </StatCard>
      </StatGrid>
    </Card>
  );
}
