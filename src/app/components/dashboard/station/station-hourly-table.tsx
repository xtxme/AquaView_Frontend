'use client';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { ArrowDownRight, ArrowUpRight, Clock3 } from 'lucide-react';
import { Reading } from '@/lib/types';

const TableCard = styled.section`
  background: var(--color-surface-soft);
  border-radius: 16px;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  overflow-x: auto;
`;

const Table = styled.table<{ $desktop: boolean }>`
  width: 100%;
  border-collapse: collapse;
  min-width: ${({ $desktop }) => ($desktop ? '620px' : '0')};
  font-family: var(--font-kanit), sans-serif;

  th,
  td {
    padding: 10px 12px;
    border-bottom: 1px solid var(--color-border);
    text-align: left;
    font-size: 14px;
    color: var(--color-text);
  }

  th {
    font-size: 15px;
    font-weight: 600;
    color: var(--color-primary);
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  @media (max-width: 640px) {
    th.date-col,
    td.date-col {
      display: ${({ $desktop }) => ($desktop ? 'table-cell' : 'none')};
    }

    th,
    td {
      padding: 10px 8px;
      font-size: 13px;
    }
  }
`;

const TimeCell = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const DeltaValue = styled.span<{ trend: 'up' | 'down' | 'flat' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 999px;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ trend }) => {
    if (trend === 'up') return 'var(--status-danger)';
    if (trend === 'down') return 'var(--status-safe)';
    return 'var(--color-text-muted)';
  }};
  background: ${({ trend }) => {
    if (trend === 'up') return 'var(--status-danger-bg)';
    if (trend === 'down') return 'var(--status-safe-bg)';
    return 'var(--color-surface)';
  }};
`;

interface StationHourlyTableProps {
  readings: Reading[];
  mode?: 'desktop' | 'auto';
}

export default function StationHourlyTable({ readings, mode = 'auto' }: StationHourlyTableProps) {
  const rows = useMemo(() => readings.slice(0, 12).reverse(), [readings]);
  const isDesktopMode = mode === 'desktop';

  return (
    <TableCard>
      <Table $desktop={isDesktopMode}>
        <thead>
          <tr>
            <th className="date-col">วันที่</th>
            <th>เวลา</th>
            <th>ระดับน้ำ</th>
            <th>เปลี่ยนแปลง</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((reading, index) => {
            const currentDate = new Date(reading.ts);
            const previous = rows[index - 1];
            const delta = previous ? reading.water_level_m - previous.water_level_m : 0;
            const trend: 'up' | 'down' | 'flat' = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';

            return (
              <tr key={reading.id}>
                <td className="date-col">
                  {currentDate.toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td>
                  <TimeCell>
                    <Clock3 size={14} color="var(--color-secondary)" />
                    {currentDate.toLocaleTimeString('th-TH', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TimeCell>
                </td>
                <td>{reading.water_level_m.toFixed(2)} ม.</td>
                <td>
                  <DeltaValue trend={trend}>
                    {trend === 'up' ? <ArrowUpRight size={14} /> : null}
                    {trend === 'down' ? <ArrowDownRight size={14} /> : null}
                    {`${delta > 0 ? '+' : ''}${delta.toFixed(2)}`}
                  </DeltaValue>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </TableCard>
  );
}
