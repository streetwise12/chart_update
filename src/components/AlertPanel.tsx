import React from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import type { Alert } from '../types/fleet';

interface AlertPanelProps {
  alerts: Alert[];
  onMarkAsRead: (alertId: string) => void;
}

export function AlertPanel({ alerts, onMarkAsRead }: AlertPanelProps) {
  const sortedAlerts = [...alerts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-[calc(100vh-2rem)] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5" />
        Alerts
        {alerts.length > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {alerts.filter(a => !a.isRead).length}
          </span>
        )}
      </h2>
      <div className="space-y-3">
        {sortedAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border ${
              alert.isRead ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {alert.type.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
              {!alert.isRead && (
                <button
                  onClick={() => onMarkAsRead(alert.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
        {alerts.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No alerts to display
          </div>
        )}
      </div>
    </div>
  );
}