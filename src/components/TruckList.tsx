import React from 'react';
import { Truck, AlertTriangle, ChevronDown } from 'lucide-react';
import type { TruckData } from '../types/fleet';

interface TruckListProps {
  trucks: TruckData[];
  onSelectTruck: (truckId: string) => void;
  selectedTruckId: string | null;
}

export function TruckList({ trucks, onSelectTruck, selectedTruckId }: TruckListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5" />
        Fleet Overview
      </h2>
      
      <div className="relative">
        <select
          value={selectedTruckId || ''}
          onChange={(e) => onSelectTruck(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a truck</option>
          {trucks.map((truck) => (
            <option key={truck.id} value={truck.id}>
              {truck.name} {truck.alerts.length > 0 ? '⚠️' : ''}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
      </div>

      <div className="mt-6 space-y-4">
        {trucks.map((truck) => (
          <div
            key={truck.id}
            className={`p-4 rounded-lg border ${
              selectedTruckId === truck.id
                ? 'bg-blue-50 border-blue-500'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{truck.name}</h3>
              {truck.alerts.length > 0 && (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              )}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Fuel Level:</span>
                <span className={`font-medium ${
                  truck.fuelLevel < 20 ? 'text-red-500' : 'text-green-600'
                }`}>
                  {truck.fuelLevel.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Status:</span>
                <span className={`font-medium ${
                  truck.status === 'moving' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {truck.status.charAt(0).toUpperCase() + truck.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}