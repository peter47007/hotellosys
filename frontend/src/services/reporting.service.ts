// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\services\reportingService.ts

import { 
  Room, 
  Reservation, 
  Invoice, 
  InvoiceStatus, 
  OccupancyReport, 
  RevenueReport, 
  OperationalMetrics,
  ForecastData
} from '../types.js';

export const calculateOccupancyReport = (rooms: Room[], reservations: Reservation[], date: Date): OccupancyReport => {
  const total = rooms.length;
  const occupied = reservations.filter(r => 
    r.checkInDate <= date && r.checkOutDate > date
  ).length;
  
  const maintenance = rooms.filter(r => r.status === 'Maintenance').length;
  const reserved = reservations.filter(r => r.checkInDate > date).length; // Simplified
  const available = total - occupied - maintenance;

  const totalRev = reservations.filter(r => r.checkInDate <= date && r.checkOutDate > date)
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  return {
    date,
    totalRooms: total,
    occupied,
    reserved,
    maintenance,
    available,
    occupancyRate: Math.round((occupied / total) * 100),
    revPAR: total > 0 ? totalRev / total : 0,
    adr: occupied > 0 ? totalRev / occupied : 0
  };
};

export const generateRevenueForecast = (history: number[], days: number): ForecastData[] => {
  const forecast: ForecastData[] = [];
  const lastVal = history[history.length - 1] || 5000;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // Simple exponential smoothing simulation
    const trend = 1 + (Math.random() * 0.05);
    const seasonality = 1 + (Math.sin(i / 7) * 0.1); // Weekly cycles
    
    forecast.push({
      date: date.toLocaleDateString(),
      forecast: Math.round(lastVal * trend * seasonality),
      confidence: 95 - (i * 0.5) // Less certain further out
    });
  }
  return forecast;
};

export const getOperationalMetrics = (): OperationalMetrics => ({
  housekeepingEfficiency: 88,
  avgCleaningTime: 24,
  checkInSpeed: 4.5,
  guestSatisfaction: 4.8,
  staffPresence: 12
});
