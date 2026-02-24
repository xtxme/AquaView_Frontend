'use client';

import React, { useMemo, useState } from 'react';
import { DashboardContainer } from '@/app/components/dashboard/dashboard-container';
import WaterLevelChart from '@/app/components/dashboard/water-level-chart';
import { StationBarChart } from '@/app/components/dashboard/station-bar-chart';
import { MOCK_READINGS, MOCK_STATIONS } from '@/lib/mock-data';

export default function DashboardPageContent() {
  const [query, setQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const provinceOptions = useMemo(
    () => Array.from(new Set(MOCK_STATIONS.map((station) => station.province))),
    []
  );

  const districtOptions = useMemo(() => {
    const candidates = selectedProvince
      ? MOCK_STATIONS.filter((station) => station.province === selectedProvince)
      : MOCK_STATIONS;
    return Array.from(new Set(candidates.map((station) => station.district)));
  }, [selectedProvince]);

  const filteredStations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return MOCK_STATIONS.filter((station) => {
      const matchesProvince = selectedProvince ? station.province === selectedProvince : true;
      const matchesDistrict = selectedDistrict ? station.district === selectedDistrict : true;
      const matchesQuery = normalized
        ? [station.station_id, station.name, station.province, station.district]
            .join(' ')
            .toLowerCase()
            .includes(normalized)
        : true;

      return matchesProvince && matchesDistrict && matchesQuery;
    });
  }, [query, selectedDistrict, selectedProvince]);

  const filteredStationIds = useMemo(
    () => filteredStations.map((station) => station.station_id),
    [filteredStations]
  );

  const chartData = useMemo(() => {
    if (filteredStationIds.length === 0) {
      return [];
    }

    const stationIdSet = new Set(filteredStationIds);
    const readings = MOCK_READINGS.filter((reading) => stationIdSet.has(reading.station_id));
    const timeline = Array.from(new Set(readings.map((reading) => reading.ts)))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-24);

    return timeline.map((timestamp, index) => {
      const sameTimeReadings = readings.filter((reading) => reading.ts === timestamp);
      const levels = sameTimeReadings.map((reading) => reading.water_level_m);
      const averageLevel = levels.length
        ? levels.reduce((sum, value) => sum + value, 0) / levels.length
        : 0;
      const peakLevel = levels.length ? Math.max(...levels) : 0;
      const minLevel = levels.length ? Math.min(...levels) : 0;

      return {
        time: new Date(timestamp).toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        timestamp: index,
        p1: Number(averageLevel.toFixed(3)),
        p2: Number(peakLevel.toFixed(3)),
        p3: Number(minLevel.toFixed(3)),
      };
    });
  }, [filteredStationIds]);

  const predictionStartIndex = useMemo(() => {
    if (chartData.length < 8) {
      return undefined;
    }

    // Reserve the latest 6 points as forecast to visualize prediction segment.
    return chartData.length - 6;
  }, [chartData.length]);

  const chartMaxValue = useMemo(() => {
    if (filteredStations.length === 0) return 5;
    const maxBankLevel = Math.max(...filteredStations.map((station) => station.bank_level_m));
    return maxBankLevel * 1.25;
  }, [filteredStations]);

  return (
    <DashboardContainer
      query={query}
      selectedProvince={selectedProvince}
      selectedDistrict={selectedDistrict}
      provinceOptions={provinceOptions}
      districtOptions={districtOptions}
      onQueryChange={setQuery}
      onProvinceChange={(value) => {
        setSelectedProvince(value);
        setSelectedDistrict('');
      }}
      onDistrictChange={setSelectedDistrict}
      onClearFilters={() => {
        setQuery('');
        setSelectedProvince('');
        setSelectedDistrict('');
      }}
    >
      <WaterLevelChart
        title="กราฟแนวโน้มระดับน้ำ (ค่าเฉลี่ย/ค่าสูงสุด/ค่าต่ำสุด ของสถานีที่เลือก)"
        data={chartData}
        maxValue={chartMaxValue}
        predictionStartIndex={predictionStartIndex}
      />

      <StationBarChart stationIds={filteredStationIds} />
    </DashboardContainer>
  );
}
