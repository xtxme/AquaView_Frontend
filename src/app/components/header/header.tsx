"use client";

import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "leaflet/dist/leaflet.css";

const Header = styled.header`
  width: 100%;
  background-color: var(--color-surface);
  box-shadow: var(--shadow-soft);
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px 0 68px;

  .content{
    padding: 0;
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
    color: var(--color-primary);
    font-size: 24px;
    font-weight: 500;
    font-family: 'Kanit', sans-serif;
  }
  .text-eng{
    color: var(--color-secondary);
    font-size: 22px;
    font-weight: 500;
    font-family: 'Kanit', sans-serif;
  }

  .content-right{
    display: flex;
    align-items: flex-start;
    gap: 36px;
    margin-left: auto;
    padding-right: 56px;
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
    color: var(--color-text-subtle);
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    transition: color 0.3s ease;
    font-family: 'Kanit', sans-serif;
  }

  .nav-item:hover .nav-text{
    color: var(--color-secondary);
  }

  .nav-item.active .nav-text{
    color: var(--color-primary);
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
  const pathname = usePathname();
  const resolvedActivePage =
    pathname?.startsWith("/dashboard") ? "dashboard" : pathname === "/" ? "home" : activePage;

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
        <StyledLink href="/" aria-current={resolvedActivePage === "home" ? "page" : undefined}>
          <div className={`nav-item ${resolvedActivePage === "home" ? "active" : ""}`}>
            <img className="triangle-icon" src="/triangle-down.svg" alt="" />
            <span className="nav-text">Home</span>
          </div>
        </StyledLink>
        <StyledLink href="/dashboard" aria-current={resolvedActivePage === "dashboard" ? "page" : undefined}>
          <div className={`nav-item ${resolvedActivePage === "dashboard" ? "active" : ""}`}>
            <img className="triangle-icon" src="/triangle-down.svg" alt="" />
            <span className="nav-text">Dashboard</span>
          </div>
        </StyledLink>
      </div>
    </Header>
  );
}
