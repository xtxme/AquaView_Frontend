"use client";

import { forwardRef } from "react";
import styled from "styled-components";
import { LeafletStationMap } from "../dashboard/leaflet-station-map";
import { MOCK_STATIONS, MOCK_REACHES } from "./mock-data";

const StationMap = styled.div`
  width: 100%;
  max-width: 900px;
  height: 550px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(1, 32, 95, 0.1);
  margin: 32px auto 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 18px 22px;
  border-bottom:1px solid #e5e7eb;

  h2 {
    color: #01205F;
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 6px 0;
  }

  p {
    color: rgba(1, 32, 95, 0.7);
    font-size: 14px;
    margin: 0;
  }
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
  min-height: 0;
`;

interface StationMapPageProps {
  selectedProvince?: string
}

const StationMapForwardRef = forwardRef<HTMLDivElement, StationMapPageProps>(({ selectedProvince }, ref) => {
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
          onStationClick={(id) => (window.location.href = `/dashboard/station/${id}`)}
        />
      </MapContainer>
    </StationMap>
  );
});

StationMapForwardRef.displayName = "StationMapForwardRef";

export default StationMapForwardRef;
