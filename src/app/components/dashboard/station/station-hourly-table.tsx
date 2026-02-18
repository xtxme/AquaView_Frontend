'use client';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { ArrowDownRight, ArrowUpRight, Clock3 } from 'lucide-react';
import { Reading } from '@/lib/types';

const TableCard = styled.section`
  background: var(--color-surface-soft);
  border-radius: 16px;
  padding: 14px 20px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 620px;
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
    font-size: 16px;
    font-weight: 600;
    color: var(--color-primary);
  }

  tbody tr:last-child td {
    border-bottom: 0;
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
  color: ${({ trend }) => {
    if (trend === 'up') return 'var(--status-danger)';
    if (trend === 'down') return 'var(--status-safe)';
    return 'var(--color-text-muted)';
  }};
`;

interface StationHourlyTableProps {
  readings: Reading[];
}

export default function StationHourlyTable({ readings }: StationHourlyTableProps) {
  const rows = useMemo(() => readings.slice(0, 12).reverse(), [readings]);

  return (
    <TableCard>
      <Table>
        <thead>
          <tr>
            <th>วันที่</th>
            <th>เวลา</th>
            <th>ระดับน้ำ (ม.)</th>
            <th>การเปลี่ยนแปลง (ม.)</th>
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
                <td>
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
                    {`${delta > 0 ? '+' : ''}${delta.toFixed(2)} ม.`}
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
