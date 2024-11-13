import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { FuelRecord } from '../types/fleet';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface FuelChartProps {
  fuelHistory: FuelRecord[];
  truckName: string;
}

export function FuelChart({ fuelHistory, truckName }: FuelChartProps) {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Fuel Level History - ${truckName}`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const record = fuelHistory[context.dataIndex];
            let label = `Fuel Level: ${record.level.toFixed(1)}%`;
            if (record.rate !== undefined) {
              const rateLabel = record.rate < 0 ? 'Consumption' : 'Change';
              label += `\n${rateLabel} Rate: ${Math.abs(record.rate).toFixed(2)}%/min`;
            }
            return label;
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 13
        },
        bodyFont: {
          size: 12
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
          callback: (value) => `${value}%`
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        title: {
          display: true,
          text: 'Fuel Level (%)',
          font: {
            size: 12,
            weight: 'normal'
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  const data = {
    labels: fuelHistory.map(record => 
      new Date(record.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    ),
    datasets: [
      {
        label: 'Fuel Level',
        data: fuelHistory.map(record => Number(record.level.toFixed(1))),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.2,
        fill: true
      }
    ]
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg" style={{ height: '300px' }}>
      <Line options={options} data={data} />
    </div>
  );
}