'use client';

import React from 'react';
import { DashboardContainer } from '@/app/components/dashboard/dashboard-container';
import { WaterLevelChart } from '@/app/components/dashboard/water-level-chart';
import { StationBarChart } from '@/app/components/dashboard/station-bar-chart';

export default function DashboardPage() {
  return (
    <DashboardContainer>
      {/* Line Chart Section */}
      <WaterLevelChart />

      {/* Carousel Bar Chart Section */}
      <StationBarChart />
    </DashboardContainer>
  );
}
