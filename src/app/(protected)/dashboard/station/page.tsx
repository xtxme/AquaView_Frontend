'use client';

import React, { useMemo, Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import AppHeader from '@/app/components/header/header';
import AppFooter from '@/app/components/footer/footer';
import { StationHeader } from '@/app/components/dashboard/station/station-header';
import { StationStats } from '@/app/components/dashboard/station/station-stats';
import WaterLevelChart from '@/app/components/dashboard/water-level-chart';
import { RecentReadings } from '@/app/components/dashboard/station/recent-readings';
import { getMockStationWithLatestReading, MOCK_READINGS, generatePredictionData } from '@/lib/mock-data';
import { Reading } from '@/lib/types';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #E0F2FE;
`;

const StationPageContainer = styled.div`
  width: 100%;
  padding: 50px 100px 100px 100px;
  font-family: 'Inter', sans-serif;
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6B7280;
  font-family: 'Kanit', sans-serif;
  font-size: 14px;
  margin-bottom: 24px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;

  &:hover {
    color: #1F2937;
  }
`;

function StationContent() {
    const searchParams = useSearchParams();
    // Default to ST001 if no id provided
    const stationId = searchParams.get('id') || 'ST001';

    const stationData = getMockStationWithLatestReading(stationId);
    const [isMounted, setIsMounted] = useState(false);

    // Client-side only mount to avoid hydration issues
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Get history for this station
    const stationHistory = useMemo(() => {
        return MOCK_READINGS
            .filter(r => r.station_id === stationId)
            .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
    }, [stationId]);

    // Transform data for chart
    // Chart expects { time: string, p1: number, p2: number }
    const chartData = useMemo(() => {
        // Take last 18 hours historical data
        const historicalReadings = [...stationHistory]
            .slice(0, 18)
            .reverse();

        // Only generate prediction on client side to avoid hydration issues
        const predictionReadings = isMounted ? generatePredictionData(stationId, 6) : [];

        // Combine historical + prediction data
        const allReadings = [...historicalReadings, ...predictionReadings];

        // Transform to chart format
        return allReadings.map(reading => ({
            time: new Date(reading.ts).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
            p1: reading.water_level_m,
            p2: stationData?.bank_level_m || 0 // Use bank level as secondary line reference if needed, or just flat line
        }));
    }, [stationHistory, stationData, stationId, isMounted]);

    if (!stationData) {
        return <div>Station not found</div>;
    }

    // Determine overall status
    const currentStatus = stationData.status || 'normal';

    return (
        <StationPageContainer>
            <BackButton onClick={() => window.history.back()}>
                <ArrowLeft size={18} />
                ย้อนกลับ
            </BackButton>

            <StationHeader
                station={stationData}
                status={currentStatus as 'normal' | 'warning' | 'critical'}
            />

            <StationStats
                waterLevel={stationData.latest_reading?.water_level_m || 0}
                bankLevel={stationData.bank_level_m}
                battery={stationData.latest_reading?.battery_pct || 0}
                lastUpdate={stationData.latest_reading?.ts || new Date().toISOString()}
            />

            <WaterLevelChart
                title="กราฟระดับน้ำ"
                data={chartData}
                predictionStartIndex={18}
                maxValue={stationData.bank_level_m * 1.5} // Add some headroom
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
                <Suspense fallback={<div>Loading...</div>}>
                    <StationContent />
                </Suspense>
            </ContentWrapper>
            <AppFooter />
        </PageWrapper>
    );
}
