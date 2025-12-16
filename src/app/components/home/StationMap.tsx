"use client";

import styled from "styled-components";

const StationMap = styled.div`
  width: 1074px;
  height: 698px;
  border-radius: 26px;
  background: #ffffff;
  box-shadow: 0 12px 30px rgba(1, 32, 95, 0.1);
  margin: 48px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #3273ba;
  font-size: 20px;
  font-weight: 500;
  .inside-box{
    width: 1050px;
    height: 678px;
    background-color: red;
    border-radius: 26px;
  }
`;

export default function StationMapPage() {
  return (
    <StationMap>
      <div className="inside-box">อยากได้ map ให้อยู่ตรงนี้</div>
    </StationMap>
  );
}
