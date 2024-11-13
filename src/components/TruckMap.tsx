import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { generateTruckIcon } from '../utils/iconGenerator';
import { MAP_CONSTANTS } from '../utils/constants';
import type { TruckData } from '../types/fleet';

interface TruckMapProps {
  trucks: TruckData[];
  selectedTruckId: string | null;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem'
};

export function TruckMap({ trucks, selectedTruckId }: TruckMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  React.useEffect(() => {
    if (map && selectedTruckId) {
      const selectedTruck = trucks.find(t => t.id === selectedTruckId);
      if (selectedTruck) {
        map.panTo(selectedTruck.location);
        map.setZoom(MAP_CONSTANTS.SELECTED_ZOOM);
      }
    } else if (map) {
      map.panTo(MAP_CONSTANTS.DEFAULT_CENTER);
      map.setZoom(MAP_CONSTANTS.DEFAULT_ZOOM);
    }
  }, [map, selectedTruckId, trucks]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyBJC_66kFau67ewjxTfJ6yJ6xILpZcx3Mk">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={MAP_CONSTANTS.DEFAULT_ZOOM}
        center={MAP_CONSTANTS.DEFAULT_CENTER}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {map && trucks.map((truck) => {
          const isSelected = truck.id === selectedTruckId;
          const isMoving = truck.status === 'moving';

          return (
            <Marker
              key={truck.id}
              position={truck.location}
              title={`${truck.name} (${truck.status})\nFuel: ${truck.fuelLevel.toFixed(1)}%`}
              icon={{
                url: `data:image/svg+xml;base64,${generateTruckIcon(isMoving, isSelected)}`,
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 16),
              }}
            />
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
}