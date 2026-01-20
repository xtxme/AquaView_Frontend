'use client';

import React from 'react';
import styled from 'styled-components';
import { Station } from '@/lib/types';

const HeaderContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
  color: #1E3A8A;
  margin-bottom: 24px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #2563EB;
  min-width: 20px;
  min-height: 20px;
`;

const StatusBadge = styled.div<{ status: 'normal' | 'warning' | 'critical' }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 8px;
  margin-left: auto;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;

  ${({ status }) => {
        switch (status) {
            case 'normal':
                return `
          background-color: #DCFCE7;
          color: #16A34A;
          border: 1px solid #86EFAC;
        `;
            case 'warning':
                return `
          background-color: #FEF3C7;
          color: #D97706;
          border: 1px solid #FBBF24;
        `;
            case 'critical':
                return `
          background-color: #FEE2E2;
          color: #DC2626;
          border: 1px solid #FCA5A5;
        `;
        }
    }}
`;

interface StationHeaderProps {
    station: Station;
    status: 'normal' | 'warning' | 'critical';
}

export const StationHeader: React.FC<StationHeaderProps> = ({ station, status }) => {
    const getStatusText = (s: string) => {
        switch (s) {
            case 'normal': return 'ปกติ';
            case 'warning': return 'เฝ้าระวัง';
            case 'critical': return 'วิกฤต';
            default: return 'ปกติ';
        }
    };

    return (
        <HeaderContainer>
            {/* Location */}
            <InfoItem>
                <IconWrapper>
                    {/* วางรูป icon ของคุณที่นี่ */}
                </IconWrapper>
                {station.district} - {station.province}
            </InfoItem>

            {/* Bank Level */}
            <InfoItem>
                <IconWrapper>
                    {/* วางรูป icon ของคุณที่นี่ */}
                </IconWrapper>
                ริมตลิ่ง: <b>{station.bank_level_m.toFixed(2)} ม.</b>
            </InfoItem>

            {/* Station Type */}
            <InfoItem>
                <IconWrapper>
                    {/* วางรูป icon ของคุณที่นี่ */}
                </IconWrapper>
                สถานีต้นน้ำแม่ปิง
            </InfoItem>

            {/* Status */}
            <StatusBadge status={status}>
                สถานะ: {getStatusText(status)}
            </StatusBadge>
        </HeaderContainer>
    );
};
