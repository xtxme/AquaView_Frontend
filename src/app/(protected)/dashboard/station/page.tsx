'use client';

import React, { Suspense, useMemo } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'next/navigation';
import { Download } from 'lucide-react';
import AppHeader from '@/app/components/header/header';
import AppFooter from '@/app/components/footer/footer';
import StationOverviewCard from '@/app/components/dashboard/station/station-overview-card';
import StationHistoryChart from '@/app/components/dashboard/station/station-history-chart';
import StationHourlyTable from '@/app/components/dashboard/station/station-hourly-table';
import { generatePredictionData, getMockStationWithLatestReading, MOCK_READINGS } from '@/lib/mock-data';

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
  width: min(1080px, 100%);
  margin: 0 auto;
  padding: 30px 20px 80px;

  .page-title {
    margin: 0 0 18px;
    color: var(--color-primary);
    font-family: var(--font-kanit), sans-serif;
    font-size: clamp(34px, 3.4vw, 46px);
    font-weight: 700;
    line-height: 1.2;
  }
`;

const SectionHeader = styled.div`
  margin: 34px 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  .title {
    margin: 0;
    color: var(--color-primary);
    font-family: var(--font-kanit), sans-serif;
    font-size: clamp(24px, 2vw, 34px);
    font-weight: 700;
    line-height: 1.2;
  }

  .actions {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  @media (max-width: 820px) {
    flex-direction: column;
    align-items: flex-start;

    .actions {
      justify-content: flex-start;
    }
  }
`;

const ActionButton = styled.button`
  border: 0;
  border-radius: 16px;
  background: var(--color-primary);
  color: var(--color-surface);
  padding: 10px 20px;
  font-family: var(--font-kanit), sans-serif;
  font-size: 25px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:hover {
    background: var(--color-primary-strong);
  }
`;

function StationContent() {
  const searchParams = useSearchParams();
  const stationId = searchParams.get('id') || 'ST001';

  const stationData = useMemo(() => getMockStationWithLatestReading(stationId), [stationId]);

  const stationHistory = useMemo(() => {
    return MOCK_READINGS
      .filter((reading) => reading.station_id === stationId)
      .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
  }, [stationId]);

  const chartModel = useMemo(() => {
    const historicalData = stationHistory
      .slice(0, 24)
      .reverse()
      .map((reading) => ({
        time: new Date(reading.ts).toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        waterLevel: reading.water_level_m
      }));

    const predictionData = generatePredictionData(stationId, 6)
      .sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime())
      .map((reading) => ({
        time: new Date(reading.ts).toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        waterLevel: reading.water_level_m
      }));

    return {
      data: [...historicalData, ...predictionData],
      predictionStartIndex: historicalData.length
    };
  }, [stationHistory, stationId]);

  if (!stationData) {
    return (
      <StationPageContainer>
        <h1 className="page-title">ไม่พบข้อมูลสถานี</h1>
      </StationPageContainer>
    );
  }

  const waterLevel = stationData.latest_reading?.water_level_m ?? 0;
  const bankLevel = stationData.bank_level_m;
  const nearOverflowPercentage = bankLevel > 0 ? (waterLevel / bankLevel) * 100 : 0;

  return (
    <StationPageContainer>
      <h1 className="page-title">{stationData.name}</h1>

      <StationOverviewCard
        province={stationData.province}
        district={stationData.district}
        bankLevel={bankLevel}
        waterLevel={waterLevel}
        nearOverflowPercentage={nearOverflowPercentage}
      />

      <SectionHeader>
        <h2 className="title">กราฟระดับน้ำ 24 ชั่วโมงย้อนหลัง</h2>
        <div className="actions">
          <ActionButton type="button">
            Export <Download size={18} />
          </ActionButton>
        </div>
      </SectionHeader>

      <StationHistoryChart
        data={chartModel.data}
        maxValue={bankLevel}
        predictionStartIndex={chartModel.predictionStartIndex}
      />

      <SectionHeader>
        <h2 className="title">ตารางข้อมูลรายชั่วโมง</h2>
        <div className="actions">
          <ActionButton type="button">เลือกช่วงเวลาดูข้อมูล</ActionButton>
          <ActionButton type="button">
            Export <Download size={18} />
          </ActionButton>
        </div>
      </SectionHeader>

      <StationHourlyTable readings={stationHistory} />
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
