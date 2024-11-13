import React from 'react';
import { Info, MapPin, Fuel, Clock } from 'lucide-react';
import { FuelChart } from './FuelChart';
import type { TruckData } from '../types/fleet';

interface TruckDetailsProps {
  truck: TruckData;
}

export function TruckDetails({ truck }: TruckDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Info className="w-6 h-6" />
          {truck.name}
        </h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          truck.status === 'moving'
            ? 'bg-green-100 text-green-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          {truck.status.charAt(0).toUpperCase() + truck.status.slice(1)}
        </span>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <Fuel className="w-4 h-4" />
                Current Fuel Level
              </h3>
              <div className="mt-2">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
                    <div
                      style={{ width: `${truck.fuelLevel}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        truck.fuelLevel < 20
                          ? 'bg-red-500'
                          : truck.fuelLevel < 50
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    />
                  </div>
                  <span className="text-sm font-semibold mt-1 inline-block">
                    {truck.fuelLevel.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Location
              </h3>
              <p className="mt-1">
                Lat: {truck.location.lat.toFixed(6)}
                <br />
                Lng: {truck.location.lng.toFixed(6)}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last Update
              </h3>
              <p className="mt-1 text-sm">
                {new Date(truck.lastUpdate).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Alerts</h3>
            <div className="space-y-2">
              {truck.alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-2 rounded text-sm ${
                    alert.severity === 'high'
                      ? 'bg-red-100 text-red-800'
                      : alert.severity === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {alert.message}
                </div>
              ))}
              {truck.alerts.length === 0 && (
                <p className="text-sm text-gray-500">No recent alerts</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Fuel Level History</h3>
          <FuelChart 
            fuelHistory={truck.fuelHistory} 
            truckName={truck.name}
          />
        </div>
      </div>
    </div>
  );
}