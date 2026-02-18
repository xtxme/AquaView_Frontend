'use client';

import React from 'react';
import AppHeader from '@/app/components/header/header';
import AppFooter from '@/app/components/footer/footer';
import DashboardPageShell from '@/app/components/dashboard/dashboard-page-shell';
import DashboardPageContent from '@/app/components/dashboard/dashboard-page-content';

export default function DashboardPage() {
  return (
    <DashboardPageShell
      header={<AppHeader activePage="dashboard" />}
      footer={<AppFooter />}
    >
      <DashboardPageContent />
    </DashboardPageShell>
  );
}
