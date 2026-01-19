'use client';

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
  width: 260px;
  border-radius: 24px;
  background: #FBF8F4;
  padding: 24px;
  text-align: center;
`;

const StyledStationName = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #4B5563;
  margin-bottom: 16px;
`;

const StyledGaugeContainer = styled.div`
  position: relative;
  margin: 0 auto;
  height: 420px;
  width: 140px;
`;

const StyledScale = styled.div`
  position: absolute;
  left: -40px;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 14px;
  color: #1E3A8A;
`;

type StatusType = 'normal' | 'warning' | 'critical';

const StyledStatusBadge = styled.div<{ status: StatusType }>`
  margin: 16px auto;
  display: inline-block;
  padding: 4px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;

  ${({ status }) => {
    switch (status) {
      case 'critical':
        return `
          background: #FEE2E2;
          color: #DC2626;
          border: 1px solid #FCA5A5;
        `;
      case 'warning':
        return `
          background: #FEF3C7;
          color: #D97706;
          border: 1px solid #FBBF24;
        `;
      default:
        return `
          background: #DCFCE7;
          color: #16A34A;
          border: 1px solid #86EFAC;
        `;
    }
  }}
`;

const StyledInfoContainer = styled.div`
  margin-top: 16px;
  font-size: 14px;
`;

const StyledInfoLabel = styled.div`
  font-weight: 600;
`;

const StyledInfoSub = styled.div`
  color: #9CA3AF;
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
  const waterY = 410 - (400 * percent) / 100;
  const waterHeight = (400 * percent) / 100;
  const warningY = 410 - (400 * warningLevel) / maxLevel;
  const dangerY = 410 - (400 * dangerLevel) / maxLevel;

  // Calculate scale steps (6 steps from 0 to maxLevel)
  const scaleSteps = Array.from({ length: 7 }, (_, i) =>
    (maxLevel - (i * maxLevel) / 6).toFixed(1)
  );

  return (
    <StyledGaugeCard>
      <StyledStationName>{station}</StyledStationName>

      {/* Gauge Container */}
      <StyledGaugeContainer>
        {/* Scale Labels */}
        <StyledScale>
          {scaleSteps.map((value, i) => (
            <div key={i}>{value} m</div>
          ))}
        </StyledScale>

        {/* SVG Gauge */}
        <svg width="140" height="420">
          {/* Container Background */}
          <rect
            x="30"
            y="10"
            width="80"
            height="400"
            rx="20"
            fill="#EAF2FF"
            stroke="#0F2A66"
            strokeWidth="3"
          />

          {/* Water Level */}
          <rect
            x="30"
            y={waterY}
            width="80"
            height={waterHeight}
            rx="20"
            fill="#5A86C5"
          />

          {/* Warning Line */}
          <line
            x1="30"
            x2="110"
            y1={warningY}
            y2={warningY}
            stroke="#F6B73C"
            strokeWidth="3"
          />

          {/* Danger Line */}
          <line
            x1="30"
            x2="110"
            y1={dangerY}
            y2={dangerY}
            stroke="#F44336"
            strokeWidth="3"
          />

          {/* Value Label */}
          <rect
            x="40"
            y={waterY - 18}
            width="60"
            height="26"
            rx="6"
            fill="#0F2A66"
          />
          <text
            x="70"
            y={waterY}
            fill="white"
            fontSize="12"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {level.toFixed(2)} m
          </text>
        </svg>
      </StyledGaugeContainer>

      {/* Status Badge */}
      <StyledStatusBadge status={status}>
        {statusText}
      </StyledStatusBadge>

      {/* Info Section */}
      <StyledInfoContainer>
        <StyledInfoLabel>
          ใกล้ตลิ่ง: {percent.toFixed(1)}%
        </StyledInfoLabel>
        <div>ระดับน้ำ: {level.toFixed(2)} เมตร</div>
        <StyledInfoSub>
          อัพเดทเมื่อ: {updatedAt}
        </StyledInfoSub>
      </StyledInfoContainer>
    </StyledGaugeCard>
  );
}
