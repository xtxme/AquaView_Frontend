"use client";

import { useState } from "react";
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
  .select-box{
    width: 380px;
    height: 55px;
    border-radius: 20px;
    border: 1px solid #000;
    background: #FFFCF7;
    padding: 0 20px;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    color: #01205F;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%2301205F' d='M6 8L0 2l1.5-1.5L6 5l4.5-4.5L12 2z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 20px center;
  }
  .select-box:focus{
    outline: none;
    border-color: #0180F9;
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
    transition: background 0.2s;
  }
  .button:hover{
    background: #0180F9;
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

  const provinces = Array.from(new Set(MOCK_STATIONS.map(s => s.province)));

  const handleViewStations = () => {
    if (selectedProvince && onProvinceSelect) {
      onProvinceSelect(selectedProvince);
    }
  };

  return (
    <ProvinceBox>
      <div className="wh-box">
        <div className="box-text">เลือกจังหวัดเพื่อดูสถานีวัดระดับน้ำ</div>
        <div className="controls-row">
          <select 
            className="select-box"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            <option value="">เลือกจังหวัด....</option>
            {provinces.map((province, index) => (
              <option key={index} value={province}>
                {province}
              </option>
            ))}
          </select>
          <span className="button" onClick={handleViewStations}>
            <div className="button-text">ดูสถานี</div>
          </span>
        </div>
      </div>
    </ProvinceBox>
  );
}