export type WaterDataPoint = {
  time: string;
  p1: number;
  p2: number;
};

export const MOCK_WATER_LEVEL_DATA: WaterDataPoint[] = [
  { time: "1:00", p1: 24, p2: 30 },
  { time: "2:00", p1: 26, p2: 31 },
  { time: "4:00", p1: 9,  p2: 26 },
  { time: "5:30", p1: 80, p2: 45 },
  { time: "7:00", p1: 42, p2: 21 },
  { time: "8:30", p1: 95, p2: 62 },
  { time: "10:00",p1: 66, p2: 56 },
  { time: "12:00",p1: 92, p2: 102 },
];

export const WATER_LEVEL_MAX_VALUE = 120;
