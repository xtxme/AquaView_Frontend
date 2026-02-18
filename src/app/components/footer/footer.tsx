"use client";

import styled from "styled-components";

const Footer = styled.footer`
  width: 100%;
  height: 112px;
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
    height: 96px;
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
