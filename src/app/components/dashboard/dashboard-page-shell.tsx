'use client';

import React from 'react';
import styled from 'styled-components';

const ShellWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ShellContent = styled.main`
  flex: 1;
`;

interface DashboardPageShellProps {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardPageShell({ header, footer, children }: DashboardPageShellProps) {
  return (
    <ShellWrapper>
      {header}
      <ShellContent>{children}</ShellContent>
      {footer}
    </ShellWrapper>
  );
}
