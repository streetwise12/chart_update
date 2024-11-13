interface Coordinates {
  lat: number;
  lng: number;
}

// Moroccan cities coordinates
const CITIES = {
  AGADIR: { lat: 30.4278, lng: -9.5981 },
  TANGIER: { lat: 35.7595, lng: -5.8340 },
  MARRAKECH: { lat: 31.6295, lng: -7.9811 }, // Intermediate stop
  RABAT: { lat: 34.0209, lng: -6.8416 }, // Intermediate stop
};

const ROUTES = {
  NORTH: [CITIES.AGADIR, CITIES.MARRAKECH, CITIES.RABAT, CITIES.TANGIER],
  SOUTH: [CITIES.TANGIER, CITIES.RABAT, CITIES.MARRAKECH, CITIES.AGADIR],
};

interface TruckRoute {
  currentLeg: number;
  direction: 'NORTH' | 'SOUTH';
  progress: number;
}

const truckRoutes: Record<string, TruckRoute> = {
  '1': { currentLeg: 0, direction: 'NORTH', progress: 0 }, // Agadir to Tangier
  '2': { currentLeg: 0, direction: 'SOUTH', progress: 0 }, // Tangier to Agadir
  '3': { currentLeg: 2, direction: 'NORTH', progress: 0.5 }, // Mid-route
};

function interpolatePosition(start: Coordinates, end: Coordinates, progress: number): Coordinates {
  return {
    lat: start.lat + (end.lat - start.lat) * progress,
    lng: start.lng + (end.lng - start.lng) * progress,
  };
}

export function updateTruckPosition(
  truckId: string,
  currentPosition: Coordinates
): Coordinates {
  const route = truckRoutes[truckId];
  if (!route) return currentPosition;

  const path = ROUTES[route.direction];
  const start = path[route.currentLeg];
  const end = path[route.currentLeg + 1];

  // Update progress
  route.progress += 0.02; // Move 2% along the current leg each update

  // If we've reached the end of current leg
  if (route.progress >= 1) {
    route.currentLeg++;
    route.progress = 0;

    // If we've reached the end of the route, reverse direction
    if (route.currentLeg >= path.length - 1) {
      route.currentLeg = 0;
      route.direction = route.direction === 'NORTH' ? 'SOUTH' : 'NORTH';
    }
  }

  return interpolatePosition(start, end, route.progress);
}