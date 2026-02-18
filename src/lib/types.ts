export interface Station {
    station_id: string;
    name: string;
    province: string;
    district: string;
    latitude: number;
    longitude: number;
    bank_level_m: number;
    sensor_height_m: number;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Reading {
    id: string;
    station_id: string;
    ts: string;
    ultrasonic_depth_m: number;
    water_level_m: number;
    battery_pct: number;
    raw_payload: string;
    created_at: string;
}

export interface Reach {
    id: string;
    upstream_station: string;
    downstream_station: string;
    distance_m: number;
    typical_travel_hr: number;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Threshold {
    id: string;
    station_id: string;
    yellow_threshold_m: number;
    red_threshold_m: number;
    created_at: string;
    updated_at: string;
}

export interface Alert {
    id: string;
    station_id: string;
    alert_type: string;
    severity: 'yellow' | 'red';
    message: string;
    water_level_m: number;
    triggered_at: string;
    resolved_at: string | null;
    is_active: boolean;
    created_at: string;
}

export type StationRiskStatus = 'normal' | 'warning' | 'critical';

export interface StationRiskModel {
    status: StationRiskStatus;
    statusLabel: string;
    riskMessage: string;
    recommendedAction: string;
    updatedAtLabel: string;
    percentOfBank: number;
    warningLevel: number;
    dangerLevel: number;
}
