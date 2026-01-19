"use client";

import styled from "styled-components";

const Footer = styled.footer`
  width: 100%;
  height: 80px;
  background-color: #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  z-index: 10;
  margin-top: auto;

  .content {
    padding-left: 388px;
  }
  .text {
    color: #01205f;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
  }
`;

export default function AppFooter() {
    return(
        <Footer>
            <div className="content">
                <div className="text">Copyright © 2025, ระบบเฝ้าระวังระดับน้ำ, All rights reserved.</div>
            </div>
        </Footer>
    );
}
