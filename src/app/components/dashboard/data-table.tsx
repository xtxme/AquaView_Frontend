'use client';

import React from 'react';
import styled from 'styled-components';

// Styled components with class selectors
const TableWrapper = styled.div`
  &.table-wrapper {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

const TableHeader = styled.div`
  &.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
`;

const TableTitle = styled.h2`
  &.table-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
  }
`;

const ActionButtons = styled.div`
  &.action-buttons {
    display: flex;
    gap: 12px;
  }
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  &.action-button {
    padding: 8px 20px;
    border-radius: 8px;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    
    background: ${props => props.$variant === 'primary' ? '#1e3a8a' : 'white'};
    color: ${props => props.$variant === 'primary' ? 'white' : '#1a1a1a'};
    border: ${props => props.$variant === 'primary' ? 'none' : '1px solid #e0e0e0'};

    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  }
`;

const Table = styled.table`
  &.data-table {
    width: 100%;
    border-collapse: collapse;
  }
`;

const TableHead = styled.thead`
  &.table-head {
    background: #f5f5f5;
  }
`;

const TableRow = styled.tr`
  &.table-row {
    border-bottom: 1px solid #e0e0e0;
    
    &:hover {
      background: #f9f9f9;
    }
  }
`;

const TableHeaderCell = styled.th`
  &.table-header-cell {
    padding: 12px 16px;
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    color: #666;
  }
`;

const TableCell = styled.td`
  &.table-cell {
    padding: 12px 16px;
    font-size: 14px;
    color: #1a1a1a;
  }
`;

const TrendIndicator = styled.span<{ $trend: 'up' | 'down' }>`
  &.trend-indicator {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: ${props => props.$trend === 'up' ? '#f44336' : '#4caf50'};
    font-weight: 500;

    &::before {
      content: '${props => props.$trend === 'up' ? '↗' : '↘'}';
      font-size: 16px;
    }
  }
`;

const TimeIcon = styled.span`
  &.time-icon {
    &::before {
      content: '🕐';
      margin-right: 4px;
    }
  }
`;

interface DataRow {
    date: string;
    time: string;
    levelL: number;
    levelPercent: number;
    trend: 'up' | 'down';
    trendValue: number;
}

export default function DataTable() {
    // Variable declaration as requested
    const tableData: DataRow[] = [
        { date: '22 ม.ค. 2025', time: '12:00', levelL: 1.29, levelPercent: 26, trend: 'up', trendValue: 0.21 },
        { date: '22 ม.ค. 2025', time: '13:00', levelL: 1.29, levelPercent: 26, trend: 'down', trendValue: 0.66 },
        { date: '22 ม.ค. 2025', time: '14:00', levelL: 1.29, levelPercent: 26, trend: 'up', trendValue: 0.41 },
        { date: '22 ม.ค. 2025', time: '15:00', levelL: 1.29, levelPercent: 70, trend: 'down', trendValue: 0.21 },
        { date: '22 ม.ค. 2025', time: '16:00', levelL: 1.29, levelPercent: 56, trend: 'down', trendValue: 0.66 },
    ];

    return (
        <TableWrapper className="table-wrapper">
            <TableHeader className="table-header">
                <TableTitle className="table-title">ตารางข้อมูลรายวัน</TableTitle>
                <ActionButtons className="action-buttons">
                    <ActionButton className="action-button" $variant="primary">
                        เลือกข้อมูลหลายอย่าง
                    </ActionButton>
                    <ActionButton className="action-button" $variant="secondary">
                        Export 📤
                    </ActionButton>
                </ActionButtons>
            </TableHeader>

            <Table className="data-table">
                <TableHead className="table-head">
                    <TableRow className="table-row">
                        <TableHeaderCell className="table-header-cell">วันที่</TableHeaderCell>
                        <TableHeaderCell className="table-header-cell">เวลา</TableHeaderCell>
                        <TableHeaderCell className="table-header-cell">ระดับน้ำ (L)</TableHeaderCell>
                        <TableHeaderCell className="table-header-cell">ระดับน้ำ (%)</TableHeaderCell>
                        <TableHeaderCell className="table-header-cell">ความน่าเชื่อถือบัลลัง (L)</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <tbody>
                    {tableData.map((row, index) => (
                        <TableRow key={index} className="table-row">
                            <TableCell className="table-cell">{row.date}</TableCell>
                            <TableCell className="table-cell">
                                <TimeIcon className="time-icon" />
                                {row.time}
                            </TableCell>
                            <TableCell className="table-cell">{row.levelL.toFixed(2)} ม.</TableCell>
                            <TableCell className="table-cell">{row.levelPercent} %</TableCell>
                            <TableCell className="table-cell">
                                <TrendIndicator className="trend-indicator" $trend={row.trend}>
                                    +{row.trendValue.toFixed(2)} ม.
                                </TrendIndicator>
                            </TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </Table>
        </TableWrapper>
    );
}
