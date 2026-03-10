# Phase 3: Room Management & Reservations - DETAILED GUIDE

**Phase Duration**: 5 weeks (Weeks 9-13)  
**Estimated Hours**: 130-155 hours  
**Weekly Target**: 26-31 hours/week  
**Complexity**: High  
**Dependencies**: Phase 1 & 2 (Foundation & Employees)

---

## Phase Overview

Phase 3 implements the core hotel operations - room management and the reservation system. This is the business heart of the hotel management system.

### Key Objectives:
- Create room and room type management
- Implement room availability tracking
- Build reservation system
- Create check-in/check-out workflow
- Implement customer management
- Build occupancy forecasting
- Create room assignment logic
- Generate occupancy reports

### NEW FEATURES - Mobile Integration:
- **Mobile Down-Payment System** - Customers pay non-refundable down-payment via mobile app
- **Room Hold Timer** - Reserved room countdown (24-72 hours options)
- **Cross-Hotel Synchronization** - Sync reservations with central database
- **Desktop Notifications** - Hotel staff notified of mobile bookings
- **Real-time Availability Sync** - Mobile app pulls latest room availability
- See detailed sections below for implementation details

### Business Value:
- Centralized room management
- Real-time availability tracking
- Customer reservation history
- Revenue per available room (RevPAR) tracking
- Housekeeping efficiency
- **Mobile revenue stream** - Down-payments for room holds
- **Faster bookings** - Mobile customers use app instead of phone
- **Reduced no-shows** - Down-payment commitment

---

## Week 1: Room & Room Type Models (26-30 hours)

### Day 1-2: Room Type & Room Models
Create foundational room management models:

**RoomType.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class RoomType
    {
        public int RoomTypeId { get; set; }
        public string RoomTypeName { get; set; } = string.Empty; // "Standard", "Deluxe", "Suite"
        public string Description { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public int MaxOccupancy { get; set; }
        public decimal Area { get; set; } // Square meters
        public string? Amenities { get; set; } // JSON or comma-separated
        public bool IsActive { get; set; } = true;

        public ICollection<Room> Rooms { get; set; } = new List<Room>();
        public ICollection<RoomTypeRate> RoomTypeRates { get; set; } = new List<RoomTypeRate>();

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }
}
```

**Room.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class Room
    {
        public int RoomId { get; set; }
        public string RoomNumber { get; set; } = string.Empty; // "101", "2050"
        public int RoomTypeId { get; set; }
        public RoomType RoomType { get; set; } = null!;

        public RoomStatus Status { get; set; } // Available, Occupied, Maintenance, etc.
        public bool IsActive { get; set; } = true;

        public string? Notes { get; set; }

        public int? CurrentGuestId { get; set; }
        public Customer? CurrentGuest { get; set; }

        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
        public ICollection<RoomHistory> RoomHistories { get; set; } = new List<RoomHistory>();
        public ICollection<RoomMaintenance> MaintenanceRecords { get; set; } = new List<RoomMaintenance>();

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }
        public string UpdatedBy { get; set; } = string.Empty;
    }

    public enum RoomStatus
    {
        Available = 1,
        Occupied = 2,
        Maintenance = 3,
        Reserved = 4,
        DoNotDisturb = 5,
        Dirty = 6,
        Blocked = 7
    }
}
```

**RoomHistory.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class RoomHistory
    {
        public int RoomHistoryId { get; set; }
        public int RoomId { get; set; }
        public Room Room { get; set; } = null!;

        public RoomStatus PreviousStatus { get; set; }
        public RoomStatus NewStatus { get; set; }

        public DateTime StatusChangeTime { get; set; }
        public string? Reason { get; set; }
        public string ChangedBy { get; set; } = string.Empty;
    }
}
```

### Day 3-4: Room Type Rates
Handle seasonal pricing:

**RoomTypeRate.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class RoomTypeRate
    {
        public int RoomTypeRateId { get; set; }
        public int RoomTypeId { get; set; }
        public RoomType RoomType { get; set; } = null!;

        public DateTime EffectiveDate { get; set; }
        public DateTime? EndDate { get; set; } // Null if ongoing

        public decimal Rate { get; set; }
        public string? Season { get; set; } // "High", "Low", "Shoulder"

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }
}
```

### Day 5: Repositories & Services
Create RoomRepository, RoomTypeRepository, RoomService:

**RoomService excerpt**:
```csharp
public interface IRoomService
{
    Task<Room> GetRoomByNumberAsync(string roomNumber);
    Task<IEnumerable<Room>> GetAvailableRoomsAsync(DateTime checkInDate, DateTime checkOutDate);
    Task<IEnumerable<Room>> GetRoomsByTypeAsync(int roomTypeId);
    Task UpdateRoomStatusAsync(int roomId, RoomStatus newStatus, string reason);
    Task<decimal> GetRoomPriceAsync(int roomTypeId, DateTime startDate);
}
```

---

## Week 2: Customer & Reservation Models (27-30 hours)

### Day 1-2: Customer Management
Implement customer/guest profiles:

**Customer.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class Customer
    {
        public int CustomerId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? MiddleName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? IdNumber { get; set; }
        public string? IdType { get; set; }

        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? PostalCode { get; set; }

        public DateTime? DateOfBirth { get; set; }
        public CustomerType CustomerType { get; set; } // Individual, Corporate
        public CustomerStatus Status { get; set; } // Active, Inactive, Blacklisted

        public DateTime FirstStayDate { get; set; }
        public DateTime? LastStayDate { get; set; }
        public int TotalStays { get; set; }

        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
        public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }

    public enum CustomerType { Individual = 1, Corporate = 2 }
    public enum CustomerStatus { Active = 1, Inactive = 2, Blacklisted = 3 }
}
```

### Day 3-4: Reservation System
Core booking logic:

**Reservation.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class Reservation
    {
        public int ReservationId { get; set; }
        public string ReservationNumber { get; set; } = string.Empty; // "RES-2026-001234"

        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;

        public int RoomId { get; set; }
        public Room Room { get; set; } = null!;

        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }

        public int NumberOfGuests { get; set; }
        public int NumberOfChildren { get; set; }

        public ReservationStatus Status { get; set; }
        public ReservationType ReservationType { get; set; }

        public decimal TotalPrice { get; set; }
        public decimal DepositPaid { get; set; }
        public decimal RemainingBalance { get; set; }

        public string? SpecialRequests { get; set; }
        public string? Notes { get; set; }

        public int? CancelledByEmployeeId { get; set; }
        public DateTime? CancellationDate { get; set; }
        public string? CancellationReason { get; set; }

        public ICollection<ReservationGuest> Guests { get; set; } = new List<ReservationGuest>();

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }
        public string UpdatedBy { get; set; } = string.Empty;
    }

    public enum ReservationStatus
    {
        Pending = 1,
        Confirmed = 2,
        CheckedIn = 3,
        CheckedOut = 4,
        Cancelled = 5,
        NoShow = 6
    }

    public enum ReservationType
    {
        Walk_In = 1,
        Online = 2,
        Phone = 3,
        Agent = 4,
        Corporate = 5
    }
}
```

**ReservationGuest.cs** (additional guests):
```csharp
namespace HotelloSys.Core.Models
{
    public class ReservationGuest
    {
        public int ReservationGuestId { get; set; }
        public int ReservationId { get; set; }
        public Reservation Reservation { get; set; } = null!;

        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public bool IsPrimaryGuest { get; set; }
    }
}
```

### Day 5: Reservation Services
Implement booking logic:

**ReservationService excerpt**:
```csharp
public interface IReservationService
{
    Task<Reservation> CreateReservationAsync(CreateReservationRequest request);
    Task<Reservation?> GetReservationByNumberAsync(string reservationNumber);
    Task<IEnumerable<Reservation>> GetCustomerReservationsAsync(int customerId);
    Task<IEnumerable<Reservation>> GetReservationsByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task CheckInReservationAsync(int reservationId);
    Task CheckOutReservationAsync(int reservationId);
    Task CancelReservationAsync(int reservationId, string reason);
    Task<decimal> CalculateReservationPriceAsync(CreateReservationRequest request);
}

public class ReservationService : IReservationService
{
    private readonly IReservationRepository _reservationRepository;
    private readonly IRoomService _roomService;
    private readonly ICustomerRepository _customerRepository;

    public async Task<Reservation> CreateReservationAsync(CreateReservationRequest request)
    {
        // Validate dates
        if (request.CheckOutDate <= request.CheckInDate)
            throw new InvalidOperationException("Check-out must be after check-in");

        // Check room availability
        var availableRooms = await _roomService.GetAvailableRoomsAsync(
            request.CheckInDate, 
            request.CheckOutDate
        );

        var room = availableRooms.FirstOrDefault(r => r.RoomId == request.RoomId);
        if (room == null)
            throw new InvalidOperationException("Room not available for selected dates");

        // Calculate price
        var totalPrice = await CalculateReservationPriceAsync(request);

        // Create reservation
        var reservation = new Reservation
        {
            ReservationNumber = GenerateReservationNumber(),
            CustomerId = request.CustomerId,
            RoomId = request.RoomId,
            CheckInDate = request.CheckInDate,
            CheckOutDate = request.CheckOutDate,
            NumberOfGuests = request.NumberOfGuests,
            TotalPrice = totalPrice,
            Status = ReservationStatus.Confirmed,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System"
        };

        return await _reservationRepository.AddAsync(reservation);
    }

    public async Task CheckInReservationAsync(int reservationId)
    {
        var reservation = await _reservationRepository.GetByIdAsync(reservationId);
        if (reservation == null)
            throw new InvalidOperationException("Reservation not found");

        if (reservation.Status != ReservationStatus.Confirmed)
            throw new InvalidOperationException("Can only check in confirmed reservations");

        reservation.Status = ReservationStatus.CheckedIn;
        await _roomService.UpdateRoomStatusAsync(reservation.RoomId, RoomStatus.Occupied, "Guest checked in");
        await _reservationRepository.UpdateAsync(reservation);
    }
}
```

---

## Week 3: Occupancy & Availability (26-30 hours)

### Day 1-2: Availability Logic
Complex room availability checking:

**RoomAvailabilityService**:
```csharp
public async Task<IEnumerable<Room>> GetAvailableRoomsAsync(
    DateTime checkIn, 
    DateTime checkOut, 
    int? roomTypeId = null)
{
    var conflictingReservations = await _context.Reservations
        .Where(r => r.CheckInDate < checkOut && r.CheckOutDate > checkIn &&
                    r.Status != ReservationStatus.Cancelled)
        .Select(r => r.RoomId)
        .ToListAsync();

    var query = _context.Rooms
        .Where(r => r.IsActive &&
                    r.Status != RoomStatus.Maintenance &&
                    !conflictingReservations.Contains(r.RoomId));

    if (roomTypeId.HasValue)
        query = query.Where(r => r.RoomTypeId == roomTypeId.Value);

    return await query.ToListAsync();
}
```

### Day 3-4: Pricing Logic
Dynamic pricing:

**PricingService**:
```csharp
public async Task<decimal> CalculateReservationPriceAsync(CreateReservationRequest request)
{
    var room = await _roomService.GetRoomByNumberAsync(request.RoomNumber);
    var nights = (request.CheckOutDate - request.CheckInDate).Days;

    decimal totalPrice = 0;

    for (var date = request.CheckInDate; date < request.CheckOutDate; date = date.AddDays(1))
    {
        var rate = await _rateRepository.GetRateForDateAsync(room.RoomTypeId, date);
        totalPrice += rate ?? room.RoomType.BasePrice;
    }

    return totalPrice;
}
```

### Day 5: Occupancy Reports
**OccupancyReportService**:
```csharp
public async Task<OccupancyReport> GenerateOccupancyReportAsync(DateTime date)
{
    var totalRooms = await _context.Rooms.CountAsync(r => r.IsActive);
    var occupiedRooms = await _context.Reservations
        .Where(r => r.CheckInDate <= date && r.CheckOutDate > date &&
                    r.Status != ReservationStatus.Cancelled)
        .Select(r => r.RoomId)
        .Distinct()
        .CountAsync();

    return new OccupancyReport
    {
        Date = date,
        TotalRooms = totalRooms,
        OccupiedRooms = occupiedRooms,
        OccupancyRate = (decimal)occupiedRooms / totalRooms * 100
    };
}
```

---

## Week 4: Check-in/Check-out Workflow (27-30 hours)

### Day 1-2: Check-in Process
Implement guest check-in:

**CheckInService**:
```csharp
public class CheckInService
{
    public async Task<GuestCheckInResult> CheckInGuestAsync(int reservationId, CheckInRequest request)
    {
        var reservation = await _reservationRepository.GetByIdAsync(reservationId);

        // Validate check-in timing
        if (DateTime.UtcNow.Date != reservation.CheckInDate.Date)
            throw new InvalidOperationException("Invalid check-in date");

        // Update room
        reservation.Room.Status = RoomStatus.Occupied;
        reservation.Room.CurrentGuestId = reservation.CustomerId;

        // Update reservation
        reservation.Status = ReservationStatus.CheckedIn;

        await _reservationRepository.UpdateAsync(reservation);

        return new GuestCheckInResult { Success = true, RoomKey = GenerateRoomKey() };
    }
}
```

### Day 3-4: Check-out Process
**CheckOutService**:
```csharp
public class CheckOutService
{
    public async Task<GuestCheckOutResult> CheckOutGuestAsync(int reservationId)
    {
        var reservation = await _reservationRepository.GetByIdAsync(reservationId);

        reservation.Status = ReservationStatus.CheckedOut;
        reservation.Room.Status = RoomStatus.Dirty;
        reservation.Room.CurrentGuestId = null;

        await _reservationRepository.UpdateAsync(reservation);

        // Create invoice
        var invoice = new Invoice
        {
            ReservationId = reservationId,
            CustomerId = reservation.CustomerId,
            Amount = reservation.TotalPrice,
            Status = InvoiceStatus.Pending
        };

        await _invoiceRepository.AddAsync(invoice);

        return new GuestCheckOutResult { InvoiceId = invoice.InvoiceId };
    }
}
```

### Day 5: UI Implementation
Create reservation management UI with check-in/check-out workflows.

---

## Week 5: UI & Reports (26-30 hours)

### Day 1: Reservation Management UI
Create reservation window with booking workflow:
- Search available rooms
- Create reservation
- View reservation details
- Modify reservation
- Cancel reservation

### Day 2: Room Management UI
- View all rooms with status
- Update room status
- Assign housekeeping
- View maintenance history

### Day 3: Check-in/Check-out UI
- Find reservation by number/guest
- Perform check-in
- Perform check-out
- Generate invoice

### Day 4: Occupancy Reports
- Daily occupancy report
- Weekly forecast
- RevPAR analysis
- No-show tracking

### Day 5: Testing & Refinement
- End-to-end reservation flow
- Edge case testing
- Performance optimization
- UI polish

---

## Key Features Summary

| Feature | Details | Status |
|---------|---------|--------|
| Room Inventory | 100+ rooms with types | ✅ |
| Dynamic Pricing | Seasonal rates per type | ✅ |
| Availability | Real-time checking | ✅ |
| Reservations | Full booking system | ✅ |
| Check-in/Out | Guest workflow | ✅ |
| Customer Profiles | Guest management | ✅ |
| Reports | Occupancy & revenue | ✅ |

---

## Phase 3 Testing Strategy

- Unit tests for availability logic
- Integration tests for full reservation flow
- UI tests for check-in/check-out
- Performance tests with 10,000+ reservations

---

## Mobile Integration: Down-Payment & Room Hold (NEW FEATURE)

### Down-Payment System for Mobile App

When customers make reservations via mobile app:
1. They pay non-refundable down-payment
2. Room is placed on 24-72 hour hold (countdown timer)
3. After hold expires or full booking completed

**ReservationDownPayment.cs**:
```csharp
public class ReservationDownPayment
{
    public Guid PaymentId { get; set; }
    public Guid ReservationId { get; set; }
    public decimal Amount { get; set; }
    public bool IsNonRefundable { get; set; } = true;
    public int HoldDurationHours { get; set; } = 24;
    public DateTime HoldExpiresAt { get; set; }
    public PaymentStatus Status { get; set; }
}
```

### Cross-Hotel Synchronization (NEW FEATURE)

- Sync mobile reservations to central database
- Desktop app notified of mobile bookings
- Real-time availability sync
- Customer profile unified across hotels

**Implementation**:
- Add `SyncService` to sync reservations
- Add `NotificationService` for desktop alerts
- Api endpoint `/api/mobile/reserve` posts to central system
- Background job expires room holds

---

## Phase 3 Completion Checklist

- [ ] All room models created
- [ ] Reservation system implemented
- [ ] Check-in/check-out workflow complete
- [ ] Availability logic verified
- [ ] Pricing calculations accurate
- [ ] Customer management working
- [ ] All UI windows created
- [ ] Reports generating correctly
- [ ] Tests passing (>70% coverage)
- [ ] No SQL injection vulnerabilities
- [ ] Soft deletes implemented

**Status**: Ready for Phase 4 when complete ✅
