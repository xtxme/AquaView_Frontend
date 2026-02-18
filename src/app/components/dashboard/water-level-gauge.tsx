'use client';

import { AlertTriangle, CheckCircle2, Siren } from 'lucide-react';
import styled from 'styled-components';

// ============ TYPES ============
export type WaterLevelGaugeProps = {
  station: string;
  level: number;
  maxLevel: number;
  warningLevel: number;
  dangerLevel: number;
  updatedAt: string;
};

// ============ STYLED COMPONENTS ============
const StyledGaugeCard = styled.div`
  width: min(300px, 100%);
  border-radius: 22px;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-soft);
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-family: var(--font-kanit), sans-serif;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-card);
  }

  @media (max-width: 700px) {
    width: 100%;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

const StyledStationName = styled.h2`
  margin: 0;
  color: var(--color-primary);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.15;
`;

const StyledBody = styled.div`
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  gap: 14px;
  align-items: stretch;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

type StatusType = 'normal' | 'warning' | 'critical';

const StyledStatusBadge = styled.div<{ status: StatusType }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;

  ${({ status }) => {
    switch (status) {
      case 'critical':
        return `
          background: var(--status-danger-bg);
          color: var(--status-danger);
          border: 1px solid var(--status-danger-border);
        `;
      case 'warning':
        return `
          background: var(--status-warning-bg);
          color: var(--status-warning);
          border: 1px solid var(--status-warning-border);
        `;
      default:
        return `
          background: var(--status-safe-bg);
          color: var(--status-safe);
          border: 1px solid var(--status-safe-border);
        `;
    }
  }}
`;

const StyledGaugeContainer = styled.div`
  position: relative;
  height: 432px;
  width: 132px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 420px) {
    height: 370px;
    width: 124px;
    margin: 0 auto;
  }
`;

const StyledScale = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 42px;
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 500;
  line-height: 1.15;
`;

const StyledScaleTick = styled.div<{ $y: number }>`
  position: absolute;
  right: 0;
  top: ${({ $y }) => `${$y}px`};
  transform: translateY(-50%);
`;

const StyledGaugeSvg = styled.svg`
  overflow: visible;
  width: 100%;
  height: 100%;
`;

const StyledKpiStack = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
  box-sizing: border-box;
  padding-bottom: 36px;
`;

const StyledPrimaryKpi = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 10px 12px;

  .label {
    color: var(--color-text-muted);
    font-size: 12px;
    line-height: 1.2;
  }

  .value {
    margin-top: 4px;
    color: var(--color-primary);
    font-size: 24px;
    font-weight: 700;
    line-height: 1.1;
  }
`;

const StyledSubKpiGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

const StyledSubKpi = styled.div`
  border-radius: 10px;
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.4);

  .label {
    color: var(--color-text-muted);
    font-size: 11px;
    line-height: 1.2;
  }

  .value {
    margin-top: 3px;
    color: var(--color-text);
    font-size: 16px;
    font-weight: 600;
    line-height: 1.2;
  }
`;

const StyledInfoContainer = styled.div`
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-top: 1px dashed rgba(172, 188, 211, 0.85);
  padding-top: 12px;
  font-size: 13px;
`;

const StyledInfoLabel = styled.div`
  color: var(--color-primary);
  font-weight: 600;
`;

const StyledInfoSub = styled.div`
  text-align: right;
  color: var(--color-text-subtle);
`;

// ============ MAIN COMPONENT ============
export default function WaterLevelGauge({
  station,
  level,
  maxLevel,
  warningLevel,
  dangerLevel,
  updatedAt,
}: WaterLevelGaugeProps) {
  // Calculate percentage (capped at 100%)
  const percent = Math.min((level / maxLevel) * 100, 100);
  const remainingToBank = Math.max(maxLevel - level, 0);

  // Determine status
  const status: StatusType =
    level >= dangerLevel
      ? 'critical'
      : level >= warningLevel
      ? 'warning'
      : 'normal';

  // Thai status text
  const statusText =
    status === 'critical'
      ? 'วิกฤต'
      : status === 'warning'
      ? 'เฝ้าระวัง'
      : 'ปกติ';

  // Calculate SVG positions
  const displayMaxLevel = Math.max(1, Math.ceil(maxLevel));
  const gaugeViewWidth = 132;
  const gaugeViewHeight = 432;
  const gaugeHeight = 384;
  const gaugeY = 12;
  const gaugeBottom = gaugeY + gaugeHeight;
  const gaugeX = 46;
  const gaugeWidth = 62;
  const scaledLevel = Math.min(Math.max(level, 0), displayMaxLevel);
  const scaledWarning = Math.min(Math.max(warningLevel, 0), displayMaxLevel);
  const scaledDanger = Math.min(Math.max(dangerLevel, 0), displayMaxLevel);
  const waterHeight = (gaugeHeight * scaledLevel) / displayMaxLevel;
  const waterY = gaugeBottom - waterHeight;
  const warningY = gaugeBottom - (gaugeHeight * scaledWarning) / displayMaxLevel;
  const dangerY = gaugeBottom - (gaugeHeight * scaledDanger) / displayMaxLevel;
  const scaleSteps = Array.from({ length: displayMaxLevel + 1 }, (_, index) => displayMaxLevel - index);
  const gridY = scaleSteps
    .slice(1, -1)
    .map((step) => gaugeBottom - (gaugeHeight * step) / displayMaxLevel);
  const labelY = Math.max(waterY - 20, gaugeY + 8);
  const labelWidth = gaugeWidth - 8;
  const labelHeight = 24;
  const labelX = gaugeX + (gaugeWidth - labelWidth) / 2;
  const labelCenterX = gaugeX + gaugeWidth / 2;
  const labelCenterY = labelY + labelHeight / 2;

  const StatusIcon = status === 'critical' ? Siren : status === 'warning' ? AlertTriangle : CheckCircle2;

  return (
    <StyledGaugeCard>
      <StyledHeader>
        <StyledStationName>{station}</StyledStationName>
        <StyledStatusBadge status={status}>
          <StatusIcon size={14} />
          {statusText}
        </StyledStatusBadge>
      </StyledHeader>

      <StyledBody>
        <StyledGaugeContainer>
          <StyledScale>
            {scaleSteps.map((value) => {
              const tickY = gaugeBottom - (gaugeHeight * value) / displayMaxLevel;
              return (
                <StyledScaleTick key={value} $y={tickY}>
                  {value} m
                </StyledScaleTick>
              );
            })}
          </StyledScale>
          <StyledGaugeSvg
            viewBox={`0 0 ${gaugeViewWidth} ${gaugeViewHeight}`}
            aria-label={`ระดับน้ำสถานี ${station}`}
          >
            {gridY.map((value) => (
              <line
                key={value}
                x1={gaugeX}
                x2={gaugeX + gaugeWidth}
                y1={value}
                y2={value}
                stroke="var(--color-border)"
                opacity="0.5"
              />
            ))}

            <rect
              x={gaugeX}
              y={gaugeY}
              width={gaugeWidth}
              height={gaugeHeight}
              rx="22"
              fill="var(--color-section)"
              stroke="var(--color-primary)"
              strokeWidth="2.5"
            />

            <rect
              x={gaugeX}
              y={waterY}
              width={gaugeWidth}
              height={waterHeight}
              rx="20"
              fill="var(--color-secondary)"
              style={{ transition: 'y 250ms ease-out, height 250ms ease-out' }}
            />

            <line
              x1={gaugeX}
              x2={gaugeX + gaugeWidth}
              y1={warningY}
              y2={warningY}
              stroke="var(--status-warning)"
              strokeWidth="3"
            />

            <line
              x1={gaugeX}
              x2={gaugeX + gaugeWidth}
              y1={dangerY}
              y2={dangerY}
              stroke="var(--status-danger)"
              strokeWidth="3"
            />

            <rect
              x={labelX}
              y={labelY}
              width={labelWidth}
              height={labelHeight}
              rx="7"
              fill="var(--color-primary)"
            />
            <text
              x={labelCenterX}
              y={labelCenterY}
              fill="white"
              fontSize="10"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {level.toFixed(2)} m
            </text>
          </StyledGaugeSvg>
        </StyledGaugeContainer>

        <StyledKpiStack>
          <StyledPrimaryKpi>
            <div className="label">ระดับน้ำปัจจุบัน</div>
            <div className="value">{level.toFixed(2)} ม.</div>
          </StyledPrimaryKpi>

          <StyledSubKpiGrid>
            <StyledSubKpi>
              <div className="label">ใกล้ตลิ่ง</div>
              <div className="value">{percent.toFixed(1)}%</div>
            </StyledSubKpi>
            <StyledSubKpi>
              <div className="label">เหลือจากตลิ่ง</div>
              <div className="value">{remainingToBank.toFixed(2)} ม.</div>
            </StyledSubKpi>
          </StyledSubKpiGrid>
        </StyledKpiStack>
      </StyledBody>

      <StyledInfoContainer>
        <StyledInfoLabel>{statusText}</StyledInfoLabel>
        <StyledInfoSub>อัปเดต: {updatedAt}</StyledInfoSub>
      </StyledInfoContainer>
    </StyledGaugeCard>
  );
}
