"use client";

import AppHeader from "./components/header/header";
import AppFooter from "./components/footer/footer";
import HomePage from "./(protected)/home/page";
import styled from "styled-components";

const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 0;
`;

export default function Home() {
  return (
    <HomeWrapper>
      <AppHeader />
      <HomePage />
      <AppFooter />
    </HomeWrapper>
  );
}
