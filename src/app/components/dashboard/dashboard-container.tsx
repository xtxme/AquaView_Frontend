'use client';

import React from 'react';
import styled from 'styled-components';

// 1. Declare a variable for shared styling or configuration
const PRESET_HEADER_HEIGHT = '80px';

// 2. Styled Components using Class Selectors
const StyledDashboard = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #F0F4F8 0%, #FFFFFF 100%);
  padding: 20px;
  font-family: 'Inter', sans-serif;

  & .search-container {
    background: #FFFFFF;
    border-radius: 12px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
    height: ${PRESET_HEADER_HEIGHT};
    border: 1px solid #E2E8F0;
  }

  & .search-input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    font-size: 16px;
    background: #F8FAFC;
    color: #334155;
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: #2563EB;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
  }

  & .dropdown-group {
    display: flex;
    gap: 12px;
  }

  & .dropdown {
    padding: 12px 16px;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    font-size: 16px;
    background: #FFFFFF;
    color: #334155;
    min-width: 150px;
    cursor: pointer;
    outline: none;

    &:hover {
      border-color: #CBD5E1;
    }
  }

  & .search-btn {
    background: #1E3A8A; /* Dark Blue from screenshot */
    color: white;
    padding: 12px 32px;
    border-radius: 8px;
    border: none;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    
    &:hover {
      background: #172554;
    }
  }

  & .content-area {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
`;

interface DashboardContainerProps {
  children?: React.ReactNode;
}

export function DashboardContainer({ children }: DashboardContainerProps) {
  return (
    <StyledDashboard>
      {/* Search Header */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="ค้นหาข้อมูล สถานี หรือชื่อ"
        />

        <div className="dropdown-group">
          <select className="dropdown">
            <option value="">จังหวัด</option>
            <option value="bkk">กรุงเทพมหานคร</option>
            <option value="chiangmai">เชียงใหม่</option>
          </select>

          <select className="dropdown">
            <option value="">เขต</option>
            <option value="phra_nakhon">พระนคร</option>
            <option value="dusit">ดุสิต</option>
          </select>
        </div>

        <button className="search-btn">
          ค้นหา
        </button>
      </div>

      {/* Main Content Info */}
      <div className="content-area">
        {children}
      </div>
    </StyledDashboard>
  );
}
