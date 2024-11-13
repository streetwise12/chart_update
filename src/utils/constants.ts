// Fuel consumption constants
export const FUEL_CONSTANTS = {
  NORMAL_CONSUMPTION_MIN: 0.5,  // Minimum consumption rate per update
  NORMAL_CONSUMPTION_MAX: 0.8,  // Maximum consumption rate per update
  THEFT_SIMULATION_CHANCE: 0.05, // 5% chance of simulated theft
  THEFT_AMOUNT: 12,            // Amount of fuel lost in theft
  LOW_FUEL_THRESHOLD: 20,      // Threshold for low fuel warning
  UPDATE_INTERVAL: 5000        // Update interval in milliseconds
};

// Map constants
export const MAP_CONSTANTS = {
  DEFAULT_CENTER: {
    lat: 32.8769,
    lng: -6.8984
  },
  DEFAULT_ZOOM: 6,
  SELECTED_ZOOM: 12
};