"use client";

import styled from "styled-components";

const Home = styled.div`
  flex: 1;
  width: 100%;
  background-color: #e1ebf7;

  .header-text{
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #01205F;
    text-align: center;
    font-size: 48px;
    font-style: normal;
    font-weight: 400;
    padding-top: 170px;
  }
  .header2-text{
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #3273BA;
    text-align: center;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    padding-top: 24px;
    z-index: 1;
  }

  .wh-box{
    width: 730px;
    height: 254px;
    border-radius: 26px;
    background: #FFFCF7;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 40px auto 0; /* center horizontally with some spacing from text */
  }
  .box-text{
    color: #01205F;
    text-align: center;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
  }
  .mini-text-box{
    display: flex;
    width: 450px;
    height: 70px;
    border-radius: 26px;
    border: 1px solid #000;
    background: #FFFCF7;
  }
  .mini-text{
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #898989;
    text-align: center;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    padding-right: 180px;
  }
  .drop-icon{
    justify-content: center;
  }
  .button{
    width: 160px;
    height: 70px;
    border-radius: 26px;
    background: #01205F;
    display: flex;
  }
  .button-text{
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #FFFCF7;
    text-align: center;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
  }
`;
export default function HomePage() {
  return (
    <Home>
        <div className="header-text">ระบบเฝ้าระวังและคาดการณ์ระดับน้ำอัตโนมัติ <br/>แจ้งเตือนก่อนถึงระดับวิกฤต</div>
        <div className="header2-text">รองรับการดูย้อนหลัง ส่งออกรายงาน และแสดงผลบนแผนที่</div>
        <div className="wh-box">
            <div className="box-text">เลือกจังหวัดเพื่อดูสถานีวัดระดับน้ำ</div>
            <div className="mini-text-box">
                <span className="mini-text">เลือกจังหวัด....</span>
                <img className="drop-icon" src="drop-down.svg" alt="drop down" />
                <span className="button">
                    <div className="button-text">ดูสถานี</div>
                </span>
            </div>
        </div>
    </Home>
  );
}
