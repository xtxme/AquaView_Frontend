export type WaterDataPoint = {
  time: string;
  timestamp: number;
  p1: number;
  p2: number;
  isPrediction?: boolean;
};

// Historical data (18 hours): 0:00 - 17:00
const MOCK_HISTORICAL_DATA: WaterDataPoint[] = [
  { time: "0:00", timestamp: 0, p1: 24, p2: 30 },
  { time: "1:00", timestamp: 1, p1: 26, p2: 31 },
  { time: "2:00", timestamp: 2, p1: 18, p2: 28 },
  { time: "3:00", timestamp: 3, p1: 9, p2: 26 },
  { time: "4:00", timestamp: 4, p1: 42, p2: 40 },
  { time: "5:00", timestamp: 5, p1: 80, p2: 45 },
  { time: "6:00", timestamp: 6, p1: 42, p2: 21 },
  { time: "7:00", timestamp: 7, p1: 68, p2: 42 },
  { time: "8:00", timestamp: 8, p1: 95, p2: 62 },
  { time: "9:00", timestamp: 9, p1: 66, p2: 56 },
  { time: "10:00", timestamp: 10, p1: 88, p2: 100 },
  { time: "11:00", timestamp: 11, p1: 92, p2: 102 },
  { time: "12:00", timestamp: 12, p1: 85, p2: 98 },
  { time: "13:00", timestamp: 13, p1: 70, p2: 85 },
  { time: "14:00", timestamp: 14, p1: 55, p2: 70 },
  { time: "15:00", timestamp: 15, p1: 40, p2: 55 },
  { time: "16:00", timestamp: 16, p1: 28, p2: 42 },
  { time: "17:00", timestamp: 17, p1: 20, p2: 35 },
];

// Prediction data (6 hours): 18:00 - 23:00
const MOCK_PREDICTION_DATA: WaterDataPoint[] = [
  { time: "18:00", timestamp: 18, p1: 15, p2: 30, isPrediction: true },
  { time: "19:00", timestamp: 19, p1: 12, p2: 25, isPrediction: true },
  { time: "20:00", timestamp: 20, p1: 10, p2: 20, isPrediction: true },
  { time: "21:00", timestamp: 21, p1: 8, p2: 15, isPrediction: true },
  { time: "22:00", timestamp: 22, p1: 6, p2: 12, isPrediction: true },
  { time: "23:00", timestamp: 23, p1: 5, p2: 10, isPrediction: true },
];

// Combined data (24 hours total from 0:00 to 23:00) - Freeze to prevent hydration issues
export const MOCK_WATER_LEVEL_DATA = [
  ...MOCK_HISTORICAL_DATA,
  ...MOCK_PREDICTION_DATA
];

export const WATER_LEVEL_MAX_VALUE = 110;
