"use client";

import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { MOCK_STATIONS } from "./mock-data";

const ProvinceBox = styled.div`
    .wh-box{
    width: 550px;
    height: 180px;
    border-radius: 20px;
    background: #FFFCF7;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 32px auto 0;
    align-items: center;
    gap: 20px;
  }
  .box-text{
    color: #01205F;
    text-align: center;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
  }
  .controls-row{
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .dropdown-container{
    position: relative;
    width: 380px;
  }
  .dropdown-trigger{
    width: 100%;
    height: 55px;
    border-radius: 20px;
    border: 2px solid #E0E0E0;
    background: #FFFFFF;
    padding: 0 45px 0 20px;
    font-size: 18px;
    font-weight: 500;
    color: #01205F;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    user-select: none;
  }
  .dropdown-trigger:hover{
    border-color: #0180F9;
    box-shadow: 0 4px 12px rgba(1,128,249,0.15);
  }
  .dropdown-trigger.open{
    border-color: #0180F9;
    box-shadow: 0 0 0 4px rgba(1,128,249,0.1), 0 4px 12px rgba(1,128,249,0.2);
  }
  .dropdown-trigger .arrow{
    width: 14px;
    height: 14px;
    position: absolute;
    right: 18px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    path{
      fill: #0180F9;
    }
  }
  .dropdown-trigger.open .arrow{
    transform: rotate(180deg);
  }
  .dropdown-trigger .placeholder{
    color: #999;
  }
  .dropdown-menu{
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 8px;
    background: #FFFFFF;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
    border: 1px solid #E0E0E0;
    max-height: 280px;
    overflow-y: auto;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px) scale(0.98);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    &::-webkit-scrollbar{
      width: 6px;
    }
    &::-webkit-scrollbar-track{
      background: #F5F5F5;
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb{
      background: #C0C0C0;
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb:hover{
      background: #A0A0A0;
    }
  }
  .dropdown-menu.open{
    opacity: 1;
    visibility: visible;
    transform: translateY(0) scale(1);
  }
  .dropdown-item{
    padding: 14px 20px;
    font-size: 16px;
    font-weight: 500;
    color: #01205F;
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 1px solid #F5F5F5;
    &:last-child{
      border-bottom: none;
    }
    &:hover{
      background: linear-gradient(135deg, #F0F8FF 0%, #E6F4FF 100%);
      padding-left: 24px;
    }
    &.selected{
      background: linear-gradient(135deg, #0180F9 0%, #0060D9 100%);
      color: #FFFFFF;
    }
  }
  .button{
    width: 130px;
    height: 55px;
    border-radius: 20px;
    background: #01205F;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(1,32,95,0.3);
  }
  .button:hover{
    background: #0180F9;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(1,128,249,0.4);
  }
  .button:active{
    transform: translateY(0);
  }
  .button-text{
    color: #FFFCF7;
    text-align: center;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
  }
`;

interface ProvinceBoxPageProps {
  onProvinceSelect?: (province: string) => void
}

export default function ProvinceBoxPage({ onProvinceSelect }: ProvinceBoxPageProps) {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const provinces = Array.from(new Set(MOCK_STATIONS.map(s => s.province)));

  const handleViewStations = () => {
    if (selectedProvince && onProvinceSelect) {
      onProvinceSelect(selectedProvince);
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

  return (
    <ProvinceBox>
      <div className="wh-box">
        <div className="box-text">เลือกจังหวัดเพื่อดูสถานีวัดระดับน้ำ</div>
        <div className="controls-row">
          <div className="dropdown-container" ref={dropdownRef}>
            <div 
              className={`dropdown-trigger ${isOpen ? "open" : ""}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className={selectedProvince ? "" : "placeholder"}>
                {selectedProvince || "เลือกจังหวัด...."}
              </span>
              <svg className="arrow" viewBox="0 0 14 14" fill="none">
                <path d="M7 9.5L2.5 5l1.06-1.06L7 7.38l3.44-3.44L11.5 5z"/>
              </svg>
            </div>
            <div className={`dropdown-menu ${isOpen ? "open" : ""}`}>
              {provinces.map((province, index) => (
                <div
                  key={index}
                  className={`dropdown-item ${selectedProvince === province ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedProvince(province);
                    setIsOpen(false);
                  }}
                >
                  {province}
                </div>
              ))}
            </div>
          </div>
          <span className="button" onClick={handleViewStations}>
            <div className="button-text">ดูสถานี</div>
          </span>
        </div>
      </div>
    </ProvinceBox>
  );
}