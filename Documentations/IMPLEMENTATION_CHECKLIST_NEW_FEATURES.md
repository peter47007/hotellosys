# HotelloSys: Implementation Checklist for New Features

**Date**: February 13, 2026  
**Status**: Ready for Implementation  
**Estimated Timeline**: +14-16 weeks to existing 52-week plan

---

## 🎯 QUICK REFERENCE: WHERE FEATURES ARE IMPLEMENTED

### Feature 1: License Management
**Phase**: 1 (Foundation)  
**Weeks**: 1-4  
**Additional Hours**: +40  
**Files Updated**:
- [PHASE_1_DETAILED_GUIDE.md](PHASE_1_DETAILED_GUIDE.md) - See "License Management Integration" section (Line 530+)
- [MODULAR_LICENSING_MOBILE_ARCHITECTURE.md](MODULAR_LICENSING_MOBILE_ARCHITECTURE.md) - See "PART 2: LICENSE MANAGEMENT SYSTEM"

**What to Add**:
1. `License.cs` model
2. `LicenseInstallation.cs` model
3. `ILicenseService.cs` interface
4. `LicenseService.cs` implementation
5. Database migration
6. Startup validation code
7. Unit tests (5-10 tests)

---

### Feature 2: Modular System
**Phase**: 1 (Foundation)  
**Weeks**: 1-4  
**Additional Hours**: +20  
**Files Updated**:
- [PHASE_1_DETAILED_GUIDE.md](PHASE_1_DETAILED_GUIDE.md) - Updated overview
- [MODULAR_LICENSING_MOBILE_ARCHITECTURE.md](MODULAR_LICENSING_MOBILE_ARCHITECTURE.md) - See "PART 1: MODULAR ARCHITECTURE"

**What to Add**:
1. Feature flag enum (RoomManagement, RestaurantOperations, BarOperations)
2. Module configuration in appsettings.json
3. Conditional service registration in Program.cs
4. UI visibility converters (for hiding disabled modules)
5. Authorization attributes on controllers
6. Unit tests for feature flags

---

### Feature 3: Department Management CRUD
**Phase**: 2 (Employees)  
**Weeks**: 5-8  
**Additional Hours**: +15  
**Files Updated**:
- [PHASE_2_DETAILED_GUIDE.md](PHASE_2_DETAILED_GUIDE.md) - Updated overview section

**What to Add**:
1. Update `Department.cs` with ParentDepartmentId (hierarchy)
2. `IDepartmentService.cs` interface with CRUD methods
3. `DepartmentService.cs` implementation
4. `IDepartmentRepository.cs` interface
5. `DepartmentRepository.cs` implementation
6. API controller: `DepartmentsController.cs`
   - POST /api/departments (Create)
   - GET /api/departments (List)
   - GET /api/departments/{id} (Get)
   - PUT /api/departments/{id} (Update)
   - DELETE /api/departments/{id} (Delete)
7. WPF window: `DepartmentManagementWindow.xaml`
8. ViewModel: `DepartmentManagementViewModel.cs`
9. Authorization: [Authorize(Roles = "HotelOwner")]
10. Unit tests (10-15 tests)

---

### Feature 4: Down-Payment & Room Hold
**Phase**: 3 (Rooms)  
**Weeks**: 9-13  
**Additional Hours**: +25  
**Files Updated**:
- [PHASE_3_DETAILED_GUIDE.md](PHASE_3_DETAILED_GUIDE.md) - New section "Mobile Integration: Down-Payment & Room Hold"
- [MODULAR_LICENSING_MOBILE_ARCHITECTURE.md](MODULAR_LICENSING_MOBILE_ARCHITECTURE.md) - See "PART 3: MOBILE APP STRATEGY"

**What to Add**:
1. `ReservationDownPayment.cs` model
2. `PaymentStatus` enum
3. `IRoomHoldService.cs` interface
4. `RoomHoldService.cs` implementation
5. `INotificationService.cs` interface
6. `NotificationService.cs` implementation
7. Hosted service for background job: `RoomHoldExpirationService.cs`
8. API endpoint: `[HttpPost("api/mobile/reserve-with-payment")]`
9. Database migration
10. Unit tests (8-12 tests)
11. Integration tests (3-5 tests)

---

### Feature 5: Cross-Hotel Synchronization
**Phase**: 3 (Rooms) / 9 (Web API)  
**Weeks**: 9-13 (Phase 3) + 41-45 (Phase 9)  
**Additional Hours**: +35  
**Files Updated**:
- [PHASE_3_DETAILED_GUIDE.md](PHASE_3_DETAILED_GUIDE.md) - New section "Cross-Hotel Synchronization"
- Phase 9 guide (to be updated)
- [MODULAR_LICENSING_MOBILE_ARCHITECTURE.md](MODULAR_LICENSING_MOBILE_ARCHITECTURE.md) - See "PART 5: CROSS-HOTEL SYNC"

**What to Add**:
1. `ISyncService.cs` interface
2. `SyncService.cs` implementation
3. `SyncLog.cs` model
4. `SystemNotification.cs` model
5. `INotificationHub.cs` (SignalR)
6. API controller: `SyncController.cs`
7. Background sync service
8. Database migrations
9. Unit tests (10-15 tests)
10. Integration tests (3-5 tests)

---

### Feature 6: Mobile App (iOS & Android)
**Phase**: 13 (NEW - Mobile Development)  
**Weeks**: 53-66 (after Phase 12)  
**Duration**: 10-14 weeks  
**Hours**: +336  
**Files to Create**: NEW PHASE 13 GUIDE
- Phase_13_Mobile_App_Development_Guide.md

**Project Structure**:
```
HotelloSys.Mobile/                   ← New .NET MAUI project
├── Services/
│   ├── HotelService.cs
│   ├── RoomService.cs
│   ├── ReservationService.cs
│   ├── PaymentService.cs
│   ├── LoyaltyService.cs
│   ├── SyncService.cs
│   └── NotificationService.cs
├── ViewModels/
│   ├── HotelListViewModel.cs
│   ├── RoomDetailsViewModel.cs
│   ├── ReservationViewModel.cs
│   ├── CheckoutViewModel.cs
│   ├── RoomHoldTimerViewModel.cs
│   ├── LoyaltyViewModel.cs
│   └── ProfileViewModel.cs
├── Views/
│   ├── HotelListPage.xaml
│   ├── RoomDetailsPage.xaml
│   ├── ReservationPage.xaml
│   ├── CheckoutPage.xaml
│   ├── RoomHoldTimerPage.xaml
│   ├── LoyaltyPage.xaml
│   └── ProfilePage.xaml
└── Models/
    ├── Hotel.cs
    ├── Room.cs
    ├── Reservation.cs
    ├── Customer.cs
    └── LoyaltyAccount.cs
```

---

## 📋 DETAILED IMPLEMENTATION PLAN

### Week-by-Week (66 Total Weeks)

#### PHASE 1: FOUNDATION + LICENSE (Weeks 1-4)
**Original**: 4 weeks  
**New**: 4 weeks + 1 additional week for license mgmt (extend to 5 weeks)  

**Week 1**: Project Setup + **License Models & Service**
- Day 1-2: Project structure
- Day 3-4: License models (License, LicenseInstallation)
- Day 5: License service implementation

**Week 2**: Authentication + **License Validation**
- Day 1-3: Authentication (unchanged)
- Day 4-5: License validation at startup

**Week 3**: WPF UI + **Feature Flags**
- Day 1-4: WPF UI (unchanged)
- Day 5: Feature flag system

**Week 4**: Configuration + **License Admin Tool**
- Day 1-3: Hotel setup wizard (unchanged)
- Day 4-5: License key generation tool (admin utility)

**Unit Tests**: +10 for license system

---

#### PHASE 2: EMPLOYEES + DEPARTMENTS (Weeks 5-8)
**Original**: 4 weeks  
**New**: 4 weeks + 1 additional week for department CRUD (extend to 5 weeks)  

**Week 1-2**: Department & Role Structure (ENHANCED)
- Day 1: Project setup
- Day 2: Department model (with ParentDepartmentId for hierarchy)
- Day 3-4: Repository & service
- Day 5: **Department CRUD service**

**Week 3**: **Department API & UI**
- Day 1-2: DepartmentsController with all CRUD endpoints
- Day 3-4: Authorization (HotelOwner role)
- Day 5: WPF window for department management

**Week 4**: Employee Management (unchanged)
- Days 1-5: Standard employee CRUD

**Unit Tests**: +10 for department system

---

#### PHASE 3: ROOMS + RESERVATIONS + MOBILE (Weeks 9-13)
**Original**: 5 weeks  
**New**: 5 weeks + 1 additional week for mobile features (extend to 6 weeks)  

**Week 1-2**: Room Models (unchanged)  
**Week 3-4**: Reservation System (unchanged)  

**Week 5**: **DOWN PAYMENT + SYNC**
- Day 1-2: ReservationDownPayment model
- Day 3: RoomHoldService implementation
- Day 4: Background job for expiring holds
- Day 5: **SyncService & mobile API endpoint**

**Unit Tests**: +15 for mobile features

---

#### PHASES 4-12: RESTAURANT, BAR, BILLING, ETC. (Weeks 14-52)
**No major changes** - Continue as planned, but:
- Phase 9 (Web API): Add mobile-specific endpoints (+30 hours)
- Phase 10-12 (Testing/Deploy): Update for mobile app deployment (+15 hours)

---

#### PHASE 13: MOBILE APP DEVELOPMENT (Weeks 53-66) 🆕
**New Phase**: 10-14 weeks  

**Week 53-54**: Project Setup & Architecture
- Create .NET MAUI project
- Set up project structure
- Create service interfaces
- Set up dependency injection

**Week 55-58**: Core Pages & Services
- HotelListPage + HotelService
- RoomDetailsPage + RoomService
- ReservationPage + ReservationService
- CheckoutPage + PaymentService

**Week 59-61**: Advanced Features
- RoomHoldTimerPage (countdown logic)
- LoyaltyPage
- ProfilePage + Sync service
- NotificationService

**Week 62-64**: Testing & Refinement
- Unit tests (30%+ coverage)
- Integration tests with backend
- Manual testing on device
- Performance optimization

**Week 65-66**: Deployment
- iOS App Store submission
- Google Play Store submission
- Documentation
- Release notes

---

## 📊 HOURS BREAKDOWN

### By Feature

| Feature | Phase | Hours |
|---------|-------|-------|
| License Management | 1 | +40 |
| Modular System | 1 | +20 |
| Department CRUD | 2 | +15 |
| Down-Payment | 3| +25 |
| Sync Service | 3+9 | +35 |
| Mobile App | 13 | +336 |
| Phase 9 Mobile Endpoints | 9 | +30 |
| Phase 10-12 Mobile Deploy | 10-12 | +15 |
| **TOTAL NEW FEATURES** | — | **+516** |

### By Phase

| Phase | Original | New Additions | Total |
|-------|----------|---------------|-------|
| 1 | 100-120 | +60 | 160-180 |
| 2 | 90-110 | +15 | 105-125 |
| 3 | 130-155 | +60 | 190-215 |
| 4-8 | 600-700 | +30 | 630-730 |
| 9 | 155-180 | +30 | 185-210 |
| 10-12 | 220-260 | +15 | 235-275 |
| 13 | — | +336 | 336-350 |
| **TOTAL** | **1,555-1,875** | **+516-546** | **2,071-2,421** |

### Timeline

- **Original**: 52 weeks
- **With Mobile**: 66 weeks (~15 months)
- **Add 14 weeks for Phase 13 (mobile app)**

---

## 🔄 DEPENDENCIES & SEQUENCING

```
Phase 1 (Foundation + License)
    ↓
Phase 2 (Employees + Department CRUD)
    ↓
Phase 3 (Rooms + Down-Payment + Sync)
    ↓
Phases 4-8 (Restaurant, Bar, Billing, Loyalty, Reporting)
    ↓
Phase 9 (Web API + Mobile Endpoints)
    ↓
Phases 10-12 (Testing, Compliance, Deployment)
    ↓
Phase 13 (Mobile App Development) ← START HERE AFTER PHASE 12 COMPLETE
```

**Critical Path**:
1. Complete Phase 1 fully (license required for all installations)
2. Complete Phase 2 (department CRUD)
3. Complete Phase 3 (mobile sync foundation)
4. Phases 4-12 are independent of mobile
5. Phase 9 must be complete before Phase 13 (API required)
6. Phase 13 begins only after Phase 12 complete

---

## ✅ TESTING STRATEGY

### Unit Tests (Per Feature)
- License Management: 10 tests
- Department CRUD: 12 tests
- Room Holds: 8 tests
- Sync Service: 12 tests
- Mobile App: 50+ tests

**Target**: >80% code coverage for all new features

### Integration Tests
- License validation → Startup flow
- Department creation → Employee assignment
- Reservation → Down-payment → Room hold
- Sync service → Central database → Notification
- Mobile → Backend API → Database

### Manual/QA Tests
- License key validation (valid, invalid, expired, limit exceeded)
- Department hierarchy (parent-child relationships)
- Room hold timer countdown
- Sync across multiple hotel instances
- Mobile app on iOS simulator
- Mobile app on Android emulator

---

## 🚀 DEPLOYMENT CHECKLIST

### Phase 1 Deployment
- [ ] License generation tool provided to admins
- [ ] Sample license keys created for testing
- [ ] Documentation: How to activate license
- [ ] Training video: Installation with license key

### Phase 3 Deployment
- [ ] Down-payment payment processor configured
- [ ] Sync service endpoint deployed (cloud)
- [ ] Desktop notifications working
- [ ] Mobile API endpoints tested

### Phase 13 Deployment
- [ ] iOS app in App Store
- [ ] Android app on Google Play
- [ ] Marketing materials ready
- [ ] Customer support trained on mobile features
- [ ] On-boarding tutorial for new mobile users

---

##🎓 LEARNING MATERIALS TO CREATE

### For Developers
- [ ] License management best practices guide
- [ ] Modular architecture patterns guide
- [ ] MAUI development tutorial
- [ ] Cross-platform mobile testing guide

### For End Users
- [ ] Department management tutorial
- [ ] Mobile app installation guide
- [ ] Room booking via mobile walkthrough
- [ ] Loyalty points in mobile app guide

### For Administrators
- [ ] License key generation tool documentation
- [ ] License management best practices
- [ ] Troubleshooting guide

---

## 📞 QUESTIONS & DECISIONS

### For Product Owner
1. **License Model**: One license per PC (recommended) or site license?
2. **Down-Payment %**: 20% (recommended), 50%, or 100%?
3. **Hold Duration**: 24/48/72 hrs (recommended) or fixed?
4. **Mobile Priority**: Full app or MVP first?
5. **Launch Sequence**: All modules at once or gradual rollout?

### For CTO/Architecture
1. **Central Sync Service**: Hosted where? (AWS, Azure, on-premise?)
2. **License Server**: Cloud or local?
3. **Mobile Auth**: Should use desktop credentials or separate mobile login?
4. **Push Notifications**: APNs for iOS, FCM for Android?

---

## 📚 REFERENCE DOCUMENTS

### Architecture
- [MODULAR_LICENSING_MOBILE_ARCHITECTURE.md](MODULAR_LICENSING_MOBILE_ARCHITECTURE.md) - Complete guide

### Requirements
- [BUSINESS_REQUIREMENTS_UPDATE_FEB2026.md](BUSINESS_REQUIREMENTS_UPDATE_FEB2026.md) - Detailed requirements

### Phase Guides
- [PHASE_1_DETAILED_GUIDE.md](PHASE_1_DETAILED_GUIDE.md) - Updated with license section
- [PHASE_2_DETAILED_GUIDE.md](PHASE_2_DETAILED_GUIDE.md) - Updated with dept CRUD section
- [PHASE_3_DETAILED_GUIDE.md](PHASE_3_DETAILED_GUIDE.md) - Updated with mobile section
- Complete Development Plan (main guide)

---

## Ready to Implement?

**Start Here**:
1. Read [BUSINESS_REQUIREMENTS_UPDATE_FEB2026.md](BUSINESS_REQUIREMENTS_UPDATE_FEB2026.md) (overview)
2. Read [MODULAR_LICENSING_MOBILE_ARCHITECTURE.md](MODULAR_LICENSING_MOBILE_ARCHITECTURE.md) (detailed architecture)
3. Review updated Phase 1 guide (license implementation)
4. Create tasks from this checklist
5. Begin Phase 1 (with license management) ✅

---

**Status**: 🟢 **READY FOR IMPLEMENTATION**

**Last Updated**: February 13, 2026  
**Total Pages**: 24 pages, 3 documents created/updated

