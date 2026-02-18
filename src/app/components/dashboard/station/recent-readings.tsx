'use client';

import React from 'react';
import styled from 'styled-components';
import { Reading } from '@/lib/types';

const Container = styled.div`
  background: var(--color-surface);
  border-radius: 18px;
  padding: 24px;
  box-shadow: var(--shadow-card);
  margin-top: 32px;
`;

const Title = styled.h2`
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 24px;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Kanit', sans-serif;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 14px;
  font-weight: 500;
  font-family: 'Kanit', sans-serif;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 14px;
  font-family: 'Kanit', sans-serif;

  &:last-child {
    text-align: right;
  }
`;

const TrendBadge = styled.span<{ direction: 'up' | 'down' | 'stable' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Kanit', sans-serif;

  ${({ direction }) => {
        switch (direction) {
            case 'up': return 'color: var(--status-danger);'; // Rising water is usually bad
            case 'down': return 'color: var(--status-safe);';
            default: return 'color: var(--color-text-muted);';
        }
    }}
`;

interface RecentReadingsProps {
    readings: Reading[];
}

export const RecentReadings: React.FC<RecentReadingsProps> = ({ readings }) => {
    return (
        <Container>
            <Title>ตารางข้อมูลรายชั่วโมง</Title>
            <TableWrapper>
                <Table>
                    <thead>
                        <tr>
                            <Th>วันที่</Th>
                            <Th>เวลา</Th>
                            <Th>ระดับน้ำ (ม.)</Th>
                            <Th style={{ textAlign: 'right' }}>การเปลี่ยนแปลง (ม.)</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {readings.slice(0, 12).map((reading, index) => {
                            const date = new Date(reading.ts);
                            const prevReading = readings[index + 1];
                            const change = prevReading ? reading.water_level_m - prevReading.water_level_m : 0;
                            const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';

                            return (
                                <tr key={reading.id}>
                                    <Td>
                                        {date.toLocaleDateString('th-TH', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </Td>
                                    <Td>
                                        {date.toLocaleTimeString('th-TH', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })} น.
                                    </Td>
                                    <Td>{reading.water_level_m.toFixed(2)}</Td>
                                    <Td>
                                        <TrendBadge direction={direction}>
                                            {change > 0 ? '↗' : change < 0 ? '↘' : '-'}
                                            {Math.abs(change).toFixed(2)}
                                        </TrendBadge>
                                    </Td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </TableWrapper>
        </Container>
    );
};
