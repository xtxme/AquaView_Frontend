'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import WaterLevelGauge, { WaterLevelGaugeProps } from './water-level-gauge';
import { MOCK_STATIONS, MOCK_READINGS, MOCK_THRESHOLDS } from '@/lib/mock-data';

const StyledDashboardSection = styled.div`
  width: 100%;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledSectionHeader = styled.div`
  margin-bottom: 32px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding-left: 56px;

  @media (max-width: 900px) {
    padding-left: 0;
    justify-content: center;
  }
`;

const StyledHeaderBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background: var(--color-secondary);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  font-family: 'Kanit', sans-serif;
  box-shadow: var(--shadow-soft);
`;

const StyledCarouselContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  width: 100%;
  justify-content: center;

  @media (max-width: 900px) {
    gap: 8px;
  }
`;

const StyledPageView = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  width: min(1100px, calc(100vw - 160px));
  justify-items: center;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    width: calc(100vw - 90px);
    grid-template-columns: 1fr;
  }
`;

const StyledPageIndicator = styled.div`
  margin-top: 16px;
  font-family: 'Kanit', sans-serif;
  font-size: 14px;
  color: var(--color-text-muted);
`;

const StyledNavButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-secondary);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-soft);
  transition: transform 0.2s;
  flex-shrink: 0;
  z-index: 10;

  &:hover {
    transform: scale(1.1);
    background: var(--color-primary);
  }

  &:disabled {
    background: var(--color-border);
    cursor: not-allowed;
    transform: none;
  }
`;

const StyledEmptyState = styled.div`
  width: min(1100px, calc(100vw - 160px));
  border-radius: 16px;
  background: var(--color-surface-soft);
  border: 1px dashed var(--color-border);
  color: var(--color-text-muted);
  text-align: center;
  padding: 26px;
  font-family: 'Kanit', sans-serif;
`;

interface StationBarChartProps {
  stationIds?: string[];
}

function getWaterLevelGaugeData(stationIds: Set<string>): WaterLevelGaugeProps[] {
  return MOCK_STATIONS
    .filter((station) => stationIds.has(station.station_id))
    .map((station) => {
      const latestReading = MOCK_READINGS
        .filter((reading) => reading.station_id === station.station_id)
        .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())[0];

      const threshold = MOCK_THRESHOLDS.find((item) => item.station_id === station.station_id);

      const readingTime = latestReading ? new Date(latestReading.ts) : null;
      const updatedAt = readingTime
        ? `${readingTime
            .toLocaleTimeString('th-TH', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
              timeZone: 'Asia/Bangkok',
            })
            .replace(':', '.')} น.`
        : '00.00 น.';

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

export function StationBarChart({ stationIds = [] }: StationBarChartProps) {
  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(0);

  const stationIdSet = useMemo(() => new Set(stationIds), [stationIds]);

  const stations = useMemo(() => getWaterLevelGaugeData(stationIdSet), [stationIdSet]);

  const totalPages = Math.max(1, Math.ceil(stations.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages - 1);

  const visibleStations = useMemo(() => {
    const start = safeCurrentPage * ITEMS_PER_PAGE;
    return stations.slice(start, start + ITEMS_PER_PAGE);
  }, [stations, safeCurrentPage]);

  const isFirstPage = safeCurrentPage === 0;
  const isLastPage = safeCurrentPage >= totalPages - 1;

  const goPrevious = () => setCurrentPage((prev) => Math.max(0, prev - 1));
  const goNext = () => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));

  return (
    <StyledDashboardSection>
      <StyledSectionHeader>
        <StyledHeaderBadge>รายงานระดับน้ำของสถานีระบายน้ำ</StyledHeaderBadge>
      </StyledSectionHeader>

      {stations.length === 0 ? (
        <StyledEmptyState>ไม่พบสถานีที่ตรงกับเงื่อนไขการค้นหา</StyledEmptyState>
      ) : (
        <StyledCarouselContainer>
          <StyledNavButton onClick={goPrevious} aria-label="สถานีก่อนหน้า" disabled={isFirstPage}>
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

          <StyledPageView>
            {visibleStations.map((station) => (
              <WaterLevelGauge key={station.station} {...station} />
            ))}
          </StyledPageView>

          <StyledNavButton onClick={goNext} aria-label="สถานีถัดไป" disabled={isLastPage}>
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
      )}

      {stations.length > 0 && totalPages > 1 && (
        <StyledPageIndicator>
          หน้า {safeCurrentPage + 1} / {totalPages}
        </StyledPageIndicator>
      )}
    </StyledDashboardSection>
  );
}
