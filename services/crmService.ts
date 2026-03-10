
import { Customer, Reservation, Invoice, InvoiceStatus } from '../types';

export const calculateLTV = (customerId: string, reservations: Reservation[], invoices: Invoice[]) => {
  const customerInvoices = invoices.filter(inv => inv.customerId === customerId && inv.status === InvoiceStatus.PAID);
  const totalSpent = customerInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  
  const customerReservations = reservations.filter(res => res.customerId === customerId);
  const totalNights = customerReservations.reduce((acc, res) => {
    const diff = res.checkOutDate.getTime() - res.checkInDate.getTime();
    return acc + Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, 0);

  const avgNightValue = totalNights > 0 ? totalSpent / totalNights : 0;
  
  // Predictive LTV: Actual Spent + (Average Night Value * Predicted 10 future nights)
  return totalSpent + (avgNightValue * 10);
};

export const checkChurnRisk = (customer: Customer, lastReservation?: Reservation) => {
  if (!lastReservation) return 'High'; // Never stayed or long time ago
  
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  if (lastReservation.checkOutDate < sixMonthsAgo) return 'Critical';
  if (lastReservation.checkOutDate < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) return 'Medium';
  
  return 'Low';
};
