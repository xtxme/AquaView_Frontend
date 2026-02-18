'use client';

import React from 'react';
import styled from 'styled-components';

const StyledActionButton = styled.button`
  &.station-action-button {
    border: 0;
    border-radius: 28px;
    background: var(--color-primary);
    color: var(--color-surface);
    padding: 12px 24px;
    font-family: 'Kanit', sans-serif;
    font-size: 26px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    line-height: 1;
  }

  &.station-action-button:hover {
    background: var(--color-primary-strong);
  }

  @media (max-width: 900px) {
    &.station-action-button {
      font-size: 18px;
      padding: 10px 16px;
    }
  }
`;

interface StationActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function StationActionButton({
  children,
  className,
  ...props
}: StationActionButtonProps) {
  return (
    <StyledActionButton
      type="button"
      className={`station-action-button ${className || ''}`.trim()}
      {...props}
    >
      {children}
    </StyledActionButton>
  );
}
