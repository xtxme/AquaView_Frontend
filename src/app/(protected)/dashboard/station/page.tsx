'use client';

import React, { Suspense, useMemo } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'next/navigation';
import { Download } from 'lucide-react';
import AppHeader from '@/app/components/header/header';
import AppFooter from '@/app/components/footer/footer';
import { StationActionButton, StationSectionHeader } from '@/app/components/Station';
import { StationHeader } from '@/app/components/dashboard/station/station-header';
import { StationStats } from '@/app/components/dashboard/station/station-stats';
import WaterLevelChart from '@/app/components/dashboard/water-level-chart';
import { RecentReadings } from '@/app/components/dashboard/station/recent-readings';
import { getMockStationWithLatestReading, MOCK_READINGS } from '@/lib/mock-data';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #d4deed;
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

const StationPageContainer = styled.main`
  width: min(1240px, 100%);
  margin: 0 auto;
  padding: 48px 20px 84px;
  font-family: 'Kanit', sans-serif;

  .page-title {
    margin: 0 0 24px;
    color: #0b2d68;
    font-size: 40px;
    font-weight: 600;
    line-height: 1.2;
  }

  @media (max-width: 900px) {
    .page-title {
      font-size: 30px;
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

  const mappedStatus: 'normal' | 'warning' | 'critical' =
    stationData.status === 'red'
      ? 'critical'
      : stationData.status === 'yellow'
        ? 'warning'
        : 'normal';

  return (
    <StationPageContainer>
      <h1 className="page-title">{stationData.name}</h1>

      <StationHeader station={stationData} status={mappedStatus} />

      <StationStats
        waterLevel={stationData.latest_reading?.water_level_m || 0}
        bankLevel={stationData.bank_level_m}
        battery={stationData.latest_reading?.battery_pct || 0}
        lastUpdate={stationData.latest_reading?.ts || new Date().toISOString()}
      />

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
