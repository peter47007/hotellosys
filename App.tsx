
import React, { useState, useEffect } from 'react';
import { 
  AppConfig, Room, Employee, MenuItem, RoomStatus, ActivityLog, License, LicenseStatus, User, UserRole, Department, Supplier, 
  LoyaltyPoint, LeaveRecord, LeaveType, LeaveStatus, EmploymentStatus, RoomType, Customer, Reservation, ReservationStatus, 
  ReservationType, RestaurantTable, TableStatus, Order, OrderStatus, OrderItem, InventoryItem, 
  PurchaseOrder, PurchaseOrderStatus, StockAudit, Invoice, InvoiceStatus, Payment, PaymentMethod, Campaign, CampaignStatus, 
  SalesLead, LeadStatus, LoyaltyTier, HousekeepingTask, HousekeepingStatus, LoyaltyPointTransaction, CustomerSegment, 
  LoyaltyReward, RewardType, PointTransactionType, CommunicationLog, CustomerPreference, OccupancyReport, RevenueReport,
  SystemAuditLog, EventSeverity, DataSubjectRequest, DataSubjectRequestType, DataSubjectRequestStatus, ComplianceItem,
  MobileAppStats, PushNotification, MobileDevice, HotelProperty, GuestServiceRequest
} from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import RoomsView from './views/Rooms';
import InventoryView from './views/Inventory';
import EmployeesView from './views/Employees';
import ReservationsView from './views/Reservations';
import BillingView from './views/Billing';
import HousekeepingView from './views/Housekeeping';
import GuestPortal from './views/GuestPortal';
import StaffMobileHub from './views/StaffMobileHub';
import Settings from './views/Settings';
import RestaurantView from './views/Restaurant';
import MarketingView from './views/Marketing';
import ReportsView from './views/Reports';
import ManagerWeb from './views/ManagerWeb';
import MobileCommand from './views/MobileCommand';
import AuditVault from './views/AuditVault';
import GDPRManager from './views/GDPRManager';
import ComplianceCenter from './views/ComplianceCenter';
import SystemHealth from './views/SystemHealth';
import SupportView from './views/Support';
import AIButler from './components/AIButler';
import Login from './views/Login';
import SetupWizard from './views/SetupWizard';
import { createAuditEntry } from './services/auditService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [licenseFees, setLicenseFees] = useState({ base: 299, module: 49 });
  
  const [config, setConfig] = useState<AppConfig>({
    hotelName: 'Buyza Grand HQ',
    address: '101 Enterprise Ave, Tech City',
    taxRate: 10,
    currency: 'USD',
    setupComplete: true
  });

  const [properties] = useState<HotelProperty[]>([
    { id: 'h1', name: 'Buyza Grand HQ', location: 'Arusha', image: 'https://picsum.photos/seed/hq/200', color: 'bg-slate-900' },
    { id: 'h2', name: 'Buyza Beach Resort', location: 'Tanga', image: 'https://picsum.photos/seed/beach/200', color: 'bg-cyan-600' }
  ]);

  const [license, setLicense] = useState<License | null>({
    key: 'HOTELLO-TEST-2026-HOTELLO',
    status: LicenseStatus.VALID,
    modules: { rooms: true, restaurant: true, bar: true },
    expiresAt: '2030-01-01'
  });

  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // Master State Mock Data
  const [rooms, setRooms] = useState<Room[]>([
    { id: '1', number: '101', roomTypeId: 'rt1', status: RoomStatus.AVAILABLE, floor: 1, price: 120, hotelId: 'h1' },
    { id: '2', number: '102', roomTypeId: 'rt1', status: RoomStatus.OCCUPIED, floor: 1, price: 120, hotelId: 'h1' },
    { id: '3', number: '201', roomTypeId: 'rt2', status: RoomStatus.DIRTY, floor: 2, price: 250, hotelId: 'h1' },
    { id: '4', number: 'B10', roomTypeId: 'rt1', status: RoomStatus.AVAILABLE, floor: 1, price: 150, hotelId: 'h2' },
  ]);

  const handleLogin = (username: string, pass: string) => {
    const normalized = username.toLowerCase();
    
    // 1. PROVIDER ROOT (Hardened Security)
    if (normalized === 'buyza_root') {
      if (pass !== 'BUYZA-MASTER-2026') {
        alert("SECURITY ALERT: Invalid Master Key for Provider Root.");
        return;
      }
      setCurrentUser({ id: 'root-0', username: 'buyza_root', name: 'Buyza Root', role: 'Admin', hotelId: 'h1' });
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      return;
    }

    // 2. STANDARD ADMIN (Hardened Security)
    if (normalized === 'admin') {
      if (pass !== 'admin123') {
        alert("INVALID CREDENTIALS: Admin password 'admin123' required.");
        return;
      }
      if (!license || license.status !== LicenseStatus.VALID) {
        alert("LICENSE ERROR: This node is not activated. Contact buyza_root.");
        return;
      }
      setCurrentUser({ id: 'u-1', username: 'admin', name: 'Hotel Manager', role: 'Admin', hotelId: 'h1' });
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      return;
    }

    // 3. STAFF / CHEF
    if (normalized === 'staff' || normalized === 'chef') {
      setCurrentUser({ id: 'u-2', username, name: username === 'chef' ? 'Chef Gordon' : 'Michael Waiter', role: username === 'chef' ? 'Chef' : 'Staff', hotelId: 'h1' });
      setIsLoggedIn(true);
      setActiveTab('staff_mobile');
      return;
    }

    // 4. GUEST
    if (normalized === 'guest') {
      setCurrentUser({ id: 'u-3', username: 'guest', name: 'John Guest', role: 'Guest', hotelId: 'h1' });
      setIsLoggedIn(true);
      setActiveTab('guest');
      return;
    }

    alert("Unknown User Profile. Please use the testing hints on the login page.");
  };

  const renderActiveView = () => {
    if (!currentUser) return null;

    const filteredRooms = (currentUser.role === 'Admin' || currentUser.username === 'buyza_root')
      ? rooms : rooms.filter(r => r.hotelId === currentUser.hotelId);

    // DYNAMIC VIEW ROUTING
    switch (activeTab) {
      case 'dashboard': 
        return <Dashboard rooms={rooms} activities={activities} userRole={currentUser.role} properties={properties} isRoot={currentUser.username === 'buyza_root'} setActiveTab={setActiveTab} />;
      case 'rooms': 
        return <RoomsView rooms={filteredRooms} roomTypes={[]} setRooms={setRooms} onUpdateStatus={() => {}} />;
      case 'reservations': 
        return <ReservationsView reservations={[]} rooms={filteredRooms} roomTypes={[]} customers={[]} onAddReservation={() => {}} onUpdateStatus={() => {}} />;
      case 'housekeeping':
        return <HousekeepingView tasks={[]} rooms={filteredRooms} employees={[]} onUpdateTaskStatus={() => {}} onAssignStaff={() => {}} />;
      case 'reports':
        return <ReportsView />;
      case 'billing':
        return <BillingView invoices={[]} payments={[]} customers={[]} reservations={[]} onAddPayment={() => {}} onUpdateInvoice={() => {}} />;
      case 'marketing':
        return <MarketingView campaigns={[]} leads={[]} tiers={[]} customers={[]} segments={[]} rewards={[]} commLogs={[]} preferences={[]} />;
      case 'restaurant':
        return <RestaurantView tables={[]} orders={[]} menu={[]} onUpdateTable={() => {}} onUpdateOrder={() => {}} onUpdateItemStatus={() => {}} />;
      case 'inventory':
        return <InventoryView items={[]} suppliers={[]} purchaseOrders={[]} audits={[]} onUpdateStock={() => {}} onCreatePO={() => {}} />;
      case 'employees': 
        return <EmployeesView currentUserRole={currentUser.role} employees={[]} departments={[]} leaveRecords={[]} leaveTypes={[]} onHire={() => {}} onUpdateDepartment={() => {}} onDeleteDepartment={() => {}} onApproveLeave={() => {}} onTransfer={() => {}} onTerminate={() => {}} />;
      case 'manager_web':
        return <ManagerWeb />;
      case 'mobile_command':
        return <MobileCommand stats={{} as any} notifications={[]} devices={[]} onSendNotification={() => {}} />;
      case 'audit_vault':
        return <AuditVault logs={[]} />;
      case 'gdpr_manager':
        return <GDPRManager requests={[]} customers={[]} onUpdateStatus={() => {}} onAnonymize={() => {}} onExport={() => {}} />;
      case 'compliance':
        return <ComplianceCenter items={[]} onToggleCompliance={() => {}} />;
      case 'system_health':
        return <SystemHealth />;
      case 'support':
        return <SupportView />;
      case 'settings': 
        return <Settings config={config} license={license} user={currentUser} onUpdateConfig={(upd) => setConfig(p => ({...p, ...upd}))} fees={licenseFees} setFees={setLicenseFees} />;
      case 'staff_mobile': 
        return <StaffMobileHub user={currentUser} property={properties[0]} tables={[]} orders={[]} menu={[]} inventory={[]} onAddOrder={() => {}} onUpdateOrder={() => {}} onUpdateItemStatus={() => {}} onSettleOrder={() => {}} onLogout={() => setIsLoggedIn(false)} />;
      case 'guest': 
        return <GuestPortal customer={{id: 'c1', firstName: 'John', lastName: 'Doe', email: '', phone: '', loyaltyPoints: 1200, loyaltyTierId: 't1'}} tier={{} as any} invoices={[]} onPostRequest={() => {}} />;
      default: 
        return <Dashboard rooms={rooms} activities={activities} userRole={currentUser.role} properties={properties} isRoot={currentUser.username === 'buyza_root'} setActiveTab={setActiveTab} />;
    }
  };

  const showFrame = isLoggedIn && activeTab !== 'staff_mobile' && activeTab !== 'guest';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-inter text-slate-900">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          {showFrame && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} config={config} license={license} user={currentUser} />}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {showFrame && <Header activeTab={activeTab} hotelName={config.hotelName} />}
            <main className={`flex-1 overflow-y-auto custom-scrollbar ${showFrame ? 'p-4 lg:p-8' : ''}`}>
              <div className={showFrame ? "max-w-7xl mx-auto pb-20" : "h-full"}>{renderActiveView()}</div>
            </main>
          </div>
          {showFrame && <AIButler context={{ hotelName: config.hotelName, totalRooms: rooms.length, occupiedRooms: 12, staffCount: 15 }} />}
        </>
      )}
    </div>
  );
};

export default App;
