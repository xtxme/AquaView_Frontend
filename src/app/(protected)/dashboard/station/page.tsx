'use client';

import React, { Suspense, useMemo } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'next/navigation';
import { Download, Flag, MapPin, Waves } from 'lucide-react';
import AppHeader from '@/app/components/header/header';
import AppFooter from '@/app/components/footer/footer';
import { StationActionButton, StationSectionHeader } from '@/app/components/Station';
import WaterLevelChart from '@/app/components/dashboard/water-level-chart';
import { RecentReadings } from '@/app/components/dashboard/station/recent-readings';
import { getMockStationWithLatestReading, MOCK_READINGS } from '@/lib/mock-data';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-page);
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

const StationPageContainer = styled.main`
  width: min(1240px, 100%);
  margin: 0 auto;
  padding: 38px 20px 84px;
  font-family: 'Kanit', sans-serif;

  .page-title {
    margin: 0 0 30px;
    color: var(--color-primary);
    font-size: clamp(42px, 5vw, 64px);
    font-weight: 700;
    line-height: 1.2;
  }

  @media (max-width: 900px) {
    .page-title {
      font-size: 42px;
    }
  }
`;

const HeroCard = styled.section`
  background: var(--color-surface-soft);
  border-radius: 42px;
  padding: 42px 46px 58px;
  margin-bottom: 34px;

  @media (max-width: 900px) {
    border-radius: 28px;
    padding: 28px 24px 32px;
  }
`;

const HeroInfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 40px;
  row-gap: 14px;
  margin-bottom: 42px;
`;

const HeroInfoItem = styled.div<{ iconTone?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--color-primary);
  font-size: clamp(22px, 2.5vw, 36px);
  font-weight: 500;
  line-height: 1.2;

  svg {
    width: clamp(24px, 2.7vw, 38px);
    height: clamp(24px, 2.7vw, 38px);
    stroke-width: 2.2;
    color: ${({ iconTone }) => (iconTone === 'secondary' ? 'var(--color-accent)' : 'var(--color-secondary)')};
    flex-shrink: 0;
  }

  @media (max-width: 1100px) {
    font-size: 30px;

    svg {
      width: 34px;
      height: 34px;
    }
  }

  @media (max-width: 900px) {
    font-size: 28px;
  }

  @media (max-width: 640px) {
    font-size: 24px;
  }
`;

const HeroStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
  width: min(900px, 100%);
  margin: 0 auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const HeroStatCard = styled.article`
  border: 2px solid var(--color-primary);
  border-radius: 40px;
  background: var(--color-surface);
  padding: 42px 50px;
  min-height: 230px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .label {
    margin: 0;
    color: var(--color-text);
    font-size: clamp(32px, 3vw, 46px);
    font-weight: 600;
    line-height: 1.12;
  }

  .value {
    margin: 20px 0 0;
    color: var(--color-text);
    font-size: clamp(38px, 3.8vw, 56px);
    font-weight: 500;
    line-height: 1.1;
  }

  @media (max-width: 1100px) {
    min-height: 190px;
    border-radius: 30px;
    padding: 30px 34px;

    .label {
      font-size: 34px;
    }

    .value {
      margin-top: 14px;
      font-size: 42px;
    }
  }

  @media (max-width: 640px) {
    .label {
      font-size: 30px;
    }

    .value {
      font-size: 36px;
    }
  }
`;

function StationContent() {
  const searchParams = useSearchParams();
  const stationId = searchParams.get('id') || 'ST001';

  const stationData = useMemo(() => getMockStationWithLatestReading(stationId), [stationId]);

  const stationHistory = useMemo(() => {
    return MOCK_READINGS
      .filter((r) => r.station_id === stationId)
      .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
  }, [stationId]);

  const bankLevel = stationData?.bank_level_m ?? 0;

  const chartData = useMemo(() => {
    return [...stationHistory]
      .slice(0, 24)
      .reverse()
      .map((reading, index) => ({
        time: new Date(reading.ts).toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        timestamp: index,
        p1: reading.water_level_m,
        p2: bankLevel
      }));
  }, [bankLevel, stationHistory]);

  if (!stationData) {
    return (
      <StationPageContainer>
        <h1 className="page-title">ไม่พบข้อมูลสถานี</h1>
      </StationPageContainer>
    );
  }

  const waterLevel = stationData.latest_reading?.water_level_m ?? 0;
  const nearOverflowPercentage = bankLevel > 0 ? (waterLevel / bankLevel) * 100 : 0;

  return (
    <StationPageContainer>
      <h1 className="page-title">{stationData.name}</h1>

      <HeroCard>
        <HeroInfoRow>
          <HeroInfoItem>
            <MapPin />
            <span>{stationData.province} - {stationData.district}</span>
          </HeroInfoItem>
          <HeroInfoItem iconTone="secondary">
            <Waves />
            <span>ริมตลิ่ง: {stationData.bank_level_m.toFixed(2)} ม.</span>
          </HeroInfoItem>
          <HeroInfoItem>
            <Flag />
            <span>สถานีต้นน้ำแม่น้ำปิง</span>
          </HeroInfoItem>
        </HeroInfoRow>

        <HeroStatsGrid>
          <HeroStatCard>
            <p className="label">ระดับน้ำปัจจุบัน</p>
            <p className="value">{waterLevel.toFixed(2)} ม.</p>
          </HeroStatCard>
          <HeroStatCard>
            <p className="label">ใกล้ตลิ่ง</p>
            <p className="value">{nearOverflowPercentage.toFixed(1)} %</p>
          </HeroStatCard>
        </HeroStatsGrid>
      </HeroCard>

      <StationSectionHeader
        title="กราฟระดับน้ำ 24 ชั่วโมงย้อนหลัง"
        actions={(
          <StationActionButton>
            Export <Download size={24} />
          </StationActionButton>
        )}
      />

      <WaterLevelChart
        title="กราฟระดับน้ำ 24 ชั่วโมงย้อนหลัง"
        data={chartData}
        maxValue={stationData.bank_level_m * 1.25}
      />

      <StationSectionHeader
        title="ตารางข้อมูลรายชั่วโมง"
        actions={(
          <>
            <StationActionButton>
              เลือกช่วงเวลาข้อมูล
            </StationActionButton>
            <StationActionButton>
              Export <Download size={24} />
            </StationActionButton>
          </>
        )}
      />

      <RecentReadings readings={stationHistory} />
    </StationPageContainer>
  );
}

export default function StationPage() {
  return (
    <PageWrapper>
      <AppHeader activePage="dashboard" />
      <ContentWrapper>
        <Suspense fallback={<div style={{ padding: '24px' }}>Loading...</div>}>
          <StationContent />
        </Suspense>
      </ContentWrapper>
      <AppFooter />
    </PageWrapper>
  );
}
