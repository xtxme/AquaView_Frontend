"use client";

import { useState, useRef, useEffect } from "react";
import ProvinceBoxPage from "@/app/components/home/ProvinceBox";
import StationMapPage from "@/app/components/home/StationMap";
import WhiteBoxPage from "@/app/components/home/WhiteBox";
import AppHeader from "@/app/components/header/header";
import AppFooter from "@/app/components/footer/footer";
import styled from "styled-components";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-page);
`;

const ContentWrapper = styled.main`
  flex: 1;
`;

const Home = styled.section`
  flex: 1;
  width: 100%;
  padding: 24px 0 80px;
  background-color: var(--color-section);
  font-family: "Kanit", sans-serif;

  .header-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: var(--color-primary);
    text-align: center;
    font-size: clamp(28px, 4.5vw, 42px);
    font-style: normal;
    font-weight: 500;
    line-height: 1.25;
    padding: 30px 16px 0;
  }

  .header2-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: var(--color-secondary);
    text-align: center;
    font-size: clamp(16px, 2vw, 22px);
    font-style: normal;
    font-weight: 400;
    line-height: 1.4;
    padding: 14px 16px 0;
    z-index: 1;
  }

  .content-container {
    width: 90%;
    max-width: 1100px;
    margin: 0 auto;
  }

  .header3-text {
    color: var(--color-primary);
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    padding-top: 50px;
  }

  @media (max-width: 640px) {
    padding-top: 8px;
    .header3-text {
      font-size: 21px;
      padding-top: 36px;
    }
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
    <PageWrapper>
      <AppHeader activePage="home" />
      <ContentWrapper>
        <Home>
          <div className="header-text">
            ระบบเฝ้าระวังและคาดการณ์ระดับน้ำอัตโนมัติ <br />
            แจ้งเตือนก่อนถึงระดับวิกฤต
          </div>
          <div className="header2-text">รองรับการดูย้อนหลัง ส่งออกรายงาน และแสดงผลบนแผนที่</div>
          <ProvinceBoxPage onProvinceSelect={handleProvinceSelect} />
          <div className="content-container">
            <div className="header3-text">แผนที่ตำแหน่งเครื่องวัด</div>
          </div>
          <StationMapPage ref={mapRef} selectedProvince={selectedProvince} />
          <div className="content-container">
            <div className="header3-text">ฟีเจอร์หลักของระบบ</div>
          </div>
          <WhiteBoxPage />
        </Home>
      </ContentWrapper>
      <AppFooter />
    </PageWrapper>
  );
}
