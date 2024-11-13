import React, { useState, useEffect } from 'react';
import { TruckList } from './components/TruckList';
import { AlertPanel } from './components/AlertPanel';
import { TruckDetails } from './components/TruckDetails';
import { TruckMap } from './components/TruckMap';
import { detectFuelTheft, calculateFuelConsumption, calculateFuelRate } from './utils/fuelMonitoring';
import { updateTruckPosition } from './utils/movement';
import { FUEL_CONSTANTS } from './utils/constants';
import type { TruckData, Alert, FuelRecord } from './types/fleet';

const initialFuelHistory: FuelRecord[] = Array.from({ length: 12 }, (_, i) => ({
  timestamp: new Date(Date.now() - (11 - i) * 5 * 60000).toISOString(),
  level: 85 - i * 0.5,
  rate: -0.1
}));

const mockTrucks: TruckData[] = [
  {
    id: '1',
    name: 'Truck Atlas',
    fuelLevel: 85,
    fuelHistory: [...initialFuelHistory],
    location: { lat: 30.4278, lng: -9.5981 },
    status: 'moving',
    lastUpdate: new Date().toISOString(),
    alerts: [],
  },
  {
    id: '2',
    name: 'Truck Rif',
    fuelLevel: 75,
    fuelHistory: initialFuelHistory.map(record => ({
      ...record,
      level: record.level - 10,
    })),
    location: { lat: 35.7595, lng: -5.8340 },
    status: 'moving',
    lastUpdate: new Date().toISOString(),
    alerts: [],
  },
  {
    id: '3',
    name: 'Truck Sahara',
    fuelLevel: 65,
    fuelHistory: initialFuelHistory.map(record => ({
      ...record,
      level: record.level - 20,
    })),
    location: { lat: 34.0209, lng: -6.8416 },
    status: 'moving',
    lastUpdate: new Date().toISOString(),
    alerts: [],
  },
];

function App() {
  const [trucks, setTrucks] = useState<TruckData[]>(mockTrucks);
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrucks(prevTrucks => 
        prevTrucks.map(truck => {
          const now = new Date();
          let newFuelLevel = truck.fuelLevel;
          let newLocation = truck.location;
          let newStatus = truck.status;
          
          if (truck.status === 'moving') {
            if (truck.fuelLevel > 0) {
              newLocation = updateTruckPosition(truck.id, truck.location);
              newFuelLevel = calculateFuelConsumption(truck.fuelLevel, true);
              
              // Simulate theft for Truck Rif
              if (truck.id === '2' && Math.random() < FUEL_CONSTANTS.THEFT_SIMULATION_CHANCE) {
                newFuelLevel = Math.max(0, newFuelLevel - FUEL_CONSTANTS.THEFT_AMOUNT);
              }

              if (newFuelLevel === 0) {
                newStatus = 'stationary';
                const newAlert: Alert = {
                  id: Date.now().toString(),
                  truckId: truck.id,
                  type: 'low_fuel',
                  severity: 'high',
                  message: `${truck.name} has stopped: Out of fuel`,
                  timestamp: now.toISOString(),
                  isRead: false,
                };
                setAlerts(prev => [newAlert, ...prev]);
              }
            }
          }

          const newFuelHistory = [
            ...truck.fuelHistory.slice(-11),
            {
              timestamp: now.toISOString(),
              level: newFuelLevel,
              rate: calculateFuelRate(
                newFuelLevel,
                truck.fuelHistory[truck.fuelHistory.length - 1].level,
                FUEL_CONSTANTS.UPDATE_INTERVAL
              )
            },
          ];

          const theftDetection = detectFuelTheft(newFuelHistory, truck.status === 'moving');
          if (theftDetection.isTheftSuspected) {
            const newAlert: Alert = {
              id: Date.now().toString(),
              truckId: truck.id,
              type: 'fuel_theft',
              severity: theftDetection.confidence > 80 ? 'high' : 'medium',
              message: theftDetection.reason || 'Suspicious fuel activity detected',
              timestamp: now.toISOString(),
              isRead: false,
            };
            setAlerts(prev => [newAlert, ...prev]);
          }

          if (newFuelLevel < FUEL_CONSTANTS.LOW_FUEL_THRESHOLD && 
              truck.fuelLevel >= FUEL_CONSTANTS.LOW_FUEL_THRESHOLD) {
            const newAlert: Alert = {
              id: Date.now().toString(),
              truckId: truck.id,
              type: 'low_fuel',
              severity: 'high',
              message: `${truck.name} is running low on fuel (${newFuelLevel.toFixed(1)}%)`,
              timestamp: now.toISOString(),
              isRead: false,
            };
            setAlerts(prev => [newAlert, ...prev]);
          }

          return {
            ...truck,
            status: newStatus,
            location: newLocation,
            fuelLevel: Number(newFuelLevel.toFixed(1)),
            fuelHistory: newFuelHistory,
            lastUpdate: now.toISOString(),
            alerts: alerts.filter(a => a.truckId === truck.id),
          };
        })
      );
    }, FUEL_CONSTANTS.UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [alerts]);

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const selectedTruck = trucks.find(t => t.id === selectedTruckId);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <TruckList
            trucks={trucks}
            onSelectTruck={(id) => setSelectedTruckId(id)}
            selectedTruckId={selectedTruckId}
          />
        </div>
        
        <div className="col-span-6">
          <div className="space-y-4">
            <TruckMap 
              trucks={trucks}
              selectedTruckId={selectedTruckId}
            />
            {selectedTruck ? (
              <TruckDetails truck={selectedTruck} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <h2 className="text-xl text-gray-600">
                  Select a truck to view details
                </h2>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-3">
          <AlertPanel
            alerts={alerts}
            onMarkAsRead={handleMarkAsRead}
          />
        </div>
      </div>
    </div>
  );
}

export default App;