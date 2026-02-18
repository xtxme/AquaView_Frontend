'use client';

import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

const PRESET_HEADER_HEIGHT = '80px';

const StyledDashboard = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  padding-bottom: 30px;
  font-family: 'Kanit', sans-serif;

  & .search-container {
    background: var(--color-surface);
    border-radius: 12px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: var(--shadow-soft);
    margin-bottom: 24px;
    min-height: ${PRESET_HEADER_HEIGHT};
    border: 1px solid var(--color-border);
    flex-wrap: wrap;
  }

  & .search-input {
    flex: 1;
    min-width: 220px;
    padding: 12px 16px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-size: 16px;
    background: var(--color-surface-soft);
    color: var(--color-text-muted);
    outline: none;
    transition: all 0.2s;
    font-family: 'Kanit', sans-serif;

    &:focus {
      border-color: var(--color-secondary);
      box-shadow: var(--ring-secondary-soft);
    }
  }

  & .dropdown-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  & .dropdown-wrapper {
    position: relative;
    min-width: 170px;
  }

  & .dropdown-trigger {
    width: 100%;
    padding: 12px 40px 12px 16px;
    border: 2px solid var(--color-border);
    border-radius: 8px;
    font-size: 16px;
    background: var(--color-surface);
    color: var(--color-text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s;
    user-select: none;
    box-shadow: var(--shadow-soft);
    text-align: left;
    font-family: 'Kanit', sans-serif;

    &:hover {
      border-color: var(--color-border);
    }

    &:focus-visible {
      outline: none;
      border-color: var(--color-secondary);
      box-shadow: var(--ring-secondary-soft);
    }

    &.open {
      border-color: var(--color-secondary);
      box-shadow: var(--ring-secondary-soft), var(--shadow-card);
    }

    &:disabled {
      background: var(--color-surface-soft);
      color: var(--color-text-subtle);
      cursor: not-allowed;
    }

    .placeholder {
      color: var(--color-text-subtle);
    }

    .arrow {
      position: absolute;
      right: 12px;
      transition: transform 0.2s;
      width: 16px;
      height: 16px;

      path {
        fill: var(--color-secondary);
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
    background: var(--color-surface);
    border-radius: 12px;
    box-shadow: var(--shadow-popover);
    border: 1px solid var(--color-border);
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px) scale(0.98);
    transition: all 0.2s;

    &.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }
  }

  & .dropdown-item {
    width: 100%;
    text-align: left;
    padding: 12px 16px;
    font-size: 15px;
    font-weight: 500;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    border-bottom: 1px solid var(--color-border);
    background: transparent;
    font-family: 'Kanit', sans-serif;

    &:last-child {
      border-bottom: none;
    }

    &:hover,
    &:focus-visible {
      background: var(--gradient-hover-soft);
      padding-left: 20px;
      outline: none;
    }

    &.selected {
      background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%);
      color: var(--color-surface);
    }
  }

  & .search-btn {
    background: var(--color-primary);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    font-family: 'Kanit', sans-serif;

    &:hover {
      background: var(--color-primary-strong);
    }

    &:disabled {
      background: var(--color-text-subtle);
      cursor: not-allowed;
    }
  }

  & .search-btn.secondary {
    background: var(--color-text-muted);

    &:hover {
      background: var(--color-primary);
    }
  }

  & .content-area {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  @media (max-width: 900px) {
    padding: 14px;

    & .search-container {
      padding: 14px;
      align-items: stretch;
    }

    & .search-input,
    & .dropdown-wrapper,
    & .search-btn {
      width: 100%;
      min-width: 0;
    }

    & .dropdown-group {
      width: 100%;
    }
  }
`;

interface DashboardContainerProps {
  children?: React.ReactNode;
  query: string;
  selectedProvince: string;
  selectedDistrict: string;
  provinceOptions: string[];
  districtOptions: string[];
  onQueryChange: (query: string) => void;
  onProvinceChange: (province: string) => void;
  onDistrictChange: (district: string) => void;
  onApplyFilters?: () => void;
  onClearFilters?: () => void;
}

export function DashboardContainer({
  children,
  query,
  selectedProvince,
  selectedDistrict,
  provinceOptions,
  districtOptions,
  onQueryChange,
  onProvinceChange,
  onDistrictChange,
  onApplyFilters,
  onClearFilters,
}: DashboardContainerProps) {
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);

  const provinceRef = useRef<HTMLDivElement>(null);
  const districtRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (provinceRef.current && !provinceRef.current.contains(event.target as Node)) {
        setProvinceOpen(false);
      }
      if (districtRef.current && !districtRef.current.contains(event.target as Node)) {
        setDistrictOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProvinceListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setProvinceOpen(false);
    }
  };

  const handleDistrictListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setDistrictOpen(false);
    }
  };

  return (
    <StyledDashboard>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="ค้นหาข้อมูล สถานี หรือชื่อ"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />

        <div className="dropdown-group">
          <div className="dropdown-wrapper" ref={provinceRef}>
            <button
              type="button"
              className={`dropdown-trigger ${provinceOpen ? 'open' : ''}`}
              aria-haspopup="listbox"
              aria-controls="province-listbox"
              aria-expanded={provinceOpen}
              onClick={() => setProvinceOpen((prev) => !prev)}
            >
              <span className={selectedProvince ? '' : 'placeholder'}>
                {selectedProvince || 'จังหวัด'}
              </span>
              <svg className="arrow" viewBox="0 0 16 16" fill="none">
                <path d="M8 11L3 6l1.5-1.5L8 8l3.5-3.5L13 6z" />
              </svg>
            </button>
            <div
              id="province-listbox"
              role="listbox"
              aria-label="เลือกจังหวัด"
              className={`dropdown-menu ${provinceOpen ? 'open' : ''}`}
              onKeyDown={handleProvinceListKeyDown}
            >
              <button
                type="button"
                className={`dropdown-item ${selectedProvince === '' ? 'selected' : ''}`}
                role="option"
                aria-selected={selectedProvince === ''}
                onClick={() => {
                  onProvinceChange('');
                  setProvinceOpen(false);
                }}
              >
                ทั้งหมด
              </button>
              {provinceOptions.map((province) => (
                <button
                  type="button"
                  key={province}
                  className={`dropdown-item ${selectedProvince === province ? 'selected' : ''}`}
                  role="option"
                  aria-selected={selectedProvince === province}
                  onClick={() => {
                    onProvinceChange(province);
                    setProvinceOpen(false);
                  }}
                >
                  {province}
                </button>
              ))}
            </div>
          </div>

          <div className="dropdown-wrapper" ref={districtRef}>
            <button
              type="button"
              disabled={districtOptions.length === 0}
              className={`dropdown-trigger ${districtOpen ? 'open' : ''}`}
              aria-haspopup="listbox"
              aria-controls="district-listbox"
              aria-expanded={districtOpen}
              onClick={() => setDistrictOpen((prev) => !prev)}
            >
              <span className={selectedDistrict ? '' : 'placeholder'}>
                {selectedDistrict || 'เขต/อำเภอ'}
              </span>
              <svg className="arrow" viewBox="0 0 16 16" fill="none">
                <path d="M8 11L3 6l1.5-1.5L8 8l3.5-3.5L13 6z" />
              </svg>
            </button>
            <div
              id="district-listbox"
              role="listbox"
              aria-label="เลือกเขตหรืออำเภอ"
              className={`dropdown-menu ${districtOpen ? 'open' : ''}`}
              onKeyDown={handleDistrictListKeyDown}
            >
              <button
                type="button"
                className={`dropdown-item ${selectedDistrict === '' ? 'selected' : ''}`}
                role="option"
                aria-selected={selectedDistrict === ''}
                onClick={() => {
                  onDistrictChange('');
                  setDistrictOpen(false);
                }}
              >
                ทั้งหมด
              </button>
              {districtOptions.map((district) => (
                <button
                  type="button"
                  key={district}
                  className={`dropdown-item ${selectedDistrict === district ? 'selected' : ''}`}
                  role="option"
                  aria-selected={selectedDistrict === district}
                  onClick={() => {
                    onDistrictChange(district);
                    setDistrictOpen(false);
                  }}
                >
                  {district}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="search-btn" type="button" onClick={onApplyFilters}>
          ค้นหา
        </button>
        <button
          className="search-btn secondary"
          type="button"
          onClick={onClearFilters}
          disabled={!query && !selectedProvince && !selectedDistrict}
        >
          ล้างตัวกรอง
        </button>
      </div>

      <div className="content-area">{children}</div>
    </StyledDashboard>
  );
}
