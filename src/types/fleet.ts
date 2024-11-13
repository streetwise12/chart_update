export interface TruckData {
  id: string;
  name: string;
  fuelLevel: number;
  fuelHistory: FuelRecord[];
  location: {
    lat: number;
    lng: number;
  };
  status: 'moving' | 'stationary';
  lastUpdate: string;
  alerts: Alert[];
}

export interface Alert {
  id: string;
  truckId: string;
  type: 'fuel_theft' | 'suspicious_activity' | 'low_fuel' | 'rapid_fuel_loss';
  severity: 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface FuelRecord {
  timestamp: string;
  level: number;
  rate?: number;
}