'use client';

import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { StationRiskStatus } from '@/lib/types';

const HeroCard = styled.section<{ $status: StationRiskStatus }>`
  border-radius: 18px;
  padding: 20px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 20px;

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

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

const Left = styled.div`
  .status-row {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    font-family: var(--font-kanit), sans-serif;
  }

  .title {
    margin: 12px 0 6px;
    color: var(--color-primary);
    font-family: var(--font-kanit), sans-serif;
    font-size: clamp(28px, 3.2vw, 32px);
    font-weight: 700;
    line-height: 1.2;
  }

  .message {
    margin: 0;
    color: var(--color-text);
    font-size: 16px;
    line-height: 1.45;
    font-family: var(--font-kanit), sans-serif;
  }

  .sub {
    margin: 8px 0 0;
    color: var(--color-text-muted);
    font-size: 14px;
    line-height: 1.45;
    font-family: var(--font-kanit), sans-serif;
  }
`;

const Right = styled.div`
  border-radius: 14px;
  border: 1px solid var(--color-border);
  padding: 14px;
  background: var(--color-surface-soft);

  .label {
    margin: 0;
    font-size: 13px;
    color: var(--color-text-muted);
    font-family: var(--font-kanit), sans-serif;
  }

  .value {
    margin: 6px 0 10px;
    color: var(--color-primary);
    font-size: clamp(32px, 4vw, 36px);
    line-height: 1;
    font-weight: 700;
    font-family: var(--font-kanit), sans-serif;
  }

  .meta {
    margin: 0;
    font-size: 14px;
    color: var(--color-text);
    font-family: var(--font-kanit), sans-serif;
  }
`;

interface StationRiskHeroProps {
  stationName: string;
  status: StationRiskStatus;
  statusLabel: string;
  riskMessage: string;
  recommendedAction: string;
  updatedAtLabel: string;
  waterLevel: number;
}

export default function StationRiskHero({
  stationName,
  status,
  statusLabel,
  riskMessage,
  recommendedAction,
  updatedAtLabel,
  waterLevel
}: StationRiskHeroProps) {
  const icon =
    status === 'critical' ? <ShieldAlert size={16} /> : status === 'warning' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />;

  const statusStyle = {
    normal: {
      color: 'var(--status-safe)',
      border: '1px solid var(--status-safe-border)',
      background: 'var(--status-safe-bg)'
    },
    warning: {
      color: 'var(--status-warning)',
      border: '1px solid var(--status-warning-border)',
      background: 'var(--status-warning-bg)'
    },
    critical: {
      color: 'var(--status-danger)',
      border: '1px solid var(--status-danger-border)',
      background: 'var(--status-danger-bg)'
    }
  }[status];

  return (
    <HeroCard $status={status} aria-live="polite">
      <Left>
        <span className="status-row" style={statusStyle}>
          {icon}
          สถานะ: {statusLabel}
        </span>
        <h1 className="title">{stationName}</h1>
        <p className="message">{riskMessage}</p>
        <p className="sub">{recommendedAction}</p>
      </Left>

      <Right>
        <p className="label">ระดับน้ำล่าสุด</p>
        <p className="value">{waterLevel.toFixed(2)} ม.</p>
        <p className="meta">อัปเดตล่าสุดเมื่อ {updatedAtLabel}</p>
      </Right>
    </HeroCard>
  );
}
