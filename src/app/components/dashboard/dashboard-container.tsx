'use client';

import React, { useState, useRef, useEffect } from 'react';
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

  & .dropdown-wrapper {
    position: relative;
    min-width: 150px;
  }

  & .dropdown-trigger {
    width: 100%;
    padding: 12px 40px 12px 16px;
    border: 2px solid #E2E8F0;
    border-radius: 8px;
    font-size: 16px;
    background: #FFFFFF;
    color: #334155;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);

    &.open {
      border-color: #2563EB;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    &:hover {
      border-color: #CBD5E1;
    }

    &.open {
      border-color: #2563EB;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1), 0 4px 12px rgba(37, 99, 235, 0.15);
    }

    .placeholder {
      color: #94A3B8;
    }

    .arrow {
      position: absolute;
      right: 12px;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      width: 16px;
      height: 16px;
      path {
        fill: #2563EB;
      }
    }

    &.open .arrow {
      transform: rotate(180deg);
    }
  }

  & .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 6px;
    background: #FFFFFF;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
    border: 1px solid #E2E8F0;
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px) scale(0.98);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #F1F5F9;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #CBD5E1;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #94A3B8;
    }

    &.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }
  }

  & .dropdown-item {
    padding: 12px 16px;
    font-size: 15px;
    font-weight: 500;
    color: #334155;
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 1px solid #F1F5F9;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
      padding-left: 20px;
    }

    &.selected {
      background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
      color: #FFFFFF;
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
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const provinceRef = useRef<HTMLDivElement>(null);
  const districtRef = useRef<HTMLDivElement>(null);

  const provinces = [
    { value: "", label: "จังหวัด" },
    { value: "bkk", label: "กรุงเทพมหานคร" },
    { value: "chiangmai", label: "เชียงใหม่" },
  ];

  const districts = [
    { value: "", label: "เขต" },
    { value: "phra_nakhon", label: "พระนคร" },
    { value: "dusit", label: "ดุสิต" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (provinceRef.current && !provinceRef.current.contains(event.target as Node)) {
        setProvinceOpen(false);
      }
      if (districtRef.current && !districtRef.current.contains(event.target as Node)) {
        setDistrictOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          {/* Province Dropdown */}
          <div className="dropdown-wrapper" ref={provinceRef}>
            <div
              className={`dropdown-trigger ${provinceOpen ? "open" : ""}`}
              onClick={() => setProvinceOpen(!provinceOpen)}
            >
              <span className={selectedProvince ? "" : "placeholder"}>
                {selectedProvince || provinces[0].label}
              </span>
              <svg className="arrow" viewBox="0 0 16 16" fill="none">
                <path d="M8 11L3 6l1.5-1.5L8 8l3.5-3.5L13 6z"/>
              </svg>
            </div>
            <div className={`dropdown-menu ${provinceOpen ? "open" : ""}`}>
              {provinces.slice(1).map((province) => (
                <div
                  key={province.value}
                  className={`dropdown-item ${selectedProvince === province.label ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedProvince(province.label);
                    setProvinceOpen(false);
                  }}
                >
                  {province.label}
                </div>
              ))}
            </div>
          </div>

          {/* District Dropdown */}
          <div className="dropdown-wrapper" ref={districtRef}>
            <div
              className={`dropdown-trigger ${districtOpen ? "open" : ""}`}
              onClick={() => setDistrictOpen(!districtOpen)}
            >
              <span className={selectedDistrict ? "" : "placeholder"}>
                {selectedDistrict || districts[0].label}
              </span>
              <svg className="arrow" viewBox="0 0 16 16" fill="none">
                <path d="M8 11L3 6l1.5-1.5L8 8l3.5-3.5L13 6z"/>
              </svg>
            </div>
            <div className={`dropdown-menu ${districtOpen ? "open" : ""}`}>
              {districts.slice(1).map((district) => (
                <div
                  key={district.value}
                  className={`dropdown-item ${selectedDistrict === district.label ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedDistrict(district.label);
                    setDistrictOpen(false);
                  }}
                >
                  {district.label}
                </div>
              ))}
            </div>
          </div>
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
