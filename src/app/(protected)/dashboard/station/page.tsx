'use client';

import React, { Suspense, useMemo } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'next/navigation';
import { CalendarRange, Download } from 'lucide-react';
import AppHeader from '@/app/components/header/header';
import AppFooter from '@/app/components/footer/footer';
import StationRiskHero from '@/app/components/dashboard/station/station-risk-hero';
import StationOverviewCard from '@/app/components/dashboard/station/station-overview-card';
import StationHistoryChart from '@/app/components/dashboard/station/station-history-chart';
import StationHourlyTable from '@/app/components/dashboard/station/station-hourly-table';
import {
  generatePredictionData,
  getMockStationWithLatestReading,
  MOCK_READINGS,
  MOCK_THRESHOLDS
} from '@/lib/mock-data';
import type { StationRiskModel, StationRiskStatus } from '@/lib/types';

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
  padding: 28px 20px 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  .page-subtitle {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 14px;
    line-height: 1.3;
    font-family: var(--font-kanit), sans-serif;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  .title {
    margin: 0;
    color: var(--color-primary);
    font-family: var(--font-kanit), sans-serif;
    font-size: clamp(24px, 2.6vw, 28px);
    font-weight: 700;
    line-height: 1.2;
  }

  .desc {
    margin: 4px 0 0;
    color: var(--color-text-muted);
    font-family: var(--font-kanit), sans-serif;
    font-size: 14px;
    line-height: 1.4;
  }

  @media (max-width: 760px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActionGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  border: 1px solid transparent;
  border-radius: 12px;
  background: var(--color-primary);
  color: var(--color-surface);
  height: 42px;
  padding: 0 14px;
  font-family: var(--font-kanit), sans-serif;
  font-size: 15px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:hover:enabled {
    background: var(--color-primary-strong);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ring-secondary-soft);
  }

  &:disabled {
    background: var(--color-surface-soft);
    color: var(--color-text-subtle);
    border-color: var(--color-border);
    cursor: not-allowed;
  }
`;

const SecondaryActionsCard = styled.div`
  border-radius: 14px;
  border: 1px dashed var(--color-border);
  background: var(--color-surface-soft);
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;

  .label {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 14px;
    font-family: var(--font-kanit), sans-serif;
  }
`;

function formatLastUpdated(ts?: string): string {
  if (!ts) {
    return '-';
  }

  return new Date(ts).toLocaleString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function buildRiskModel(params: {
  waterLevel: number;
  bankLevel: number;
  warningLevel: number;
  dangerLevel: number;
  updatedAtLabel: string;
}): StationRiskModel {
  const { waterLevel, bankLevel, warningLevel, dangerLevel, updatedAtLabel } = params;
  const percentOfBank = bankLevel > 0 ? (waterLevel / bankLevel) * 100 : 0;

  let status: StationRiskStatus = 'normal';
  if (waterLevel >= dangerLevel) {
    status = 'critical';
  } else if (waterLevel >= warningLevel) {
    status = 'warning';
  }

  if (status === 'critical') {
    return {
      status,
      statusLabel: 'วิกฤต',
      riskMessage: 'ระดับน้ำอยู่ในระดับอันตราย ควรหลีกเลี่ยงพื้นที่ลุ่มต่ำใกล้ลำน้ำ',
      recommendedAction: 'คำแนะนำ: ติดตามประกาศจากหน่วยงานท้องถิ่นอย่างใกล้ชิด และเตรียมแผนอพยพ',
      updatedAtLabel,
      percentOfBank,
      warningLevel,
      dangerLevel
    };
  }

  if (status === 'warning') {
    return {
      status,
      statusLabel: 'เฝ้าระวัง',
      riskMessage: 'ระดับน้ำเข้าเขตเฝ้าระวัง มีโอกาสเปลี่ยนแปลงได้เร็วในช่วงไม่กี่ชั่วโมง',
      recommendedAction: 'คำแนะนำ: ติดตามข้อมูลทุก 1 ชั่วโมง และหลีกเลี่ยงกิจกรรมริมตลิ่ง',
      updatedAtLabel,
      percentOfBank,
      warningLevel,
      dangerLevel
    };
  }

  return {
    status,
    statusLabel: 'ปกติ',
    riskMessage: 'ระดับน้ำยังอยู่ในเกณฑ์ปกติ แต่ควรติดตามข้อมูลต่อเนื่อง',
    recommendedAction: 'คำแนะนำ: ตรวจสอบข้อมูลซ้ำตามรอบปกติ',
    updatedAtLabel,
    percentOfBank,
    warningLevel,
    dangerLevel
  };
}

function buildTrendSummary(current: number | null, previous: number | null): string {
  if (current === null || previous === null) {
    return 'สรุปแนวโน้ม: ข้อมูลยังไม่เพียงพอสำหรับสรุปการเปลี่ยนแปลงล่าสุด';
  }

  const delta = current - previous;
  const direction = delta > 0 ? 'เพิ่มขึ้น' : delta < 0 ? 'ลดลง' : 'ทรงตัว';
  const absDelta = Math.abs(delta).toFixed(2);

  return `สรุปแนวโน้มล่าสุด: ระดับน้ำ${direction} ${absDelta} ม. เมื่อเทียบกับชั่วโมงก่อนหน้า`;
}

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
      predictionStartIndex: predictionData.length > 0 ? historicalData.length : undefined
    };
  }, [stationHistory, stationId]);

  if (!stationData) {
    return (
      <StationPageContainer>
        <h1 style={{ margin: 0, color: 'var(--color-primary)', fontFamily: 'var(--font-kanit), sans-serif' }}>
          ไม่พบข้อมูลสถานี
        </h1>
      </StationPageContainer>
    );
  }

  const waterLevel = stationData.latest_reading?.water_level_m ?? 0;
  const bankLevel = stationData.bank_level_m;
  const threshold = MOCK_THRESHOLDS.find((item) => item.station_id === stationId);
  const warningLevel = threshold?.yellow_threshold_m ?? bankLevel * 0.7;
  const dangerLevel = threshold?.red_threshold_m ?? bankLevel * 0.9;
  const nearOverflowPercentage = bankLevel > 0 ? (waterLevel / bankLevel) * 100 : 0;
  const updatedAtLabel = formatLastUpdated(stationData.latest_reading?.ts);
  const riskModel = buildRiskModel({
    waterLevel,
    bankLevel,
    warningLevel,
    dangerLevel,
    updatedAtLabel
  });
  const trendSummary = buildTrendSummary(
    stationHistory[0]?.water_level_m ?? null,
    stationHistory[1]?.water_level_m ?? null
  );

  return (
    <StationPageContainer>
      <p className="page-subtitle">หน้าแสดงระดับน้ำรายสถานี</p>

      <StationRiskHero
        stationName={stationData.name}
        status={riskModel.status}
        statusLabel={riskModel.statusLabel}
        riskMessage={riskModel.riskMessage}
        recommendedAction={riskModel.recommendedAction}
        updatedAtLabel={riskModel.updatedAtLabel}
        waterLevel={waterLevel}
      />

      <Section>
        <SectionHeader>
          <div>
            <h2 className="title">ข้อมูลปัจจุบันของสถานี</h2>
            <p className="desc">ข้อมูลสำคัญสำหรับติดตามสถานการณ์แบบรวดเร็ว</p>
          </div>
        </SectionHeader>

        <StationOverviewCard
          province={stationData.province}
          district={stationData.district}
          bankLevel={bankLevel}
          waterLevel={waterLevel}
          warningLevel={warningLevel}
          nearOverflowPercentage={nearOverflowPercentage}
          riskStatus={riskModel.status}
          riskMessage={riskModel.riskMessage}
        />
      </Section>

      <Section>
        <SectionHeader>
          <div>
            <h2 className="title">แนวโน้มระดับน้ำ</h2>
            <p className="desc">กราฟย้อนหลังและคาดการณ์ช่วง 6 ชั่วโมงถัดไป</p>
          </div>
          <ActionGroup>
            <ActionButton
              type="button"
              disabled
              title="กำลังพัฒนา"
              aria-label="ส่งออกข้อมูลกราฟ กำลังพัฒนา"
            >
              Export <Download size={16} />
            </ActionButton>
          </ActionGroup>
        </SectionHeader>

        <StationHistoryChart
          data={chartModel.data}
          maxValue={Math.max(bankLevel, dangerLevel)}
          predictionStartIndex={chartModel.predictionStartIndex}
          predictionLabel="คาดการณ์ 6 ชั่วโมงข้างหน้า"
          trendSummary={trendSummary}
        />
      </Section>

      <Section>
        <SectionHeader>
          <div>
            <h2 className="title">ข้อมูลรายชั่วโมง</h2>
            <p className="desc">ใช้ตรวจสอบการเปลี่ยนแปลงของระดับน้ำรายชั่วโมง</p>
          </div>
        </SectionHeader>

        <StationHourlyTable readings={stationHistory} mode="auto" />
      </Section>

      <SecondaryActionsCard>
        <p className="label">เครื่องมือเสริมสำหรับการดูข้อมูลเพิ่มเติม</p>
        <ActionGroup>
          <ActionButton
            type="button"
            disabled
            title="กำลังพัฒนา"
            aria-label="เลือกช่วงเวลา กำลังพัฒนา"
          >
            ช่วงเวลา <CalendarRange size={16} />
          </ActionButton>
          <ActionButton
            type="button"
            disabled
            title="กำลังพัฒนา"
            aria-label="ส่งออกตารางข้อมูล กำลังพัฒนา"
          >
            Export ตาราง <Download size={16} />
          </ActionButton>
        </ActionGroup>
      </SecondaryActionsCard>
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
