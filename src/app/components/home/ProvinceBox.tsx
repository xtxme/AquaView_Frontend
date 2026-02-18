"use client";

import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { MOCK_STATIONS } from "./mock-data";

const ProvinceBox = styled.div`
  .wh-box {
    width: min(100%, 550px);
    min-height: 180px;
    border-radius: 20px;
    background: var(--color-surface-soft);
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 32px auto 0;
    align-items: center;
    gap: 20px;
    padding: 20px;
    box-sizing: border-box;
  }

  .box-text {
    color: var(--color-primary);
    text-align: center;
    font-size: 20px;
    font-weight: 500;
    font-family: "Kanit", sans-serif;
  }

  .controls-row {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    justify-content: center;
  }

  .dropdown-container {
    position: relative;
    width: min(100%, 380px);
  }

  .dropdown-trigger {
    width: 100%;
    height: 55px;
    border-radius: 20px;
    border: 2px solid var(--color-border);
    background: var(--color-surface);
    padding: 0 45px 0 20px;
    font-size: 18px;
    font-weight: 500;
    color: var(--color-primary);
    font-family: "Kanit", sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-soft);
    user-select: none;
    text-align: left;
  }

  .dropdown-trigger:hover {
    border-color: var(--color-accent);
    box-shadow: var(--shadow-card);
  }

  .dropdown-trigger:focus-visible {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: var(--ring-secondary-soft);
  }

  .dropdown-trigger.open {
    border-color: var(--color-accent);
    box-shadow: var(--ring-secondary-soft), var(--shadow-card);
  }

  .dropdown-trigger .arrow {
    width: 14px;
    height: 14px;
    position: absolute;
    right: 18px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    path {
      fill: var(--color-accent);
    }
  }

  .dropdown-trigger.open .arrow {
    transform: rotate(180deg);
  }

  .dropdown-trigger .placeholder {
    color: var(--color-text-subtle);
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 8px;
    background: var(--color-surface);
    border-radius: 16px;
    box-shadow: var(--shadow-popover);
    border: 1px solid var(--color-border);
    max-height: 280px;
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
      background: var(--color-surface-soft);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--color-border);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: var(--color-text-subtle);
    }
  }

  .dropdown-menu.open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0) scale(1);
  }

  .dropdown-item {
    width: 100%;
    text-align: left;
    padding: 14px 20px;
    font-size: 16px;
    font-weight: 500;
    color: var(--color-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 1px solid var(--color-border);
    border-left: none;
    border-right: none;
    border-top: none;
    background: transparent;
    font-family: "Kanit", sans-serif;

    &:last-child {
      border-bottom: none;
    }

    &:hover,
    &:focus-visible {
      background: var(--gradient-hover-soft);
      padding-left: 24px;
      outline: none;
    }

    &.selected {
      background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%);
      color: var(--color-surface);
    }
  }

  .button {
    width: min(100%, 130px);
    height: 55px;
    border-radius: 20px;
    background: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-soft);
    border: none;
    font-family: "Kanit", sans-serif;
  }

  .button:hover {
    background: var(--color-secondary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-card);
  }

  .button:active {
    transform: translateY(0);
  }

  .button:focus-visible {
    outline: none;
    box-shadow: var(--ring-secondary-strong);
  }

  .button:disabled {
    background: var(--color-text-subtle);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .button-text {
    color: var(--color-surface);
    text-align: center;
    font-size: 18px;
    font-weight: 500;
  }

  .hint-text {
    min-height: 22px;
    margin: 0;
    color: var(--color-text-muted);
    font-size: 14px;
    font-family: "Kanit", sans-serif;
  }

  @media (max-width: 768px) {
    .controls-row {
      flex-direction: column;
      align-items: stretch;
    }

    .button {
      width: 100%;
    }
  }
`;

interface ProvinceBoxPageProps {
  onProvinceSelect?: (province: string) => void;
}

export default function ProvinceBoxPage({ onProvinceSelect }: ProvinceBoxPageProps) {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const provinces = Array.from(new Set(MOCK_STATIONS.map(s => s.province)));
  const isViewDisabled = !selectedProvince;

  const selectProvince = (province: string, index: number) => {
    setSelectedProvince(province);
    setActiveIndex(index);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleViewStations = () => {
    if (selectedProvince && onProvinceSelect) {
      onProvinceSelect(selectedProvince);
    }
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const selectedIndex = provinces.indexOf(selectedProvince);
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
      setIsOpen(true);
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % provinces.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + provinces.length) % provinces.length);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const province = provinces[activeIndex];
      if (province) {
        selectProvince(province, activeIndex);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && optionRefs.current[activeIndex]) {
      optionRefs.current[activeIndex]?.focus();
    }
  }, [activeIndex, isOpen]);

  return (
    <ProvinceBox>
      <div className="wh-box">
        <div className="box-text">เลือกจังหวัดเพื่อดูสถานีวัดระดับน้ำ</div>
        <div className="controls-row">
          <div className="dropdown-container" ref={dropdownRef}>
            <button
              id="province-combobox"
              type="button"
              ref={triggerRef}
              className={`dropdown-trigger ${isOpen ? "open" : ""}`}
              aria-haspopup="listbox"
              aria-controls="province-listbox"
              aria-expanded={isOpen}
              onClick={() => {
                const selectedIndex = provinces.indexOf(selectedProvince);
                setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
                setIsOpen((prev) => !prev);
              }}
              onKeyDown={handleTriggerKeyDown}
            >
              <span className={selectedProvince ? "" : "placeholder"}>
                {selectedProvince || "เลือกจังหวัด..."}
              </span>
              <svg className="arrow" viewBox="0 0 14 14" fill="none">
                <path d="M7 9.5L2.5 5l1.06-1.06L7 7.38l3.44-3.44L11.5 5z" />
              </svg>
            </button>
            <div
              id="province-listbox"
              role="listbox"
              aria-labelledby="province-combobox"
              className={`dropdown-menu ${isOpen ? "open" : ""}`}
              onKeyDown={handleListKeyDown}
            >
              {provinces.map((province, index) => (
                <button
                  type="button"
                  key={province}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  role="option"
                  aria-selected={selectedProvince === province}
                  className={`dropdown-item ${selectedProvince === province ? "selected" : ""}`}
                  tabIndex={isOpen ? 0 : -1}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    selectProvince(province, index);
                  }}
                >
                  {province}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="button"
            disabled={isViewDisabled}
            onClick={handleViewStations}
            aria-disabled={isViewDisabled}
          >
            <div className="button-text">ดูสถานี</div>
          </button>
        </div>
        <p className="hint-text" aria-live="polite">
          {selectedProvince ? `พร้อมแสดงสถานีในจังหวัด ${selectedProvince}` : "กรุณาเลือกจังหวัดก่อนกดดูสถานี"}
        </p>
      </div>
    </ProvinceBox>
  );
}
