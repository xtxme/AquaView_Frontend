"use client";

import { useState, useRef, useEffect } from "react";
import ProvinceBoxPage from "@/app/components/home/ProvinceBox";
import StationMapPage from "@/app/components/home/StationMap";
import WhiteBoxPage from "@/app/components/home/WhiteBox";
import styled from "styled-components";

const Home = styled.div`
  flex: 1;
  width: 100%;
  
  /* Changed from height: 100% to ensure background covers full content when scrolling */
  min-height: 100vh;
  
  background-color: #e1ebf7;

  .header-text{
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #01205F;
    text-align: center;
    font-size: 36px;
    font-style: normal;
    font-weight: 400;
    padding-top: 60px;
  }
  .header2-text{
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #3273BA;
    text-align: center;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    padding-top: 16px;
    z-index: 1;
  }
  .header3-text{
    color: #01205F;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    display: flex; /* Added display: flex to make justify-content work */
    justify-content: center;
    flex-direction: column;
    padding-top: 50px ;
    text-align: center; /* Added text-align center */
    /* transform:translateX(120px); -- Removed to prevent horizontal overflow */
  }

`;
export default function HomePage() {
  const [selectedProvince, setSelectedProvince] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province);
  };

  useEffect(() => {
    if (selectedProvince && mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedProvince]);

  return (
    <Home>
      <div className="header-text">ระบบเฝ้าระวังและคาดการณ์ระดับน้ำอัตโนมัติ <br />แจ้งเตือนก่อนถึงระดับวิกฤต</div>
      <div className="header2-text">รองรับการดูย้อนหลัง ส่งออกรายงาน และแสดงผลบนแผนที่</div>
      <ProvinceBoxPage onProvinceSelect={handleProvinceSelect} />
      <div className="header3-text">แผนที่ตำแหน่งเครื่องวัด</div>
      <StationMapPage ref={mapRef} selectedProvince={selectedProvince} />
      <div className="header3-text">ฟีเจอร์หลักของระบบ</div>
      <WhiteBoxPage />


    </Home>
  );
}
