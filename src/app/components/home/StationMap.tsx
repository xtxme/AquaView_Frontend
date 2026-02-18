"use client";

import { forwardRef } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { LeafletStationMap } from "../dashboard/leaflet-station-map";
import { MOCK_STATIONS, MOCK_REACHES } from "./mock-data";

const StationMap = styled.div`
  width: 100%;
  max-width: min(900px, calc(100% - 32px));
  height: 550px;
  border-radius: 18px;
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
  margin: 32px auto 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: calc(100% - 20px);
    height: 500px;
  }

  @media (max-width: 480px) {
    height: 440px;
  }
`;

const Header = styled.div`
  padding: 18px 22px;
  border-bottom: 1px solid var(--color-border);

  h2 {
    color: var(--color-primary);
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 6px 0;
    font-family: "Kanit", sans-serif;
  }

  p {
    color: var(--color-text-muted);
    font-size: 14px;
    margin: 0;
    font-family: "Kanit", sans-serif;
  }
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
  min-height: 0;
`;

interface StationMapPageProps {
  selectedProvince?: string;
}

const StationMapForwardRef = forwardRef<HTMLDivElement, StationMapPageProps>(({ selectedProvince }, ref) => {
  const router = useRouter();

  return (
    <StationMap ref={ref}>
      <Header>
        <h2>แผนที่สถานีเครื่องวัด</h2>
      </Header>
      <MapContainer>
        <LeafletStationMap
          stations={MOCK_STATIONS}
          reaches={MOCK_REACHES}
          selectedProvince={selectedProvince}
          onStationClick={(id) => router.push(`/dashboard/station?id=${encodeURIComponent(id)}`)}
        />
      </MapContainer>
    </StationMap>
  );
});

StationMapForwardRef.displayName = "StationMapForwardRef";

export default StationMapForwardRef;
