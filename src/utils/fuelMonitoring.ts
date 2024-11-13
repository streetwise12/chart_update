import { FUEL_CONSTANTS } from './constants';
import type { FuelRecord } from '../types/fleet';

const SUDDEN_DROP_THRESHOLD = 10.0;
const DETECTION_WINDOW_MINUTES = 15;

export function calculateFuelConsumption(currentLevel: number, isMoving: boolean): number {
  if (!isMoving) return currentLevel;
  
  // Calculate consumption rate per update interval
  const consumption = FUEL_CONSTANTS.NORMAL_CONSUMPTION_MIN + 
    Math.random() * (FUEL_CONSTANTS.NORMAL_CONSUMPTION_MAX - FUEL_CONSTANTS.NORMAL_CONSUMPTION_MIN);
  
  // Ensure fuel level doesn't go below 0
  return Math.max(0, Number((currentLevel - consumption).toFixed(1)));
}

export function calculateFuelRate(currentLevel: number, previousLevel: number, intervalMs: number): number {
  // Convert rate to per minute
  return ((currentLevel - previousLevel) / intervalMs) * 60000;
}

export function detectFuelTheft(
  fuelHistory: FuelRecord[],
  isMoving: boolean
): {
  isTheftSuspected: boolean;
  confidence: number;
  reason?: string;
} {
  if (fuelHistory.length < 2) {
    return { isTheftSuspected: false, confidence: 0 };
  }

  const now = new Date(fuelHistory[fuelHistory.length - 1].timestamp);
  const windowStart = new Date(now.getTime() - DETECTION_WINDOW_MINUTES * 60000);
  
  const recentReadings = fuelHistory.filter(record => 
    new Date(record.timestamp) >= windowStart
  );

  if (recentReadings.length < 2) {
    return { isTheftSuspected: false, confidence: 0 };
  }

  const currentLevel = recentReadings[recentReadings.length - 1].level;
  const earliestLevel = recentReadings[0].level;
  const totalDrop = earliestLevel - currentLevel;
  
  const timeElapsed = (now.getTime() - new Date(recentReadings[0].timestamp).getTime()) / 60000;
  const dropRate = totalDrop / timeElapsed;
  const expectedDrop = isMoving ? 
    (FUEL_CONSTANTS.NORMAL_CONSUMPTION_MAX * timeElapsed) : 0;
  
  if (totalDrop >= SUDDEN_DROP_THRESHOLD && dropRate > FUEL_CONSTANTS.NORMAL_CONSUMPTION_MAX * 2) {
    const excessDrop = totalDrop - expectedDrop;
    const confidence = Math.min((excessDrop / SUDDEN_DROP_THRESHOLD) * 100, 100);
    
    return {
      isTheftSuspected: true,
      confidence,
      reason: `Sudden ${totalDrop.toFixed(1)}% fuel drop in ${timeElapsed.toFixed(0)} minutes`,
    };
  }

  return { isTheftSuspected: false, confidence: 0 };
}