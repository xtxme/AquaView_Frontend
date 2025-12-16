"use client";

import ProvinceBoxPage from "@/app/components/home/ProvinceBox";
import StationMapPage from "@/app/components/home/StationMap";
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
    font-size: 48px;
    font-style: normal;
    font-weight: 400;
    padding-top: 170px;
  }
  .header2-text{
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #3273BA;
    text-align: center;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    padding-top: 24px;
    z-index: 1;
  }
  .header3-text{
    color: #01205F;
    font-size: 28px;
    font-style: normal;
    font-weight: 500;
    justify-content: center;
    flex-direction: column;
    padding-top: 90px ;
    transform:translateX(143px);
  }
  
`;
export default function HomePage() {
  return (
    <Home>
        <div className="header-text">ระบบเฝ้าระวังและคาดการณ์ระดับน้ำอัตโนมัติ <br/>แจ้งเตือนก่อนถึงระดับวิกฤต</div>
        <div className="header2-text">รองรับการดูย้อนหลัง ส่งออกรายงาน และแสดงผลบนแผนที่</div>
        <ProvinceBoxPage/>
        <div className="header3-text">แผนที่ตำแหน่งเครื่องวัด</div>
        <StationMapPage />


    </Home>
  );
}
