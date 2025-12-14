"use client";

<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
export default function AppHeader() {
  return (
    <>
      <header className="app-header">
        <img className="header-icon" src="icon.png" alt="AquaView logo" />
        <div className="header-title-block">
          <span className="header-title-th">ระบบเฝ้าระวังระดับน้ำ</span>
          <span className="header-title-en">Water Level Monitoring System</span>
        </div>
      </header>

      <style jsx>{`
        .app-header {
          width: 100%;
          background-color: #ffffff;
          padding: 18px 64px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 8px 20px rgba(1, 32, 95, 0.12);
          border-bottom: 3px solid #e4edf8;
        }

        .header-icon {
          height: 72px;
          width: auto;
        }

        .header-title-block {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .header-title-th {
          color: #01205f;
          font-size: 32px;
          font-weight: 600;
        }

        .header-title-en {
          color: #3273ba;
          font-size: 26px;
          font-weight: 500;
          margin-top: 4px;
        }
      `}</style>
    </>
=======
import styled from "styled-components";

const Header = styled.header`
  background-color: #ffffff;
  width: 100%;
  height: 82px;
  display: flex;
  align-items: center;
  justify-content: center;

  .pic-icon{
    height: 60px;
  }
  .text-th{
    width: 208px;
    height: 16px;
    color: #01205F;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
  }
  .text-eng{
    width: 310px;
    height: 16px;
    color: #3273BA;
    font-size: 22px;
    font-style: normal;
    font-weight: 500;
  }
`;

export default function AppHeader() {
  return (
    <Header>
      <img className="pic-icon" src="icon.png" alt="icon" />
      <span className="text-th">ระบบเฝ้าระวังระดับน้ำ</span>
      <div className="text-eng">Water Level Monitoring System</div>
    </Header>
>>>>>>> theirs
=======
import "./header.css";

export default function AppHeader() {
  return (
    <header className="app-header">
      <img className="header-icon" src="icon.png" alt="AquaView logo" />
      <div className="header-title-block">
        <span className="header-title-th">ระบบเฝ้าระวังระดับน้ำ</span>
        <span className="header-title-en">Water Level Monitoring System</span>
      </div>
    </header>
>>>>>>> theirs
=======
import styled from "styled-components";

const Header = styled.header`
  background-color: #ffffff;
  width: 100%;
  height: 82px;
  display: flex;
  align-items: center;
  justify-content: center;

  .pic-icon{
    height: 60px;
  }
  .text-th{
    width: 208px;
    height: 16px;
    color: #01205F;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
  }
  .text-eng{
    width: 310px;
    height: 16px;
    color: #3273BA;
    font-size: 22px;
    font-style: normal;
    font-weight: 500;
  }
`;

export default function AppHeader() {
  return (
    <Header>
      <img className="pic-icon" src="icon.png" alt="icon" />
      <span className="text-th">ระบบเฝ้าระวังระดับน้ำ</span>
      <div className="text-eng">Water Level Monitoring System</div>
    </Header>
>>>>>>> theirs
  );
}
