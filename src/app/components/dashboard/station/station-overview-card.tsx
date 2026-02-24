'use client';

import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, CheckCircle2, Flag, MapPin, ShieldAlert, Waves } from 'lucide-react';
import type { StationRiskStatus } from '@/lib/types';

const Card = styled.section<{ $status: StationRiskStatus }>`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 18px;
  padding: 18px;

  ${({ $status }) => {
    if ($status === 'critical') {
      return `
        border-color: var(--status-danger-border);
        background: linear-gradient(135deg, #fff8f8 0%, #fff 52%);
      `;
    }
    if ($status === 'warning') {
      return `
        border-color: var(--status-warning-border);
        background: linear-gradient(135deg, #fffdf5 0%, #fff 52%);
      `;
    }
    return `
      border-color: var(--status-safe-border);
      background: linear-gradient(135deg, #f4fff8 0%, #fff 52%);
    `;
  }}
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const MetaGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
`;

const StatusMeta = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 820px) {
    justify-content: flex-start;
  }
`;

const StatusBadge = styled.span<{ $status: StationRiskStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  padding: 6px 12px;
  font-family: var(--font-kanit), sans-serif;
  font-size: 14px;
  line-height: 1.2;
  font-weight: 600;
  border: 1px solid;
  white-space: nowrap;
  ${({ $status }) => {
    if ($status === 'critical') {
      return `
        color: var(--status-danger);
        border-color: var(--status-danger-border);
        background: var(--status-danger-bg);
      `;
    }
    if ($status === 'warning') {
      return `
        color: var(--status-warning);
        border-color: var(--status-warning-border);
        background: var(--status-warning-bg);
      `;
    }
    return `
      color: var(--status-safe);
      border-color: var(--status-safe-border);
      background: var(--status-safe-bg);
    `;
  }}

  svg {
    width: 16px;
    height: 16px;
  }
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
  statusLabel: string;
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
  statusLabel,
  riskMessage
}: StationOverviewCardProps) {
  const StatusIcon =
    riskStatus === 'critical' ? ShieldAlert : riskStatus === 'warning' ? AlertTriangle : CheckCircle2;

  return (
    <Card $status={riskStatus}>
      <MetaRow>
        <MetaGroup>
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
        </MetaGroup>
        <StatusMeta>
          <StatusBadge $status={riskStatus}>
            <StatusIcon />
            {`สถานะ: ${statusLabel}`}
          </StatusBadge>
        </StatusMeta>
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
