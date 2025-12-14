"use client";

import styled from "styled-components";

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
  }
  .text-eng{
    color: #3273BA;
    font-size: 22px;
    font-weight: 500;
  }

  .right-text{
    color: #898989;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    cursor: pointer;
  }
  .content-right{
    display: flex;
    align-items: center;
    gap: 108px;
    padding-left: 600px;
  }
`;

export default function AppHeader() {
  return (
    <Header>
      <div className="content">
        <img className="pic-icon" src="icon.png" alt="icon" />
        <div className="text-box">
          <span className="text-th">ระบบเฝ้าระวังระดับน้ำ</span>
          <span className="text-eng">Water Level Monitoring System</span>
        </div>
      </div>
      <div className="content-right">
        <span className="right-text">Home</span>
        <span className="right-text">Dashboard</span>
      </div>
    </Header>
  );
}
