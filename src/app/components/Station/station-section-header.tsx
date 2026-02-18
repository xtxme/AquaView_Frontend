'use client';

import React from 'react';
import styled from 'styled-components';

const HeaderWrap = styled.div`
  &.station-section-head {
    margin-top: 28px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .station-section-title {
    margin: 0;
    color: var(--color-primary);
    font-size: 34px;
    font-weight: 600;
    line-height: 1.2;
    font-family: 'Kanit', sans-serif;
  }

  .station-section-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  @media (max-width: 900px) {
    &.station-section-head {
      flex-direction: column;
      align-items: flex-start;
    }

    .station-section-title {
      font-size: 24px;
    }
  }
`;

interface StationSectionHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export default function StationSectionHeader({ title, actions }: StationSectionHeaderProps) {
  return (
    <HeaderWrap className="station-section-head">
      <h2 className="station-section-title">{title}</h2>
      {actions ? <div className="station-section-actions">{actions}</div> : null}
    </HeaderWrap>
  );
}
