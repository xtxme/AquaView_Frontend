"use client";

import styled from "styled-components";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

const Header = styled.header`
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  height: 80px;
  display: flex;
  padding-left: 68px;

  .content{
    padding: 22px 32px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .pic-icon{
    height: 76px;
    object-fit: contain;
  }
  .text-box{
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }
  .text-th{
    color: #01205F;
    font-size: 24px;
    font-weight: 500;
    font-family: 'Kanit', sans-serif;
  }
  .text-eng{
    color: #3273BA;
    font-size: 22px;
    font-weight: 500;
    font-family: 'Kanit', sans-serif;
  }

  .content-right{
    display: flex;
    align-items: flex-start;
    gap: 108px;
    padding-left: 600px;
    padding-top: 16px;
  }

  .nav-item{
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .nav-text{
    color: #898989;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    transition: color 0.3s ease;
    font-family: 'Kanit', sans-serif;
  }

  .nav-item:hover .nav-text{
    color: #3273BA;
  }

  .nav-item.active .nav-text{
    color: #01205F;
    font-weight: 600;
  }

  .triangle-icon{
    margin-bottom: 4px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .nav-item.active .triangle-icon{
    opacity: 1;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

interface AppHeaderProps {
  activePage?: "home" | "dashboard";
}

export default function AppHeader({ activePage = "home" }: AppHeaderProps) {
  return (
    <Header>
      <div className="content">
        <img className="pic-icon" src="/icon.png" alt="icon" />
        <div className="text-box">
          <span className="text-th">ระบบเฝ้าระวังระดับน้ำ</span>
          <span className="text-eng">Water Level Monitoring System</span>
        </div>
      </div>
      <div className="content-right">
        <div className={`nav-item ${activePage === "home" ? "active" : ""}`}>
          <img className="triangle-icon" src="/triangle-down.svg" alt="" />
          <span className="nav-text">Home</span>
        </div>
        <StyledLink href="/dashboard">
          <div className={`nav-item ${activePage === "dashboard" ? "active" : ""}`}>
            <img className="triangle-icon" src="/triangle-down.svg" alt="" />
            <span className="nav-text">Dashboard</span>
          </div>
        </StyledLink>
      </div>
    </Header>
  );
}
