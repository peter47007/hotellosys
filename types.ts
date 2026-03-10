
export enum RoomStatus {
  AVAILABLE = 'Available',
  OCCUPIED = 'Occupied',
  CLEANING = 'Cleaning',
  MAINTENANCE = 'Maintenance',
  DIRTY = 'Dirty',
  RESERVED = 'Reserved'
}

export type UserRole = 'Admin' | 'Manager' | 'Staff' | 'HotelOwner' | 'Guest' | 'Chef';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  avatar?: string;
  customerId?: string;
  hotelId: string;
}

export enum ReservationStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CHECKED_IN = 'CheckedIn',
  CHECKED_OUT = 'CheckedOut',
  CANCELLED = 'Cancelled',
  NO_SHOW = 'NoShow'
}

export enum ReservationType {
  WALK_IN = 'Walk-In',
  ONLINE = 'Online',
  PHONE = 'Phone',
  BUYZA_MOBILE = 'BuyzaMobile'
}

export interface Reservation {
  id: string;
  reservationNumber: string;
  customerId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  status: ReservationStatus;
  type: ReservationType;
  totalPrice: number;
  depositPaid: number;
  holdExpiresAt?: Date;
  numberOfGuests: number;
  notes?: string;
  hotelId: string;
}

export interface HotelProperty {
  id: string;
  name: string;
  location: string;
  image: string;
  color: string;
}

export interface MobileDevice {
  id: string;
  customerId: string;
  platform: 'iOS' | 'Android';
  model: string;
  lastActive: Date;
  pushToken: string;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  target: 'All' | 'CheckedIn' | 'VIP' | 'Individual';
  sentAt: Date;
  status: 'Sent' | 'Failed' | 'Scheduled';
  clicks: number;
}

export interface MobileAppStats {
  activeInstalls: number;
  iosPercentage: number;
  androidPercentage: number;
  revenueFromMobile: number;
  conversionRate: number;
}

export interface StaffNotification {
  id: string;
  title: string;
  message: string;
  type: 'OrderReady' | 'TableCall' | 'KitchenAlert';
  timestamp: Date;
  read: boolean;
  orderId?: string;
}

export enum HousekeepingStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed',
  INSPECTED = 'Inspected'
}

export interface HousekeepingTask {
  id: string;
  roomId: string;
  assignedStaffId?: string;
  status: HousekeepingStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  type: 'Regular' | 'DeepClean' | 'MaintenanceCheck';
  createdAt: Date;
  completedAt?: Date;
  notes?: string;
}

export interface RoomType {
  id: string;
  name: string;
  basePrice: number;
  maxOccupancy: number;
  description: string;
  amenities: string[];
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber?: string;
  loyaltyPoints: number;
  loyaltyTierId: string;
  avatar?: string;
  isAnonymized?: boolean;
}

export enum EventSeverity {
  INFO = 'Info',
  WARNING = 'Warning',
  ERROR = 'Error',
  CRITICAL = 'Critical'
}

export interface SystemAuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  employeeId?: string;
  ipAddress?: string;
  oldValues?: string;
  newValues?: string;
  timestamp: Date;
  severity: EventSeverity;
  isSuccess: boolean;
}

export enum DataSubjectRequestType {
  ACCESS = 'AccessRequest',
  DELETION = 'DeletionRequest',
  RECTIFICATION = 'RectificationRequest',
  PORTABILITY = 'PortabilityRequest'
}

export enum DataSubjectRequestStatus {
  RECEIVED = 'Received',
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed',
  DENIED = 'Denied'
}

export interface DataSubjectRequest {
  id: string;
  requestNumber: string;
  customerId: string;
  type: DataSubjectRequestType;
  status: DataSubjectRequestStatus;
  requestDate: Date;
  completionDate?: Date;
  description?: string;
}

export interface ComplianceItem {
  id: string;
  standard: 'PCI-DSS' | 'GDPR' | 'SOC2' | 'LocalTax';
  requirement: string;
  description: string;
  isCompliant: boolean;
  evidenceLink?: string;
  lastChecked: Date;
}

export enum PointTransactionType {
  EARNED = 'Earned',
  REDEEMED = 'Redeemed',
  EXPIRED = 'Expired',
  ADJUSTED = 'Adjusted',
  BONUS = 'Bonus'
}

export interface LoyaltyPointTransaction {
  id: string;
  customerId: string;
  type: PointTransactionType;
  amount: number;
  reference: string;
  date: Date;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  threshold: number;
  discountPercentage: number;
  perks: string[];
  color: string;
  pointsMultiplier: number;
}

export enum RewardType {
  DISCOUNT = 'Discount',
  FREE_STAY = 'FreeStay',
  UPGRADE = 'Upgrade',
  SERVICE = 'Service'
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  type: RewardType;
  isActive: boolean;
}

export interface CustomerPreference {
  customerId: string;
  preferredFloor?: number;
  preferredRoomType?: string;
  dietaryRestrictions?: string[];
  favoriteCuisine?: string;
  specialNeeds?: string;
  anniversaryDates?: { label: string; date: string }[];
}

export interface CommunicationLog {
  id: string;
  customerId: string;
  type: 'Email' | 'SMS' | 'Phone' | 'InPerson';
  subject: string;
  content: string;
  date: Date;
  staffId: string;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  criteria: string;
}

export interface OccupancyReport {
  date: Date;
  totalRooms: number;
  occupied: number;
  reserved: number;
  maintenance: number;
  available: number;
  occupancyRate: number;
  revPAR: number;
  adr: number;
}

export interface RevenueReport {
  period: string;
  roomRevenue: number;
  foodRevenue: number;
  beverageRevenue: number;
  serviceRevenue: number;
  totalRevenue: number;
  growth: number;
}

export interface OperationalMetrics {
  housekeepingEfficiency: number;
  avgCleaningTime: number;
  checkInSpeed: number;
  guestSatisfaction: number;
  staffPresence: number;
}

export interface ForecastData {
  date: string;
  actual?: number;
  forecast: number;
  confidence: number;
}

export interface GuestServiceRequest {
  id: string;
  customerId: string;
  type: 'Housekeeping' | 'RoomService' | 'Maintenance' | 'Concierge';
  description: string;
  status: 'Pending' | 'Accepted' | 'Completed' | 'Rejected';
  timestamp: Date;
}

export enum CampaignStatus {
  DRAFT = 'Draft',
  SCHEDULED = 'Scheduled',
  ACTIVE = 'Active',
  COMPLETED = 'Completed'
}

export interface Campaign {
  id: string;
  name: string;
  channel: 'Email' | 'SMS' | 'MobilePush';
  status: CampaignStatus;
  audienceSize: number;
  conversionRate: number;
  budget: number;
  roi: number;
  startDate: Date;
}

export enum LeadStatus {
  NEW = 'New',
  QUALIFIED = 'Qualified',
  PROPOSAL = 'Proposal',
  NEGOTIATION = 'Negotiation',
  WON = 'Won',
  LOST = 'Lost'
}

export interface SalesLead {
  id: string;
  contactName: string;
  companyName: string;
  status: LeadStatus;
  estimatedValue: number;
  probability: number;
  source: string;
  createdAt: Date;
}

export enum InvoiceStatus {
  DRAFT = 'Draft',
  ISSUED = 'Issued',
  PARTIALLY_PAID = 'PartiallyPaid',
  PAID = 'Paid',
  OVERDUE = 'Overdue',
  CANCELLED = 'Cancelled'
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  type: 'Room' | 'F&B' | 'Service' | 'Adjustment';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  reservationId?: string;
  customerId: string;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  notes?: string;
}

export enum PaymentMethod {
  CASH = 'Cash',
  CARD = 'CreditCard',
  TRANSFER = 'BankTransfer',
  CORPORATE = 'CorporateAccount'
}

export interface Payment {
  id: string;
  invoiceId: string;
  method: PaymentMethod;
  amount: number;
  reference: string;
  date: Date;
  processedBy: string;
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

export enum TableStatus {
  AVAILABLE = 'Available',
  OCCUPIED = 'Occupied',
  RESERVED = 'Reserved',
  MAINTENANCE = 'Maintenance'
}

export interface RestaurantTable {
  id: string;
  number: string;
  capacity: number;
  status: TableStatus;
  location: 'Dining Room' | 'Patio' | 'Bar' | 'Private' | 'Beach Front';
  hotelId: string;
}

export enum OrderStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'InProgress',
  READY = 'Ready',
  SERVED = 'Served',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  status: 'Pending' | 'Cooking' | 'Ready' | 'Served';
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableId?: string;
  roomId?: string;
  type: 'DineIn' | 'RoomService' | 'Takeout';
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
  hotelId: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  unit: string;
  minLevel: number;
  unitCost: number;
  category: string;
  supplierId?: string;
  lastRestocked?: Date;
}

export enum InventoryTransactionType {
  RESTOCK = 'Restock',
  SALE = 'Sale',
  WASTE = 'Waste',
  ADJUSTMENT = 'Adjustment',
  RETURN = 'Return'
}

export interface StockAudit {
  id: string;
  auditDate: Date;
  status: 'Pending' | 'In Progress' | 'Reconciled';
  conductedBy: string;
  totalVariance: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
}

export enum PurchaseOrderStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  CONFIRMED = 'Confirmed',
  PARTIALLY_RECEIVED = 'PartiallyReceived',
  RECEIVED = 'Received',
  CANCELLED = 'Cancelled'
}

export interface PurchaseOrderItem {
  itemId: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  subtotal: number;
  total: number;
  orderedBy: string;
  orderDate: Date;
  expectedDelivery?: Date;
}

export interface AppConfig {
  hotelName: string;
  address: string;
  taxRate: number;
  currency: string;
  setupComplete: boolean;
}

export interface ActivityLog {
  id: string;
  message: string;
  timestamp: Date;
  type: 'booking' | 'inventory' | 'staff' | 'pos' | 'system';
  priority: 'low' | 'medium' | 'high';
  userId?: string;
}

export enum LicenseStatus {
  VALID = 'Valid',
  EXPIRED = 'Expired',
  REVOKED = 'Revoked',
  TRIAL = 'Trial'
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

export enum EmploymentStatus {
  ACTIVE = 'Active',
  ON_LEAVE = 'On Leave',
  SUSPENDED = 'Suspended',
  TERMINATED = 'Terminated'
}

export interface Department {
  id: string;
  name: string;
  budget: number;
  isActive: boolean;
  createdAt: Date;
  location?: string;
  description?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  departmentId: string;
  position: string;
  hireDate: Date;
  salary: number;
  status: EmploymentStatus;
  email: string;
  phone: string;
  image: string;
  hotelId: string;
}

export enum LeaveStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled'
}

export interface LeaveRecord {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  days: number;
  status: LeaveStatus;
  remarks?: string;
}

export interface LeaveType {
  id: string;
  name: string;
  annualEntitlement: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  type: 'Food' | 'Drink';
  module: 'Restaurant' | 'Bar';
  isAvailable: boolean;
  prepTime: number;
}

export interface LoyaltyPoint {
  customerId: string;
  points: number;
  updatedAt: Date;
}
