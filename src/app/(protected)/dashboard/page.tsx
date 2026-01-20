'use client';

import React from 'react';
import styled from 'styled-components';
import AppHeader from '@/app/components/header/header';
import AppFooter from '@/app/components/footer/footer';
import { DashboardContainer } from '@/app/components/dashboard/dashboard-container';
import WaterLevelChart from '@/app/components/dashboard/water-level-chart';
import { StationBarChart } from '@/app/components/dashboard/station-bar-chart';
import { MOCK_WATER_LEVEL_DATA, WATER_LEVEL_MAX_VALUE } from '@/app/components/dashboard/mock-data';

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const StyledDashboardContent = styled.div`
  flex: 1;
`;

export default function DashboardPage() {
  return (
    <DashboardWrapper>
      <AppHeader activePage="dashboard" />
      <StyledDashboardContent>
        <DashboardContainer>
          {/* Line Chart Section */}
          <WaterLevelChart
            title="กราฟแสดงระดับน้ำปัจจุบัน"
            data={MOCK_WATER_LEVEL_DATA}
            predictionStartIndex={18}
            maxValue={WATER_LEVEL_MAX_VALUE}
          />

          {/* Carousel Bar Chart Section */}
          <StationBarChart />
        </DashboardContainer>
      </StyledDashboardContent>
      <AppFooter />
    </DashboardWrapper>
  );
}
