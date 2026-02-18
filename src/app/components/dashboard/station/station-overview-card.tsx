'use client';

import React from 'react';
import styled from 'styled-components';
import { Flag, MapPin, Waves } from 'lucide-react';
import type { StationRiskStatus } from '@/lib/types';

const Card = styled.section`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 18px;
  padding: 18px;
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
  font-size: 16px;
  font-weight: 500;

  svg {
    width: 18px;
    height: 18px;
    color: var(--color-secondary);
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 14px;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .label {
    margin: 0;
    color: var(--color-text-muted);
    font-family: var(--font-kanit), sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
  }

  .value {
    margin: 6px 0 0;
    color: var(--color-primary);
    font-family: var(--font-kanit), sans-serif;
    font-size: clamp(26px, 3vw, 32px);
    font-weight: 600;
    line-height: 1.15;
  }
`;

const RiskText = styled.p<{ $status: StationRiskStatus }>`
  margin: 10px 0 0;
  font-size: 14px;
  font-family: var(--font-kanit), sans-serif;
  color: ${({ $status }) => {
    if ($status === 'critical') return 'var(--status-danger)';
    if ($status === 'warning') return 'var(--status-warning)';
    return 'var(--status-safe)';
  }};
`;

interface StationOverviewCardProps {
  province: string;
  district: string;
  bankLevel: number;
  waterLevel: number;
  warningLevel: number;
  nearOverflowPercentage: number;
  riskStatus: StationRiskStatus;
  riskMessage: string;
}

export default function StationOverviewCard({
  province,
  district,
  bankLevel,
  waterLevel,
  warningLevel,
  nearOverflowPercentage,
  riskStatus,
  riskMessage
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
        <StatCard>
          <p className="label">ระดับเฝ้าระวัง (เริ่มเตือน)</p>
          <p className="value">{warningLevel.toFixed(2)} ม.</p>
        </StatCard>
      </StatGrid>
      <RiskText $status={riskStatus}>{riskMessage}</RiskText>
    </Card>
  );
}
