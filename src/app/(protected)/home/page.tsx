"use client";

import { useState } from "react";
import ProvinceBoxPage from "@/app/components/home/ProvinceBox";
import StationMapPage from "@/app/components/home/StationMap";
import WhiteBoxPage from "@/app/components/home/WhiteBox";
import styled from "styled-components";

const Home = styled.div`
  flex: 1;
  width: 100%;
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
    justify-content: center;
    flex-direction: column;
    padding-top: 50px ;
    transform:translateX(120px);
  }

`;
export default function HomePage() {
  const [selectedProvince, setSelectedProvince] = useState("");

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province);
  };

  return (
    <Home>
        <div className="header-text">ระบบเฝ้าระวังและคาดการณ์ระดับน้ำอัตโนมัติ <br/>แจ้งเตือนก่อนถึงระดับวิกฤต</div>
        <div className="header2-text">รองรับการดูย้อนหลัง ส่งออกรายงาน และแสดงผลบนแผนที่</div>
        <ProvinceBoxPage onProvinceSelect={handleProvinceSelect}/>
        <div className="header3-text">แผนที่ตำแหน่งเครื่องวัด</div>
        <StationMapPage selectedProvince={selectedProvince} />
        <div className="header3-text">ฟีเจอร์หลักของระบบ</div>
        <WhiteBoxPage/>


    </Home>
  );
}
