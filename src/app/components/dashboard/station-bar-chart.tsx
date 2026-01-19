'use client';

import { useRef } from 'react';
import styled from 'styled-components';
import WaterLevelGauge, { WaterLevelGaugeProps } from './water-level-gauge';

// Import mock data from lib
import { MOCK_STATIONS, MOCK_READINGS, MOCK_THRESHOLDS } from '@/lib/mock-data';

// ============ STYLED COMPONENTS ============
const StyledDashboardSection = styled.div`
  width: 100%;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledSectionHeader = styled.div`
  margin-bottom: 50px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding-left: 56px; /* 40px (button) + 16px (gap) */
`;

const StyledHeaderBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background: #3B82F6;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.5);
`;

const StyledCarouselContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
`;

const StyledScroller = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }
`;

const StyledNavButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3B82F6;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.5);
  transition: transform 0.2s;
  flex-shrink: 0;
  z-index: 10;

  &:hover {
    transform: scale(1.1);
    background: #2563EB;
  }

  &:disabled {
    background: #CBD5E1;
    cursor: not-allowed;
    transform: none;
  }
`;

// ============ HELPER FUNCTIONS ============
/**
 * แปลงข้อมูลจาก lib/mock-data.ts ให้เข้ากับ WaterLevelGaugeProps
 */
function getWaterLevelGaugeData(): WaterLevelGaugeProps[] {
  const now = new Date();

  return MOCK_STATIONS.map((station) => {
    // หา reading ล่าสุดของสถานี
    const latestReading = MOCK_READINGS
      .filter((r) => r.station_id === station.station_id)
      .sort(
        (a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime()
      )[0];

    // หา threshold ของสถานี
    const threshold = MOCK_THRESHOLDS.find(
      (t) => t.station_id === station.station_id
    );

    // แปลงเวลาเป็น format "HH.MM น."
    const readingTime = new Date(latestReading?.ts || now);
    const hours = readingTime.getHours();
    const minutes = readingTime.getMinutes();
    const updatedAt = `${hours}.${minutes} น.`;

    return {
      station: station.name,
      level: latestReading?.water_level_m || 0,
      maxLevel: station.bank_level_m,
      warningLevel: threshold?.yellow_threshold_m || 3,
      dangerLevel: threshold?.red_threshold_m || 4,
      updatedAt,
    };
  });
}

// ============ MAIN COMPONENT ============
export function StationBarChart() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const stations = getWaterLevelGaugeData();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollerRef.current) {
      const scrollAmount = 300;
      scrollerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <StyledDashboardSection>
      <StyledSectionHeader>
        <StyledHeaderBadge>
          รายงานระดับน้ำของสถานีระบายน้ำ
        </StyledHeaderBadge>
      </StyledSectionHeader>

      <StyledCarouselContainer>
        {/* Left Navigation Button */}
        <StyledNavButton onClick={() => scroll('left')} aria-label="Previous">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </StyledNavButton>

        {/* Gauge Cards Scroller */}
        <StyledScroller ref={scrollerRef}>
          {stations.map((station, index) => (
            <WaterLevelGauge key={index} {...station} />
          ))}
        </StyledScroller>

        {/* Right Navigation Button */}
        <StyledNavButton onClick={() => scroll('right')} aria-label="Next">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </StyledNavButton>
      </StyledCarouselContainer>
    </StyledDashboardSection>
  );
}
