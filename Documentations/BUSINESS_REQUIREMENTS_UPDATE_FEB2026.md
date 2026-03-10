# HotelloSys: Business Requirements Update - February 2026

**Document Date**: February 13, 2026  
**Status**: ✅ Integrated into all documentation  
**Impact**: 6 new major features added to system architecture

---

## Executive Summary

This document outlines 6 new business requirements added to HotelloSys hotel management system:

| # | Requirement | Phase | Priority |
|---|------------|-------|----------|
| 1 | **Modular System** - Purchase individual modules | Phase 1 | CRITICAL |
| 2 | **License Management** - One key per PC | Phase 1 | CRITICAL |
| 3 | **Department Management** - Hotel owners manage departments | Phase 2 | HIGH |
| 4 | **Mobile App** - Customers book via iOS/Android | Phase 3+ | HIGH |
| 5 | **Down-Payment System** - Room holds with timer | Phase 3 | HIGH |
| 6 | **Cross-Hotel Sync** - Unified customer & loyalty | Phase 3+ | MEDIUM |

---

## REQUIREMENT 1: MODULAR SYSTEM

### Business Need
Hotels have different needs:
- Small 50-room hotel: Only needs Rooms module
- Medium hotel: Needs Rooms + Restaurant
- Large resort: Needs all modules (Rooms, Restaurant, Bar)

Let customers pay only for what they use.

### Solution: 3 Purchasable Modules

```
┌─────────────────────────────────────────┐
│       CORE (Always Included)            │
│  • Authentication                       │
│  • Employees & Departments              │
│  • Billing & Payments                   │
│  • Reporting & Analytics                │
│  • Loyalty & CRM                         │
└─────────────────────────────────────────┘
       ↓              ↓              ↓
  ┌────────┐    ┌──────────┐    ┌─────┐
  │ ROOMS  │    │ RESTAURANT│    │ BAR │
  │ MODULE │    │ MODULE   │    │MOD. │
  │ $499/yr│    │ $399/yr  │    │$299 │
  └────────┘    └──────────┘    └─────┘
  
  • OPTIONAL  • OPTIONAL  • OPTIONAL
  • Can buy   • Can buy   • Can buy
    together    together    together
```

### Technical Implementation

**At Installation**:
```
☑ Room ReservationModule   ($499/year)
☐ Restaurant Module        ($399/year)  [UNCHECKED = DISABLED]
☐ Bar Operations Module    ($299/year)  [UNCHECKED = DISABLED]

[INSTALL]
```

**Configuration File** (appsettings.json):
```json
{
  "Modules": {
    "RoomManagement": { "Enabled": true },
    "RestaurantOperations": { "Enabled": false },
    "BarOperations": { "Enabled": false }
  }
}
```

**Code Implementation**:
```csharp
// Only register services for enabled modules
if (config["Modules:RoomManagement:Enabled"] == "true")
    services.AddScoped<IRoomService, RoomService>();

// Hide UI elements for disabled modules
<Button Visibility="{Binding IsRestaurantModuleEnabled, 
                            Converter={...}}"/>
```

### Benefits
✅ Customers pay only for modules they use  
✅ Easy upgrades (add module later)  
✅ Database clean (no unused tables)  
✅ UI clean (no unused buttons)  
✅ Revenue model flexible  

### Database Changes
- Add `ModuleConfiguration` table
- Add `ModuleActivations` table
- Update startup to skip module creation if disabled

### Phase Integration
- **Phase 1**: Implement feature flag system
- **Phase 2**: Add department management (works with all modules)
- **Phase 3**: Add room module features
- **Phase 4**: Add restaurant module features
- **Phase 5**: Add bar module features

---

## REQUIREMENT 2: LICENSE MANAGEMENT SYSTEM

### Business Need
Prevent software piracy. Control:
- Which PCs can install the software
- How many installations (usually 1 per license)
- Expiration dates
- Module access

### Solution: License Keys + Machine IDs

**License Key Format**:
```
HOTELLO-ABC123-DEF456-GHI789-HOTELLO
  ↑       ↑       ↑       ↑       ↑
PREFIX  HOTEL   MODULE  RANDOM  SUFFIX
       CODE    ENCODE   CHECK   VERIFY
```

### How It Works

**1. Selling a License**:
- Hotel Owner buys HotelloSys license
- Includes modules selection
- Valid for 1 year
- Can install on ONE PC

**2. Installation**:
```
User enters license key: HOTELLO-ABC123-DEF456-GHI789-HOTELLO
         ↓
System validates key (format, database, expiration, machines)
         ↓
System reads machine ID (Windows ProductId + MAC address)
         ↓
System registers installation in database
         ↓
System loads module configuration
         ↓
System is ready to use
```

**3. Validation at Startup**:
```csharp
var license = await licenseService.ValidateLicenseAsync(licenseKey);
if (license.Status != LicenseStatus.Valid)
{
    // Show error, prevent startup
    MessageBox.Show("License invalid or expired");
    Environment.Exit(1);
}
```

### Database Schema

```sql
CREATE TABLE Licenses (
    LicenseId UUID PRIMARY KEY,
    LicenseKey VARCHAR(50) UNIQUE NOT NULL,
    HotelId UUID NOT NULL,
    
    -- Modules (true/false)
    RoomsModuleEnabled BOOLEAN DEFAULT true,
    RestaurantModuleEnabled BOOLEAN DEFAULT false,
    BarModuleEnabled BOOLEAN DEFAULT false,
    
    -- Dates
    IssuedDate TIMESTAMP,
    ValidUntil TIMESTAMP,
    
    -- Limits
    MaxInstallations INT DEFAULT 1,
    
    -- Status
    IsActive BOOLEAN DEFAULT true,
    ActivationDate TIMESTAMP
);

CREATE TABLE LicenseInstallations (
    InstallationId UUID PRIMARY KEY,
    LicenseId UUID NOT NULL,
    MachineName VARCHAR(255),
    MachineId VARCHAR(255) UNIQUE,  -- Windows ProductId
    InstalledDate TIMESTAMP,
    LastUsedDate TIMESTAMP,
    FOREIGN KEY (LicenseId) REFERENCES Licenses
);
```

### Benefits
✅ Prevent piracy (one key per PC)  
✅ Expiration dates (recurring revenue)  
✅ Track active installations  
✅ Control feature access  
✅ Easy to extend (add modules, extend date)  

### Implementation Timeline
- **Phase 1, Week 1**: License models & validation
- **Phase 1, Week 2**: License service & startup check
- **Phase 1, Week 3**: Admin tool to generate licenses
- **Phase 1, Week 4**: Testing & documentation

### Important Notes
- **One License = One PC**
- If user needs second installation, must buy second license
- License includes all selected modules for 1 year
- Can support licensing server in future (cloud-based)

---

## REQUIREMENT 3: DEPARTMENT MANAGEMENT (Hotel Owners)

### Business Need
Different hotels have different organizational structures:
- Small hotel: 5 departments (Front Desk, Housekeeping, Restaurant, Bar, Management)
- Large hotel: 15+ departments with sub-departments

Hotel owners should create/modify/delete departments themselves, not need IT help.

### Solution: Full Department CRUD

**Hotel Owners Can**:
- ✅ Create new departments
- ✅ Edit department name, description, manager, budget
- ✅ Delete unused departments
- ✅ View all employees in department
- ✅ Assign employees to departments
- ✅ Set department hierarchy (e.g., F&B > Restaurant > Kitchen)

### Department Features

**Model**:
```csharp
public class Department
{
    public Guid DepartmentId { get; set; }
    public string Name { get; set; }           // "Housekeeping"
    public string Description { get; set; }
    public Guid? ManagerId { get; set; }       // Department head
    public Guid? ParentDepartmentId { get; set; } // Hierarchy (F&B parent of Restaurant)
    public decimal Budget { get; set; }
    public List<Employee> Employees { get; set; }
    public bool IsActive { get; set; }
}
```

**API Endpoints** (HotelOwner role only):
```
POST   /api/departments                 - Create new department
GET    /api/departments                 - List all departments
GET    /api/departments/{id}            - Get department details
PUT    /api/departments/{id}            - Update department
DELETE /api/departments/{id}            - Delete department
GET    /api/departments/{id}/employees  - List dept employees
```

**UI**:
- Department list view (WPF window)
- Create/Edit department dialog
- Hierarchy tree view
- Drag-drop to reorganize (optional)

### Example Usage

**Scenario**: Hotel owner wants to create organizational structure:
```
Front Office ($50,000 budget)
├── Front Desk
└── Guest Services

Food & Beverage ($75,000 budget)
├── Restaurant
│   ├── Kitchen
│   └── Dining Hall
└── Bar
    ├── Bartenders
    └── Barbacks

Housekeeping ($60,000 budget)
├── Rooms
└── Public Areas

Management ($40,000 budget)
├── Admin
└── HR
```

All created by Hotel Owner without IT involvement!

### Implementation (Phase 2)

**Week 1**:
- Create Department model with hierarchy support
- Create DepartmentService (Create, Read, Update, Delete)
- Create DepartmentRepository
- Database migrations

**Week 2**:
- Create API endpoints
- Add HotelOwner role authorization
- Implement audit logging

**Week 3**:
- Create WPF UI window
- Department list view
- Create/edit dialogs

**Week 4**:
- Unit tests
- Integration tests
- UI testing

---

## REQUIREMENT 4: MOBILE APP (iOS & Android)

### Business Need
Customers want to:
- Browse available rooms from anywhere
- See room photos and amenities
- Make reservations on mobile
- Manage bookings
- Pay for reservations
- See loyalty points

### Solution: .NET MAUI Mobile App

**Technology**: .NET MAUI (cross-platform iOS + Android)

**Key Features**:

```
┌─────────────────────────────────────────┐
│         MOBILE APP (Customer)           │
├─────────────────────────────────────────┤
│                                         │
│ 1. BROWSE HOTELS                        │
│    • See all hotels with HotelloSys    │
│    • Filter by location, price         │
│    • See ratings & reviews             │
│                                         │
│ 2. VIEW ROOMS                          │
│    • See available rooms               │
│    • View photos & amenities           │
│    • Check price (dynamic pricing)     │
│                                         │
│ 3. MAKE RESERVATIONS                   │
│    • Select check-in/out dates         │
│    • Choose room                       │
│    • Enter guest details               │
│    • PAY DOWN-PAYMENT                  │
│                                         │
│ 4. ROOM HOLD TIMER ⏱                   │
│    • Shows countdown (24/48/72 hours)  │
│    • Auto-releases if not confirmed    │
│                                         │
│ 5. LOYALTY POINTS                      │
│    • View points per hotel             │
│    • Redeem rewards                    │
│                                         │
│ 6. MANAGE BOOKINGS                     │
│    • View all reservations             │
│    • Modify/cancel bookings            │
│    • Download receipt                  │
│                                         │
└─────────────────────────────────────────┘
```

### Mobile App Architecture

```
Mobile App (MAUI)
     ↓
  APIs (Call hotel installations)
     ↓
┌──────────┬──────────────┬──────────┐
│ Hotel A  │   Hotel B    │ Hotel C  │
│ API      │   API        │ API      │
└──────────┴──────────────┴──────────┘
     ↓           ↓            ↓
  [Desktop]   [Desktop]   [Desktop]
```

### Core Components

**Services**:
- `HotelService` - Fetch all hotels with HotelloSys
- `RoomService` - Get room availability
- `ReservationService` - Make bookings
- `PaymentService` - Process down-payments
- `LoyaltyService` - Manage loyalty points
- `SyncService` - Sync across hotels

**Pages**:
- HotelListPage - Browse all hotels  
- RoomDetailsPage - See room info
- ReservationPage - Make booking
- CheckoutPage - Payment
- RoomHoldTimerPage - Countdown timer
- LoyaltyPage - See points
- ProfilePage - Customer info

### Implementation (New Phase 13)

**Duration**: 10-14 weeks (Weeks 53-66)  
**Tech Stack**: .NET MAUI, C#, platform-specific APIs

---

## REQUIREMENT 5: DOWN-PAYMENT & ROOM HOLD TIMER

### Business Need
- Prevent no-shows
- Secure revenue upfront
- Give customers flexible time to confirm

### Solution: Down-Payment System

**How It Works**:

```
1. Customer selects room in mobile app
2. Pays down-payment (e.g., 20% of total)
3. Payment marked NON-REFUNDABLE
4. Room put on HOLD for 24-72 hours
5. COUNTDOWN TIMER shown in app
6. After timer expires:
   - Either customer completes full booking
   - Or room is released back to availability

Example:
├─ Room: Deluxe Suite
├─ Dates: Feb 20-23, 2026
├─ Price: $500 total
├─ Down-payment: $100 (20%)   ← PAID NOW
├─ Due at check-in: $400     
├─ Down-payment: NON-REFUNDABLE
├─ Room hold expires: Feb 15, 4:30 PM (24 hours)
└─ ⏱ Countdown: 23:45:59
```

### Database

```csharp
public class ReservationDownPayment
{
    public Guid PaymentId { get; set; }
    public Guid ReservationId { get; set; }
    public decimal Amount { get; set; }           // $100
    public bool IsNonRefundable { get; set; }     // true
    public DateTime PaymentDate { get; set; }
    
    public int HoldDurationHours { get; set; }    // 24, 48, or 72
    public DateTime HoldExpiresAt { get; set; }   // Auto + 24 hours
    public PaymentStatus Status { get; set; }     // Pending, Completed, Expired
}
```

### API Endpoint (Mobile)

```csharp
[HttpPost("api/mobile/reserve-with-payment")]
public async Task<IActionResult> ReserveWithDownPayment(
    MobileReservationRequest request)
{
    // Create reservation
    var reservation = await _service.CreateAsync(request);
    
    // Process down-payment
    var payment = await _paymentService.ProcessDownPaymentAsync(
        reservation.ReservationId,
        request.Amount,
        request.PaymentToken);
    
    // Create room hold
    var hold = new ReservationDownPayment
    {
        PaymentId = Guid.NewGuid(),
        ReservationId = reservation.ReservationId,
        Amount = request.Amount,
        HoldExpiresAt = DateTime.UtcNow.AddHours(24),
        Status = PaymentStatus.Completed
    };
    
    return Ok(new
    {
        reservationId = reservation.ReservationId,
        holdExpiresAt = hold.HoldExpiresAt,
        countdownSeconds = 86400  // 24 hours in seconds
    });
}
```

### Background Job to Expire Holds

```csharp
// Run every 5 minutes
public async Task ExpireElapsedHoldsAsync()
{
    var expired = await _context.ReservationDownPayments
        .Where(h => h.HoldExpiresAt < DateTime.UtcNow &&
                    h.Status == PaymentStatus.Completed)
        .ToListAsync();
    
    foreach (var hold in expired)
    {
        hold.Status = PaymentStatus.Expired;
        
        var reservation = hold.Reservation;
        reservation.Status = ReservationStatus.OnHoldExpired;
        
        // Room becomes available again
        var room = reservation.Room;
        room.Status = RoomStatus.Available;
    }
    
    await _context.SaveChangesAsync();
}
```

### Benefits
✅ Prevents no-shows (money already paid)  
✅ Revenue upfront (cash flow)  
✅ Flexible customer (can change mind in 24 hours)  
✅ Reduces risk (down-payment covers cancellation)  

---

## REQUIREMENT 6: CROSS-HOTEL SYNCHRONIZATION

### Business Need
Customers stay at multiple hotels. They want:
- One customer profile across all hotels
- See loyalty points per hotel
- One login to access all bookings
- See ratings of different hotels

### Solution: Unified Customer Ecosystem

**Architecture**:

```
Central Database (Cloud)
        ↓
    Sync Service
   ↙   ↓   ↘
Hotel A  Hotel B  Hotel C
(NYC)    (LA)     (Miami)

Customer "John Smith"
├─ Profile: john@email.com, +1-555-1234
├─ Hotel A (NYC): 5 stays, 2500 points, 4-star ⭐
├─ Hotel B (LA): 2 stays, 1200 points, 5-star ⭐
└─ Hotel C (Miami): 1 stay, 500 points, 3-star ⭐
```

### Key Components

**1. Unified Customer Profile**
```csharp
public class MobileCustomer
{
    public Guid CustomerId { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    
    // Loyalty per hotel
    public List<LoyaltyAccount> HotelLoyaltyAccounts { get; set; }
        = [
            new { HotelId = hotel_a, Points = 2500 },
            new { HotelId = hotel_b, Points = 1200 },
            new { HotelId = hotel_c, Points = 500 }
        ];
}
```

**2. Real-Time Sync Service**
```csharp
public class SyncService
{
    // Called when mobile app opens
    public async Task SyncHotelsAsync()
    {
        var hotels = await _apiClient.GetAllHotelsAsync();
        await _localDatabase.SaveHotelsAsync(hotels);
    }
    
    // When customer makes reservation
    public async Task SyncReservationAsync(Guid reservationId)
    {
        var reservation = await _context.Reservations.FindAsync(reservationId);
        
        // Push to central database
        await _httpClient.PostAsJsonAsync(
            "https://sync.hotello.com/api/reservations",
            reservation);
        
        // Hotel staff notified immediately
        await _notificationService.NotifyHotelAsync(reservation);
    }
    
    // When customer earns loyalty points
    public async Task SyncLoyaltyPointsAsync(Guid customerId, Guid hotelId)
    {
        var points = await _context.LoyaltyPoints
            .Where(p => p.CustomerId == customerId && p.HotelId == hotelId)
            .SumAsync(p => p.Points);
        
        // Sync to central database
        await _httpClient.PostAsJsonAsync(
            $"https://sync.hotello.com/api/loyalty/{customerId}/{hotelId}",
            new { points = points });
    }
}
```

**3. Hotel Ratings**
```csharp
public class HotelRating
{
    public Guid RatingId { get; set; }
    public Guid HotelId { get; set; }
    public Guid CustomerId { get; set; }
    
    public int StarRating { get; set; }      // 1-5 ⭐
    public string ReviewText { get; set; }
    public DateTime RatedDate { get; set; }
}

// Display in mobile app
Hotel A (New York)
★★★★☆  4.2 average  (1,453 reviews)
Hotel B (Los Angeles)
★★★★★  4.9 average  (856 reviews)
Hotel C (Miami)
★★★☆☆  3.7 average  (423 reviews)
```

### Desktop Notifications

```csharp
// When mobile customer makes reservation
public async Task NotifyNewMobileBookingAsync(Guid reservationId)
{
    var notification = new SystemNotification
    {
        Title = "📱 Mobile Booking Alert",
        Message = "John Smith booked Room 305 " +
                 "(via mobile app, $100 down-payment received)",
        ReservationId = reservationId,
        IsRead = false
    };
    
    // Send to front desk team
    await _notificationHub.Clients.Group("FrontDesk")
        .SendAsync("NewBookingAlert", notification);
}
```

### Privacy & Security
- ✅ GDPR compliant (customer owns data, can delete)
- ✅ Encrypted transmission between hotels & sync service
- ✅ Customer authentication required
- ✅ Audit trail for all sync operations

---

## INTEGRATION SUMMARY

### Timeline Changes

```
ORIGINAL PLAN:
Phase 1-12: 52 weeks

UPDATED PLAN:
Phase 1:    License Management + Modular System
Phase 2:    Department CRUD + Employees
Phase 3:    Down-Payment + Room Holds + Sync Features
Phase 4-8:  Restaurant, Bar, Billing, Loyalty, Reporting (unchanged)
Phase 9:    Web API expansion for mobile backend
Phase 10-12: Testing, Compliance, Deployment (updated for new features)
Phase 13:   Mobile App Development (10-14 weeks) ← NEW!

TOTAL: ~62-66 weeks (with mobile app)
```

### Phase-by-Phase Additions

| Phase | ORIG | NEW | HOURS |
|-------|------|-----|-------|
| 1 | Foundation | + License + Modules | +40 |
| 2 | Employees | + Dept CRUD | +15 |
| 3 | Rooms | + Down-payment Sync | +35 |
| 9 | Web API | + Mobile endpoints | +30 |
| 13 | — | Mobile App Dev | +336 |
| **TOTAL** | — | — | **+456** |

**New Total Estimate**: 1,555 + 456 = **2,011-2,331 hours**
**New Timeline**: 52 + 14 = **~66 weeks (15 months)**

### Documentation Updates

✅ **Files Modified**:
1. PHASE_1_DETAILED_GUIDE.md - Added license management section
2. PHASE_2_DETAILED_GUIDE.md - Added department CRUD section
3. PHASE_3_DETAILED_GUIDE.md - Added down-payment and sync sections
4. MODULAR_LICENSING_MOBILE_ARCHITECTURE.md - Created new comprehensive guide
5. This file - BUSINESS_REQUIREMENTS_UPDATE_FEB2026.md

✅ **New Files Created**:
- MODULAR_LICENSING_MOBILE_ARCHITECTURE.md (2,000+ lines)
- BUSINESS_REQUIREMENTS_UPDATE_FEB2026.md (this file)

---

## Decision Points

### For Management

**1. License Model**:
- ✅ **Recommended**: One license = one PC (current spec)
- Alternative: Site license (multiple PCs one price) - higher cost
- Alternative: Cloud-based (pay per user) - future enhancement

**2. Module Pricing**:
- ✅ **Recommended**:
  - Rooms: $499/year
  - Restaurant: $399/year
  - Bar: $299/year
  - Bundles: 20% discount if buy 2+
  
**3. Down-Payment Percentage**:
- ✅ **Recommended**: 20% down-payment
- Alternative: 50% down
- Alternative: Full payment required

**4. Room Hold Duration**:
- ✅ **Recommended**: 24, 48, 72 hour options
- Alternative: Fixed 24 hours
- Alternative: Configurable per hotel

**5. Mobile App Release**:
- ✅ **Recommended**: Week 53 (after Phase 12)
- Alternative: Quick MVP in week 46 (simplified)

---

## Implementation Checklist

### Phase 1 Additions
- [ ] Create License model
- [ ] Create LicenseInstallation model
- [ ] Implement LicenseService
- [ ] Add startup validation
- [ ] Create admin tool for generating licenses
- [ ] Database migrations
- [ ] Unit tests
- [ ] Documentation

### Phase 2 Additions
- [ ] Update Department model with hierarchy
- [ ] Create DepartmentService (CRUD)
- [ ] Create DepartmentRepository
- [ ] Create API endpoints
- [ ] Implement HotelOwner authorization
- [ ] Create WPF UI window
- [ ] Unit tests
- [ ] Integration tests

### Phase 3 Additions
- [ ] Create ReservationDownPayment model
- [ ] Create API endpoint for mobile booking
- [ ] Implement RoomHoldService
- [ ] Create background job for expiring holds
- [ ] Create SyncService
- [ ] Create NotificationService
- [ ] Create SystemNotification model
- [ ] Unit tests
- [ ] Integration tests

### Phase 13 (Mobile App)
- [ ] Create .NET MAUI project
- [ ] Implement all pages
- [ ] Integrate with hotel APIs
- [ ] Implement synchronization
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Store testing
- [ ] Production deployment

---

## Conclusion

HotelloSys now has a clear path to becoming a comprehensive, multi-hotel, multi-platform system with:

✅ **Flexible licensing** (one key per PC)  
✅ **Modular features** (customers buy what they need)  
✅ **Mobile access** (iOS & Android apps)  
✅ **Smart reservations** (down-payments, holds, timers)  
✅ **Unified customers** (one profile across hotels)  
✅ **Flexible organization** (owners manage departments)  

All documented and ready for implementation!

---

**For Questions or Changes**: See attached detailed guide:  
→ [MODULAR_LICENSING_MOBILE_ARCHITECTURE.md](MODULAR_LICENSING_MOBILE_ARCHITECTURE.md)

