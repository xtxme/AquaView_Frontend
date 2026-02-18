"use client";

import styled from "styled-components";

const Footer = styled.footer`
  width: 100%;
  min-height: 80px;
  padding: 2px 0;
  box-sizing: border-box;
  background-color: var(--color-surface);
  box-shadow: var(--shadow-soft);
  display: flex;
  align-items: center;
  z-index: 10;
  margin-top: auto;

  .content {
    padding-left: 388px;
  }
  .text {
    color: var(--color-primary);
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    font-family: 'Kanit', sans-serif;
  }

  @media (max-width: 900px) {
    min-height: 64px;
    padding: 2px 0;
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
