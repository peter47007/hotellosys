// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\src\types.ts

// --- ENUMS ---

export enum RoomStatus {
  AVAILABLE = 'Available',
  OCCUPIED = 'Occupied',
  CLEANING = 'Cleaning',
  MAINTENANCE = 'Maintenance',
  DIRTY = 'Dirty',
  RESERVED = 'Reserved'
}

export enum LicenseStatus {
  VALID = 'Valid',
  EXPIRED = 'Expired',
  REVOKED = 'Revoked',
  TRIAL = 'Trial'
}

export enum ReservationStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CHECKED_IN = 'CheckedIn',
  CHECKED_OUT = 'CheckedOut',
  CANCELLED = 'Cancelled',
  NO_SHOW = 'NoShow'
}

export enum OrderStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'InProgress',
  READY = 'Ready',
  SERVED = 'Served',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

// --- TYPES ---

export type UserRole = 'Admin' | 'Manager' | 'Staff' | 'HotelOwner' | 'Guest' | 'Chef';

// --- INTERFACES ---

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  avatar?: string;
  customerId?: string;
  hotelId: string;
  hotel?: HotelProperty;
}

export interface HotelProperty {
  id: string;
  name: string;
  location: string;
  image: string;
  color: string;
}

export interface Room {
  id: string;
  number: string;
  roomTypeId: string;
  status: RoomStatus;
  floor: number;
  price: number; 
  hotelId: string;
}

export interface AppConfig {
  hotelName: string;
  address: string;
  taxRate: number;
  currency: string;
  setupComplete: boolean;
}

export interface License {
  key: string;
  status: LicenseStatus;
  modules: {
    rooms: boolean;
    restaurant: boolean;
    bar: boolean;
  };
  expiresAt: string;
}

export interface ActivityLog {
  id: string;
  message: string;
  timestamp: Date;
  type: 'booking' | 'inventory' | 'staff' | 'pos' | 'system';
  priority: 'low' | 'medium' | 'high';
  userId?: string;
}

// --- EXTENDED SYSTEM TYPES (From your Backend) ---

export interface Reservation {
  id: string;
  reservationNumber: string;
  customerId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  status: ReservationStatus;
  totalPrice: number;
  hotelId: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  departmentId: string;
  position: string;
  hireDate: Date;
  status: 'Active' | 'On Leave' | 'Suspended' | 'Terminated';
  email: string;
  hotelId: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  isAvailable: boolean;
}