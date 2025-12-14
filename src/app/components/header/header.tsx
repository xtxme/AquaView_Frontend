"use client";

import styled from "styled-components";

const Header = styled.header`
  width: 100%;
  background-color: #ffffff;
  height: 82px;
  display: flex;

  .box-warp{

  }
  .pic-icon{
    height: 76px;
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
      <span className="text-eng">Water Level Monitoring System</span>
    </Header>
  );
}
