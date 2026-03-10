# HotelloSys - Complete Development Plan & Setup Guide

**Project**: BUYZA Hotel Management System (BuHoMaS)  
**Software Name**: HotelloSys  
**Company**: BUYZA Inc.  
**Document Created**: January 24, 2026  
**Last Updated**: February 13, 2026 ← **6 MAJOR FEATURES ADDED**  
**Timeline**: ~15 months (66 weeks) - **UPDATED from 12 months**  
**Development Team**: Solo Developer  
**Status**: Requirements Finalized, Ready for Phase 1 Start

### **📢 NEW FEATURES ADDED (February 13, 2026)**
✅ **Modular System** - Customers purchase only the modules they need (Rooms, Restaurant, Bar)  
✅ **License Management** - One license key per PC prevents piracy  
✅ **Department Management** - Hotel owners can add, edit, and delete departments  
✅ **Mobile App** - iOS & Android app for customer bookings  
✅ **Down-Payment System** - Non-refundable down-payments with countdown timers  
✅ **Cross-Hotel Synchronization** - Unified customer profiles & loyalty across multiple hotels  

**📚 See New Documentation**:  
→ [MODULAR_LICENSING_MOBILE_ARCHITECTURE.md](MODULAR_LICENSING_MOBILE_ARCHITECTURE.md) - Complete technical architecture  
→ [BUSINESS_REQUIREMENTS_UPDATE_FEB2026.md](BUSINESS_REQUIREMENTS_UPDATE_FEB2026.md) - Detailed requirements  
→ [IMPLEMENTATION_CHECKLIST_NEW_FEATURES.md](IMPLEMENTATION_CHECKLIST_NEW_FEATURES.md) - Week-by-week plan

---

## TABLE OF CONTENTS
1. [Project Overview](#project-overview)
2. [Clarifying Questions & Answers](#clarifying-questions--answers)
3. [Preliminary Technology Recommendations](#preliminary-technology-recommendations)
4. [System Architecture Overview](#system-architecture-overview)
5. [Initial Project Phases](#initial-project-phases)
6. [Complete Setup & Installation Guide](#complete-setup--installation-guide)
7. [Detailed Database Schema](#detailed-database-schema)
8. [Complete Project Structure](#complete-project-structure)
9. [Sample Code with Full Paths](#sample-code-with-full-paths)
10. [Development Roadmap with Time Estimates](#development-roadmap-with-time-estimates)

---

## PROJECT OVERVIEW

### **Project Description**
HotelloSys is an enterprise-grade, modular Hotel Management System designed to centralize and automate all hotel operations. The system manages room reservations, restaurant orders, bar operations, inventory, employee management, billing, invoicing, customer relationships, and comprehensive reporting.

**Key Enhancement (February 2026)**: Hotels can now purchase individual modules (Rooms, Restaurant, Bar) with flexible licensing, and customers can access a mobile app for bookings with real-time synchronization across hotel chains.

### **Core Modules (Modular System - Choose What You Need)**
1. **Rooms Reservations Module** (Optional, $499/year) - Complete booking and room management system  
2. **Restaurant Operations Module** (Optional, $399/year) - Food and drink ordering system  
3. **Bar Operations Module** (Optional, $299/year) - Drinks ordering system  
4. **Core/Shared Features** (Always Included) - Authentication, Employees, Departments, Billing, Reporting, Loyalty

**License Control**: Each installation gets one license key (per PC). Hotels can enable/disable modules based on their license purchase

### **Key Capabilities**
- Inventory management for food and drinks
- Room reservations and management
- Employee management (all hotel staff types)
- Bills and invoices generation
- Customer management and ranking
- Loyalty points system
- Employee and hotel reporting (daily, weekly, monthly, quarterly, semi-annual, annual)
- Employee transaction tracking and audit trails
- Subscription plan management

---

## CLARIFYING QUESTIONS & ANSWERS

### **1. Platform & Deployment**

| Question | Answer | Implication |
|----------|--------|-------------|
| **Operating System** | Windows-only | UI framework: WPF (Windows Presentation Foundation) |
| **Single Location or Multi-Hotel** | Single location (Premium: Multi-Hotel) | Database design must support multi-tenancy for future expansion |
| **Network Setup** | Local Network/LAN (Premium: Cloud Services) | Version 1.0: Local database on hotel network; Cloud version can be Phase 6 |

### **2. Database & Data**

| Question | Answer | Implication |
|----------|--------|-------------|
| **Database Preference** | PostgreSQL (already installed) | Use PostgreSQL for dev; MySQL/SQL Server Express as alternatives |
| **Multi-User Access** | 30-100 employees simultaneously | Must handle concurrent connections efficiently |
| **Data Backup** | Daily backup required | Implement automated backup scheduler in application |

### **3. Development Timeline & Resources**

| Question | Answer | Implication |
|----------|--------|-------------|
| **Timeline** | ~15 months (66 weeks) with new features | Extended timeline includes new mobile app phase (Phase 13) |
| **Development Team** | Solo developer | All tasks fall on one person; need clear modular approach |
| **Budget** | Self-funded | Use only free/open-source tools; no commercial licenses required |

### **4. Additional Features**

| Question | Answer | Implication |
|----------|--------|-------------|
| **POS Integration** | Yes, with existing POS terminals | Must design API for payment gateway integration |
| **Printing** | Thermal (receipts) + Regular (reports) | Support multiple printer types in application |
| **Mobile Access** | Yes, for manager reports | Develop mobile-friendly web dashboard or mobile app (Phase 5) |
| **Multi-Language Support** | Yes | Implement localization framework from day one |
| **Barcode/QR Tracking** | Optional (enable/disable feature) | Must design toggle-able barcode scanning module |

### **5. Compliance & Security**

| Question | Answer | Implication |
|----------|--------|-------------|
| **User Permissions** | RBAC: Admin, Manager, Staff, Guest | Implement fine-grained permission system in database |
| **Data Privacy** | GDPR + Local compliance support | Design system to be GDPR-compliant; add localization for regulations |
| **Audit Trail** | Yes, track all changes | Log all user actions with timestamp, user ID, action type, old/new values |

---

## PRELIMINARY TECHNOLOGY RECOMMENDATIONS

### **Final Recommended Tech Stack**

| Component | Technology | Version | Why |
|-----------|-----------|---------|-----|
| **Language** | C# | 12.0 | Enterprise-grade, strong OOP, excellent IDE support, Windows-native |
| **Framework** | .NET | 8.0 (LTS) | Modern, cross-platform ready, excellent performance, long-term support |
| **Desktop UI** | WPF (MVVM) | Built-in | Professional desktop apps, data binding, MVVM pattern support |
| **Database** | PostgreSQL | 15+ | Robust, free, excellent for multi-user environments, powerful features |
| **ORM** | Entity Framework Core | 8.0 | Type-safe database access, LINQ, automatic migrations, free |
| **Mobile/Web** | ASP.NET Core + Angular/React | 8.0 | Responsive dashboards for managers, mobile-friendly |
| **Reporting** | SSRS / Crystal Reports / FastReport | - | Professional report generation, PDF export, scheduling |
| **IDE** | Visual Studio Community | 2022+ | Free, full-featured, excellent C#/.NET support, debugger |
| **Version Control** | Git + GitHub/GitLab | - | Free, industry standard, version tracking |
| **Testing** | xUnit + Moq | - | Unit testing, mocking, free |
| **Authentication** | Custom DB + Windows Auth | - | Role-based access control, employee management |
| **Printing** | System.Drawing + iTextSharp | - | Handle both thermal and regular printers |
| **Localization** | RESX files + CultureInfo | - | Multi-language support, easy to add languages |
| **Barcode** | ZXing.Net | - | Free, open-source barcode/QR code generation |
| **API Integration** | RestSharp / HttpClient | - | POS and payment gateway integration |
| **Backup** | SQL backup scripts + File backup | - | Automated daily backups via Windows Task Scheduler |

### **Why This Stack?**

✅ **All Free Tools** - No licensing costs  
✅ **Enterprise-Grade** - Used in production by Fortune 500 companies  
✅ **Solo Developer Friendly** - Excellent documentation, large community  
✅ **Scalable** - Can add web/mobile modules later  
✅ **Performance** - Handles 30-100 concurrent users efficiently  
✅ **Windows-Native** - Leverages Windows ecosystem  
✅ **Long-Term Support** - .NET 8 has LTS until November 2026  

---

## SYSTEM ARCHITECTURE OVERVIEW

### **High-Level Architecture Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                    HotelloSys Application                        │
├─────────────────────────────────────────────────────────────────┤
│                     PRESENTATION LAYER (WPF)                    │
│  ┌─────────────┬─────────────┬──────────┬──────────┬──────────┐ │
│  │  Dashboard  │ Rooms Mgmt  │Restaurant│Bar Mgmt  │Inventory │ │
│  │ Employee    │ Customers   │ Billing  │ Reports  │ Settings │ │
│  └─────────────┴─────────────┴──────────┴──────────┴──────────┘ │
├─────────────────────────────────────────────────────────────────┤
│              BUSINESS LOGIC LAYER (Services/Managers)            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ReservationService  │ InventoryService                    │  │
│  │ BillingService      │ EmployeeService                     │  │
│  │ ReportingService    │ AuthenticationService               │  │
│  │ CustomerService     │ BackupService                       │  │
│  │ PrintingService     │ LocalizationService                 │  │
│  └──────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│         DATA ACCESS LAYER (Entity Framework Core + LINQ)        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ DbContext → Repositories → Database Models               │  │
│  └──────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│              DATABASE LAYER (PostgreSQL)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Hotels │ Employees │ Rooms │ Reservations │ Inventory    │  │
│  │ Menus │ Orders │ Invoices │ Customers │ AuditLogs       │  │
│  │ Transactions │ Reports │ SubscriptionPlans │ Settings    │  │
│  └──────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│            EXTERNAL INTEGRATIONS                                │
│  ┌──────────────────┬──────────────────┬────────────────────┐  │
│  │ POS Systems      │ Payment Gateways │ Printer Drivers    │  │
│  │ Email Service    │ Backup Storage   │ Cloud Services*    │  │
│  └──────────────────┴──────────────────┴────────────────────┘  │
│  * For Premium version                                          │
└─────────────────────────────────────────────────────────────────┘
```

### **Key Design Patterns**

1. **MVVM Pattern** - For WPF UI (Model-View-ViewModel)
2. **Repository Pattern** - For data access abstraction
3. **Dependency Injection** - For loose coupling and testability
4. **Service Layer Pattern** - For business logic isolation
5. **Factory Pattern** - For object creation (Printers, Reports, etc.)
6. **Observer Pattern** - For real-time inventory and order updates

### **Module Breakdown**

#### **Module 1: Core System (Foundation)**
- Employee authentication & authorization
- User role management
- Hotel configuration & settings
- System administration dashboard

#### **Module 2: Room Management**
- Room inventory & status tracking
- Room types and pricing
- Maintenance scheduling
- Room assignments

#### **Module 3: Reservations**
- Room booking system
- Reservation management
- Guest information management
- Check-in/Check-out workflow
- Reservation reports

#### **Module 4: Restaurant Operations**
- Menu management
- Order creation & management
- Kitchen display system (KDS)
- Order fulfillment tracking
- Restaurant inventory

#### **Module 5: Bar Operations**
- Bar menu management
- Drink ordering
- Bar inventory
- Order tracking

#### **Module 6: Inventory Management**
- Stock tracking (food, drinks, supplies)
- Barcode/QR code scanning
- Low stock alerts
- Inventory adjustment
- Supplier management
- Stock history & audit trail

#### **Module 7: Billing & Invoicing**
- Bill generation
- Multiple payment methods
- Tax calculation
- Invoice printing (thermal/regular)
- Payment reconciliation
- Outstanding bills tracking

#### **Module 8: Customer Management**
- Customer profiles
- Customer history & preferences
- Loyalty points system
- Customer ranking (VIP, regular, etc.)
- Customer analytics

#### **Module 9: Employee Management**
- Employee profiles & credentials
- Department assignments
- Role & permission management
- Performance tracking
- Employee sales tracking

#### **Module 10: Reporting & Analytics**
- Daily/weekly/monthly/quarterly/semi-annual/annual reports
- Employee performance reports
- Revenue reports
- Occupancy reports
- Inventory reports
- Customer analytics
- Export to PDF/Excel

#### **Module 11: Audit & Compliance**
- Complete audit trail of all changes
- User activity logging
- Data modification history
- GDPR compliance features
- Backup & recovery

#### **Module 12: System Administration**
- Backup scheduling & management
- User management
- System settings
- Database maintenance
- License/subscription management
- Printer configuration
- Language/localization settings

---

## INITIAL PROJECT PHASES

### **Phase 1: Foundation & Core System (Month 1-2)**
**Duration**: 6-8 weeks  
**Focus**: Set up development environment, database, authentication, basic UI structure

**Deliverables**:
- [ ] Development environment fully configured
- [ ] Database schema created in PostgreSQL
- [ ] Project structure and namespaces organized
- [ ] WPF application shell with MVVM structure
- [ ] Employee login/authentication system
- [ ] Role-based access control (RBAC) implementation
- [ ] Hotel configuration wizard
- [ ] Basic dashboard UI
- [ ] Logging and error handling framework
- [ ] Unit testing setup

**Key Components**:
- `HotelloSys.Core` - Core services and models
- `HotelloSys.Data` - Database context and repositories
- `HotelloSys.UI` - WPF views and view models
- `HotelloSys.Tests` - Unit tests

---

### **Phase 2: Employee & Hotel Management (Month 2-3)**
**Duration**: 4-5 weeks  
**Focus**: Complete employee management and hotel administration features

**Deliverables**:
- [ ] Employee CRUD operations (Create, Read, Update, Delete)
- [ ] Employee profile management
- [ ] Department management
- [ ] Employee credentials management
- [ ] Photo storage and retrieval
- [ ] Employee transaction tracking
- [ ] Admin user management interface
- [ ] Employee search and filtering
- [ ] Employee reports
- [ ] Audit trail for employee changes

**Key Features**:
- Add/Edit/Delete employees
- Employee directory with photos
- Department hierarchy
- Permission assignment per role
- Employee performance tracking

---

### **Phase 3: Room Management & Reservations (Month 3-5)**
**Duration**: 6-7 weeks  
**Focus**: Room inventory and reservation system

**Deliverables**:
- [ ] Room types creation and management
- [ ] Room inventory setup
- [ ] Room status management (available, occupied, maintenance, etc.)
- [ ] Reservation creation and management
- [ ] Calendar view for room availability
- [ ] Guest information management
- [ ] Check-in/Check-out workflow
- [ ] Reservation confirmation printing
- [ ] Reservation reports
- [ ] Cancellation and modification handling
- [ ] Advance booking management

**Key Features**:
- Visual room availability calendar
- Overbooking prevention
- Length of stay tracking
- Seasonal pricing support
- Guest preferences tracking

---

### **Phase 4: Restaurant Module (Month 5-7)**
**Duration**: 6-7 weeks  
**Focus**: Food ordering and restaurant operations

**Deliverables**:
- [ ] Menu item creation and management
- [ ] Category management (appetizers, main courses, desserts, etc.)
- [ ] Item pricing and special pricing
- [ ] Order creation interface
- [ ] Kitchen display system (KDS)
- [ ] Order status tracking
- [ ] Order modification
- [ ] Order cancellation handling
- [ ] Restaurant inventory management
- [ ] Order reports
- [ ] Menu PDF generation for printing

**Key Features**:
- Quick order entry
- Special instructions/notes for items
- Order grouping by table/room
- Rush order highlighting
- Delivery time estimation

---

### **Phase 5: Bar Module & Inventory System (Month 7-9)**
**Duration**: 6-7 weeks  
**Focus**: Bar operations and comprehensive inventory management

**Deliverables**:
- [ ] Bar menu management
- [ ] Drink ordering system
- [ ] Bar-specific inventory tracking
- [ ] General inventory management (food + drinks)
- [ ] Barcode/QR code system (optional feature)
- [ ] Stock adjustment
- [ ] Low stock alerts
- [ ] Supplier management
- [ ] Purchase orders
- [ ] Stock history and audit trail
- [ ] Inventory reports
- [ ] Stock level forecasting

**Key Features**:
- Barcode scanning for stock intake/usage
- Inventory adjustment with approval workflow
- Expiry date tracking
- Storage location management
- Stock value calculations

---

### **Phase 6: Billing, Invoicing & Payments (Month 9-10)**
**Duration**: 4-5 weeks  
**Focus**: Complete billing system with multiple payment methods

**Deliverables**:
- [ ] Bill generation from room, restaurant, and bar orders
- [ ] Invoice template creation
- [ ] Multiple payment method support
- [ ] Tax and service charge calculation
- [ ] Discount application
- [ ] Bill printing (thermal and regular printers)
- [ ] Bill modification and correction
- [ ] Payment reconciliation
- [ ] Outstanding bills tracking
- [ ] Bill history and search
- [ ] Payment method reporting

**Key Features**:
- Combined bills from multiple services
- Partial payment support
- Payment plan support
- Automatic bill email to guests
- Subscription plan invoicing

---

### **Phase 7: Customer Management & Loyalty System (Month 10-11)**
**Duration**: 3-4 weeks  
**Focus**: Customer relationship and loyalty points

**Deliverables**:
- [ ] Customer profile creation and management
- [ ] Customer history tracking
- [ ] Loyalty points system
- [ ] Points calculation based on spending
- [ ] Points redemption
- [ ] Customer ranking (VIP, regular, occasional, etc.)
- [ ] Customer preferences tracking
- [ ] Customer contact management
- [ ] Customer communication history
- [ ] Customer analytics reports
- [ ] Birthday/anniversary tracking

**Key Features**:
- Automatic customer profile creation from reservations
- Points expiry management
- Tiered loyalty levels
- Personalized offers based on history
- Customer lifetime value calculation

---

### **Phase 8: Reporting & Analytics (Month 11-12)**
**Duration**: 3-4 weeks  
**Focus**: Comprehensive reporting system

**Deliverables**:
- [ ] Daily transaction reports (sales, occupancy, etc.)
- [ ] Weekly summary reports
- [ ] Monthly financial reports
- [ ] Quarterly performance analysis
- [ ] Semi-annual reports
- [ ] Annual reports
- [ ] Employee performance reports
- [ ] Department-wise reports
- [ ] Revenue reports (by room, restaurant, bar, etc.)
- [ ] Occupancy reports
- [ ] Inventory consumption reports
- [ ] Customer analytics reports
- [ ] Tax/compliance reports
- [ ] PDF and Excel export functionality
- [ ] Report scheduling and email delivery

**Key Features**:
- Interactive dashboards
- Date range selection for custom reports
- Filter by department/employee/customer
- Graphical charts and visualizations
- Report templates for different user types

---

### **Phase 9: Mobile Access & Web Dashboard (Month 12+)**
**Duration**: 4-6 weeks (Phase 5 for premium features)  
**Focus**: Manager access to reports and key metrics from mobile devices

**Deliverables**:
- [ ] ASP.NET Core Web API
- [ ] Responsive web dashboard (Angular/React)
- [ ] Mobile-friendly report views
- [ ] Real-time metrics display
- [ ] Quick action buttons
- [ ] Notification system
- [ ] Single sign-on (SSO) integration
- [ ] API documentation

**Key Features**:
- View occupancy status in real-time
- Revenue metrics at a glance
- Alert notifications (low stock, pending payments, etc.)
- Report access and downloads
- Employee shift management

---

### **Phase 10: Audit Trail, Compliance & Advanced Security (Month 12+)**
**Duration**: 2-3 weeks  
**Focus**: Complete audit trail and compliance features

**Deliverables**:
- [ ] Comprehensive audit trail implementation
- [ ] User activity logging
- [ ] Data modification history
- [ ] Change reason tracking
- [ ] GDPR compliance features
- [ ] Data retention policies
- [ ] User access logs
- [ ] Sensitive data encryption
- [ ] Password policy enforcement
- [ ] Two-factor authentication (optional)
- [ ] Compliance report generation

**Key Features**:
- Immutable audit logs
- Search audit history by date, user, action type
- Data export compliance
- Right to deletion workflow
- Data anonymization options

---

### **Phase 11: Testing, Optimization & Bug Fixes (Throughout)**
**Duration**: Continuous (2-3 hours/week)  
**Focus**: Quality assurance and performance optimization

**Activities**:
- [ ] Unit testing for core business logic
- [ ] Integration testing for database operations
- [ ] UI testing and usability improvements
- [ ] Performance testing with 50+ concurrent users
- [ ] Database query optimization
- [ ] Memory leak detection and fixes
- [ ] Code refactoring
- [ ] Security vulnerability scanning
- [ ] Load testing
- [ ] User acceptance testing (UAT) preparation

---

### **Phase 12: Backup, Disaster Recovery & Deployment (Month 12+)**
**Duration**: 2-3 weeks  
**Focus**: Automated backup and disaster recovery

**Deliverables**:
- [ ] Automated daily backup system
- [ ] Backup encryption
- [ ] Backup storage (local + external)
- [ ] Restore functionality and testing
- [ ] Disaster recovery plan
- [ ] Database migration tools
- [ ] Upgrade mechanism for future versions
- [ ] Installation wizard for hotels
- [ ] Deployment documentation
- [ ] Training material generation

**Key Features**:
- Scheduled backups (daily, configurable time)
- Full + incremental backup support
- One-click restore functionality
- Backup verification
- Archive old backups

---

### **Phase 13: Mobile App Development (Weeks 53-66) 🆕 NEW**
**Duration**: 14 weeks  
**Focus**: iOS & Android mobile app for customers

**Deliverables**:
- [ ] .NET MAUI project setup
- [ ] Hotel listing page with filters
- [ ] Room search and availability
- [ ] Room details with photos
- [ ] Reservation creation
- [ ] Down-payment processing
- [ ] Room hold countdown timer
- [ ] Customer profile management
- [ ] Loyalty points display (per hotel)
- [ ] Hotel rating system
- [ ] Push notifications
- [ ] Cross-hotel synchronization
- [ ] iOS App Store submission
- [ ] Google Play Store submission
- [ ] Automated backups integration
- [ ] Comprehensive testing

**Key Features**:
- .NET MAUI (works on iOS & Android)
- Real-time availability sync
- Offline support (cached data)
- Push notifications for bookings
- One customer profile across all hotels
- Hotel ratings and reviews
- Loyalty points tracking per hotel

**Technology Stack**:
- **Framework**: .NET MAUI (cross-platform)
- **Language**: C# 12.0
- **Targeted Platforms**: iOS 14+ and Android 8.0+
- **API**: Calls desktop HotelloSys installations
- **Local Storage**: SQLite for offline mode

**Implementation Website**:
See detailed plan in [IMPLEMENTATION_CHECKLIST_NEW_FEATURES.md](IMPLEMENTATION_CHECKLIST_NEW_FEATURES.md#phase-13-mobile-app-development-weeks-53-66-)

---

## COMPLETE SETUP & INSTALLATION GUIDE

### **STEP 1: Install Required Software**

#### **1.1 Install .NET 8 SDK**

**Download Link**: https://dotnet.microsoft.com/en-us/download/dotnet/8.0

**Steps**:
1. Go to https://dotnet.microsoft.com/en-us/download/dotnet/8.0
2. Download **".NET 8.0 SDK"** (not Runtime) - Choose Windows x64 (for most computers)
   - File will be named: `dotnet-sdk-8.0.x-win-x64.exe`
3. Double-click the downloaded .exe file
4. Click **"Install"** when prompted
5. Click **"Close"** when installation completes
6. **Verify Installation**:
   - Open Command Prompt (type `cmd` in Windows search)
   - Type: `dotnet --version`
   - Should display: `8.0.x` or higher

---

#### **1.2 Install Visual Studio Community 2022**

**Download Link**: https://visualstudio.microsoft.com/download/

**Steps**:
1. Go to https://visualstudio.microsoft.com/download/
2. Download **"Visual Studio Community 2022"** (free)
3. Run the installer (`VisualStudioSetup.exe`)
4. Click **"Continue"**
5. **Select Workloads** (check these):
   - ✅ **Desktop Development with C++**
   - ✅ **Desktop Development with .NET**
   - ✅ **Data storage and processing**
   - ✅ **Web Development with ASP.NET**
6. Click **"Install"** and wait (may take 10-30 minutes)
7. Click **"Launch"** when complete
8. Sign in with Microsoft Account (free or create one)

**What to install**:
- C# language features
- WPF designer
- Entity Framework Core tools
- SQL Server tools
- Git integration

---

#### **1.3 Install PostgreSQL Database**

**You mentioned PostgreSQL is already installed**, but here's the verification process:

**If not installed, download**: https://www.postgresql.org/download/windows/

**Verify Installation**:
1. Open Command Prompt
2. Type: `psql --version`
3. Should display: `psql (PostgreSQL) 15.x` or higher

**If you need to install/reinstall**:
1. Download PostgreSQL from https://www.postgresql.org/download/
2. Run installer
3. **Important Options During Installation**:
   - Database superuser password: **Remember this!** (e.g., "postgres")
   - Port: **5432** (default)
   - Default locale: **English**
4. Complete installation

**Verify PostgreSQL Service**:
1. Open Services (type `services.msc` in Windows search)
2. Look for **"postgresql-x64-15"** (version number may vary)
3. Should show **Status: Running**

---

#### **1.4 Install Git for Version Control**

**You mentioned Git is already installed** If not, then:

**Download**: https://git-scm.com/download/win

**Steps**:
1. Download **Git for Windows** (64-bit)
2. Run installer, click **Next** through all steps (default options are fine)
3. On "Choosing the default editor" step: Select **Notepad++** or **Visual Studio Code**
4. Complete installation
5. **Verify**:
   - Open Command Prompt
   - Type: `git --version`
   - Should display: `git version 2.x.x`

---

#### **1.5 Install Visual Studio Code (Optional, for code editing)**

**You mentioned Visual Studio Code is already installed** If not, then:

**Download**: https://code.visualstudio.com/

**Steps**:
1. Download the **Windows Installer**
2. Run installer and click **Install**
3. Check "Add to PATH" option
4. Complete installation
5. Open VS Code and install extensions:
   - C# (by Microsoft)
   - Entity Framework Core Power Tools
   - PostgreSQL Tools
   - SQLTools

---

### **STEP 2: Create Project Directory Structure**

1. **Open Command Prompt** (type `cmd` in Windows search)

2. **Navigate to your working directory**:
   ```bash
   cd C:\Users\Admin\OneDrive\Desktop\BuyzaProject\BuHoMaS
   ```

3. **Create project folder**:
   ```bash
   mkdir HotelloSys
   cd HotelloSys
   ```

4. **Create solution structure**:
   ```bash
   mkdir src
   mkdir tests
   mkdir docs
   mkdir scripts
   cd src
   ```

---

### **STEP 3: Create .NET Solution**

1. **From inside `src` directory**, run:
   ```bash
   dotnet new sln -n HotelloSys
   ```

2. **Create Projects** (run these commands in sequence):

   **Core Project**:
   ```bash
   dotnet new classlib -n HotelloSys.Core
   ```

   **Data Access Project**:
   ```bash
   dotnet new classlib -n HotelloSys.Data
   ```

   **WPF UI Project**:
   ```bash
   dotnet new wpf -n HotelloSys.UI
   ```

   **Web API Project** (for mobile/web access):
   ```bash
   dotnet new webapi -n HotelloSys.API
   ```

   **Tests Project**:
   ```bash
   dotnet new xunit -n HotelloSys.Tests
   ```

3. **Add Projects to Solution**:
   ```bash
   dotnet sln HotelloSys.sln add HotelloSys.Core/HotelloSys.Core.csproj
   dotnet sln HotelloSys.sln add HotelloSys.Data/HotelloSys.Data.csproj
   dotnet sln HotelloSys.sln add HotelloSys.UI/HotelloSys.UI.csproj
   dotnet sln HotelloSys.sln add HotelloSys.API/HotelloSys.API.csproj
   dotnet sln HotelloSys.sln add HotelloSys.Tests/HotelloSys.Tests.csproj
   ```

4. **Add Project References**:
   ```bash
   dotnet add HotelloSys.UI/HotelloSys.UI.csproj reference HotelloSys.Core/HotelloSys.Core.csproj
   dotnet add HotelloSys.UI/HotelloSys.UI.csproj reference HotelloSys.Data/HotelloSys.Data.csproj
   dotnet add HotelloSys.API/HotelloSys.API.csproj reference HotelloSys.Core/HotelloSys.Core.csproj
   dotnet add HotelloSys.API/HotelloSys.API.csproj reference HotelloSys.Data/HotelloSys.Data.csproj
   dotnet add HotelloSys.Data/HotelloSys.Data.csproj reference HotelloSys.Core/HotelloSys.Core.csproj
   dotnet add HotelloSys.Tests/HotelloSys.Tests.csproj reference HotelloSys.Core/HotelloSys.Core.csproj
   ```

---

### **STEP 4: Install Required NuGet Packages**

From the `src` directory, run these commands:

```bash
# For HotelloSys.Data (Database & ORM)
dotnet add HotelloSys.Data/HotelloSys.Data.csproj package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add HotelloSys.Data/HotelloSys.Data.csproj package Microsoft.EntityFrameworkCore
dotnet add HotelloSys.Data/HotelloSys.Data.csproj package Microsoft.EntityFrameworkCore.Tools

# For HotelloSys.Core (Utilities & Services)
dotnet add HotelloSys.Core/HotelloSys.Core.csproj package Microsoft.Extensions.DependencyInjection
dotnet add HotelloSys.Core/HotelloSys.Core.csproj package Microsoft.Extensions.Logging
dotnet add HotelloSys.Core/HotelloSys.Core.csproj package Newtonsoft.Json

# For HotelloSys.UI (WPF & UI utilities)
dotnet add HotelloSys.UI/HotelloSys.UI.csproj package Microsoft.Xaml.Behaviors.Wpf
dotnet add HotelloSys.UI/HotelloSys.UI.csproj package MvvmLightLibs
dotnet add HotelloSys.UI/HotelloSys.UI.csproj package System.Drawing.Common

# For HotelloSys.API (Web API)
dotnet add HotelloSys.API/HotelloSys.API.csproj package Microsoft.AspNetCore.Mvc
dotnet add HotelloSys.API/HotelloSys.API.csproj package Swashbuckle.AspNetCore

# For Testing
dotnet add HotelloSys.Tests/HotelloSys.Tests.csproj package Moq
dotnet add HotelloSys.Tests/HotelloSys.Tests.csproj package FluentAssertions
```

---

### **STEP 5: Open Solution in Visual Studio**

1. **Navigate to solution**:
   ```bash
   cd C:\Users\Admin\OneDrive\Desktop\BuyzaProject\BuHoMaS\src
   ```

2. **Open in Visual Studio**:
   ```bash
   start HotelloSys.sln
   ```
   OR
   - Open Visual Studio Community
   - Click **"Open a project or solution"**
   - Navigate to `C:\Users\Admin\OneDrive\Desktop\BuyzaProject\BuHoMaS\src\HotelloSys.sln`
   - Click **"Open"**

3. **Wait for solution to load** (may take 2-3 minutes first time)

---

### **STEP 6: Create PostgreSQL Database**

1. **Open Command Prompt**

2. **Connect to PostgreSQL**:
   ```bash
   psql -U postgres
   ```
   (Enter password when prompted)

3. **Create HotelloSys database**:
   ```sql
   CREATE DATABASE hotello_sys;
   ```

4. **Exit psql**:
   ```sql
   \q
   ```

---

### **STEP 7: Configure Database Connection String**

1. **In Visual Studio**, open `HotelloSys.Data` project
2. **Create file** `appsettings.json` in root of `HotelloSys.Data`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=hotello_sys;Username=postgres;Password=YOUR_POSTGRES_PASSWORD"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

**Replace `YOUR_POSTGRES_PASSWORD`** with your PostgreSQL password.

---

### **STEP 8: Build and Test Solution**

1. **In Visual Studio**: Press **Ctrl+Shift+B** to build
   - Should build without errors
   - May see warnings (that's OK for now)

2. **Run WPF Application**: Press **F5** or click **"Start"** button
   - Should launch a blank WPF window
   - Close it for now (we'll add UI later)

---

## DETAILED DATABASE SCHEMA

### **Database Design Overview**

The HotelloSys database is designed following these principles:
- **Normalization**: Third Normal Form (3NF) to reduce redundancy
- **Scalability**: Can handle multiple hotels with multi-tenancy
- **Audit Trail**: All tables track creation/modification user and timestamp
- **Referential Integrity**: Foreign keys to maintain data consistency
- **Performance**: Proper indexing on frequently queried columns

### **Database Tables and Relationships**

#### **1. Hotels (Multi-tenancy Support)**

```sql
CREATE TABLE Hotels (
    HotelID SERIAL PRIMARY KEY,
    HotelName VARCHAR(255) NOT NULL UNIQUE,
    Address VARCHAR(500),
    City VARCHAR(100),
    Country VARCHAR(100),
    PostalCode VARCHAR(20),
    PhoneNumber VARCHAR(20),
    Email VARCHAR(255),
    Website VARCHAR(255),
    RegistrationNumber VARCHAR(100),
    TaxID VARCHAR(50),
    SubscriptionType VARCHAR(50), -- 'Basic' or 'Premium'
    SubscriptionStartDate DATE,
    SubscriptionEndDate DATE,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
```

**Purpose**: Stores hotel information; supports future multi-hotel deployment

---

#### **2. Employees (Staff Management)**

```sql
CREATE TABLE Employees (
    EmployeeID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Email VARCHAR(255),
    PhoneNumber VARCHAR(20),
    DepartmentID INT NOT NULL REFERENCES Departments(DepartmentID),
    RoleID INT NOT NULL REFERENCES Roles(RoleID),
    Title VARCHAR(100),
    Gender VARCHAR(10),
    DateOfBirth DATE,
    NationalIDNumber VARCHAR(50),
    JoinDate DATE NOT NULL,
    EndDate DATE,
    PhotoPath VARCHAR(500),
    Username VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    IsActive BOOLEAN DEFAULT TRUE,
    LastLoginDate TIMESTAMP,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
```

**Purpose**: Employee records with login credentials and department assignment

---

#### **3. Departments**

```sql
CREATE TABLE Departments (
    DepartmentID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    DepartmentName VARCHAR(100) NOT NULL,
    DepartmentDescription VARCHAR(500),
    ManagerID INT REFERENCES Employees(EmployeeID),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
```

**Departments**: Front Desk, Housekeeping, Restaurant, Bar, Kitchen, Maintenance, Admin, Finance

---

#### **4. Roles & Permissions**

```sql
CREATE TABLE Roles (
    RoleID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    RoleName VARCHAR(100) NOT NULL,
    RoleDescription VARCHAR(500),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);

CREATE TABLE RolePermissions (
    RolePermissionID SERIAL PRIMARY KEY,
    RoleID INT NOT NULL REFERENCES Roles(RoleID),
    PermissionCode VARCHAR(100) NOT NULL,
    PermissionName VARCHAR(200),
    CanCreate BOOLEAN DEFAULT FALSE,
    CanRead BOOLEAN DEFAULT FALSE,
    CanUpdate BOOLEAN DEFAULT FALSE,
    CanDelete BOOLEAN DEFAULT FALSE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Roles**: Admin, Manager, Front Desk Staff, Waiter, Bartender, Chef, Housekeeping Staff, Accountant

---

#### **5. Rooms (Room Inventory)**

```sql
CREATE TABLE RoomTypes (
    RoomTypeID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    TypeName VARCHAR(100) NOT NULL,
    TypeDescription VARCHAR(500),
    BasePrice DECIMAL(10, 2) NOT NULL,
    Capacity INT,
    Amenities VARCHAR(500),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);

CREATE TABLE Rooms (
    RoomID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    RoomTypeID INT NOT NULL REFERENCES RoomTypes(RoomTypeID),
    RoomNumber VARCHAR(20) NOT NULL UNIQUE,
    Floor INT,
    RoomStatus VARCHAR(20) DEFAULT 'Available', -- Available, Occupied, Maintenance, Cleaning
    LastMaintenanceDate DATE,
    NextMaintenanceDate DATE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
```

**Status Values**: Available, Occupied, Maintenance, Cleaning, Do Not Disturb

---

#### **6. Reservations**

```sql
CREATE TABLE Reservations (
    ReservationID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    CustomerID INT REFERENCES Customers(CustomerID),
    RoomID INT NOT NULL REFERENCES Rooms(RoomID),
    CheckInDate DATE NOT NULL,
    CheckOutDate DATE NOT NULL,
    NumberOfGuests INT,
    ReservationStatus VARCHAR(20) DEFAULT 'Confirmed', -- Confirmed, Checked In, Checked Out, Cancelled
    SpecialRequests VARCHAR(500),
    BookingDate DATE NOT NULL,
    BookedByEmployeeID INT REFERENCES Employees(EmployeeID),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);

CREATE TABLE ReservationGuests (
    ReservationGuestID SERIAL PRIMARY KEY,
    ReservationID INT NOT NULL REFERENCES Reservations(ReservationID),
    GuestName VARCHAR(200) NOT NULL,
    GuestEmail VARCHAR(255),
    GuestPhoneNumber VARCHAR(20)
);
```

---

#### **7. Customers (Guest Management)**

```sql
CREATE TABLE Customers (
    CustomerID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Email VARCHAR(255),
    PhoneNumber VARCHAR(20),
    Country VARCHAR(100),
    City VARCHAR(100),
    CustomerAddress VARCHAR(500),
    DateOfBirth DATE,
    Gender VARCHAR(10),
    PreferredLanguage VARCHAR(50),
    CustomerTier VARCHAR(20) DEFAULT 'Regular', -- VIP, Regular, Occasional
    TotalSpent DECIMAL(15, 2) DEFAULT 0,
    LoyaltyPoints INT DEFAULT 0,
    LastVisitDate DATE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);

CREATE TABLE CustomerPreferences (
    CustomerPreferenceID SERIAL PRIMARY KEY,
    CustomerID INT NOT NULL REFERENCES Customers(CustomerID),
    PreferenceType VARCHAR(50), -- RoomPreference, FoodAllergies, etc.
    PreferenceValue VARCHAR(255),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

#### **8. MenuItems (Restaurant & Bar)**

```sql
CREATE TABLE MenuCategories (
    MenuCategoryID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    ServiceType VARCHAR(20) NOT NULL, -- 'Restaurant' or 'Bar'
    CategoryName VARCHAR(100) NOT NULL,
    CategoryDescription VARCHAR(500),
    DisplayOrder INT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);

CREATE TABLE MenuItems (
    MenuItemID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    MenuCategoryID INT NOT NULL REFERENCES MenuCategories(MenuCategoryID),
    ItemName VARCHAR(200) NOT NULL,
    ItemDescription VARCHAR(500),
    Price DECIMAL(10, 2) NOT NULL,
    PrepTime INT, -- in minutes
    IsAvailable BOOLEAN DEFAULT TRUE,
    IsVegetarian BOOLEAN DEFAULT FALSE,
    Allergens VARCHAR(255),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
```

---

#### **9. Orders (Restaurant & Bar Orders)**

```sql
CREATE TABLE Orders (
    OrderID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    RoomID INT REFERENCES Rooms(RoomID),
    ServiceType VARCHAR(20) NOT NULL, -- 'Restaurant' or 'Bar'
    OrderStatus VARCHAR(20) DEFAULT 'Pending', -- Pending, Preparing, Ready, Served, Cancelled
    CreatedByEmployeeID INT NOT NULL REFERENCES Employees(EmployeeID),
    CustomerID INT REFERENCES Customers(CustomerID),
    SpecialInstructions VARCHAR(500),
    OrderDate TIMESTAMP NOT NULL,
    CompletionDate TIMESTAMP,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);

CREATE TABLE OrderItems (
    OrderItemID SERIAL PRIMARY KEY,
    OrderID INT NOT NULL REFERENCES Orders(OrderID),
    MenuItemID INT NOT NULL REFERENCES MenuItems(MenuItemID),
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10, 2) NOT NULL,
    SpecialInstructions VARCHAR(255),
    ItemStatus VARCHAR(20) DEFAULT 'Pending', -- Pending, Preparing, Ready, Served
    ServedTime TIMESTAMP,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

#### **10. Inventory (Food & Drinks)**

```sql
CREATE TABLE InventoryCategories (
    InventoryCategoryID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    InventoryCategoryName VARCHAR(100) NOT NULL,
    InventoryCategoryDescription VARCHAR(500)
);

CREATE TABLE InventoryItems (
    InventoryItemID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    InventoryCategoryID INT NOT NULL REFERENCES InventoryCategories(InventoryCategoryID),
    InventoryItemName VARCHAR(200) NOT NULL,
    SKU VARCHAR(100) UNIQUE,
    Barcode VARCHAR(100),
    InventoryItemDescription VARCHAR(500),
    Unit VARCHAR(20), -- 'Piece', 'Kg', 'Liter', 'Box', Pack, Dozen, Crate, etc.
    CurrentStock DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ReorderLevel DECIMAL(10, 2),
    MaxStock DECIMAL(10, 2),
    UnitCost DECIMAL(10, 2),
    SupplierID INT REFERENCES Suppliers(SupplierID),
    ExpiryDate DATE,
    StorageLocation VARCHAR(100),
    IsBarcode Enabled BOOLEAN DEFAULT FALSE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);

CREATE TABLE InventoryTransactions (
    InventoryTransactionID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    InventoryItemID INT NOT NULL REFERENCES InventoryItems(InventoryItemID),
    TransactionType VARCHAR(20) NOT NULL, -- 'In', 'Out', 'Adjustment', 'Wastage'
    Quantity DECIMAL(10, 2) NOT NULL,
    Reference VARCHAR(100), -- Order ID, Adjustment ID, etc.
    Notes VARCHAR(255),
    CreatedByEmployeeID INT NOT NULL REFERENCES Employees(EmployeeID),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Suppliers (
    SupplierID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    SupplierName VARCHAR(200) NOT NULL,
    ContactPerson VARCHAR(100),
    PhoneNumber VARCHAR(20),
    Email VARCHAR(255),
    SupplierAddress VARCHAR(500),
    City VARCHAR(100),
    Country VARCHAR(100),
    PaymentTerms VARCHAR(100),
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
```

---

#### **11. Invoices & Billing**

```sql
CREATE TABLE Invoices (
    InvoiceID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    InvoiceNumber VARCHAR(50) NOT NULL UNIQUE,
    CustomerID INT REFERENCES Customers(CustomerID),
    ReservationID INT REFERENCES Reservations(ReservationID),
    InvoiceDate DATE NOT NULL,
    DueDate DATE,
    PaymentStatus VARCHAR(20) DEFAULT 'Pending', -- Pending, Partial, Paid, Overdue
    Notes VARCHAR(500),
    CreatedByEmployeeID INT NOT NULL REFERENCES Employees(EmployeeID),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);

CREATE TABLE InvoiceLineItems (
    InvoiceLineItemID SERIAL PRIMARY KEY,
    InvoiceID INT NOT NULL REFERENCES Invoices(InvoiceID),
    InvoiceLineItemDescription VARCHAR(255) NOT NULL,
    Quantity DECIMAL(10, 2),
    UnitPrice DECIMAL(10, 2) NOT NULL,
    LineTotal DECIMAL(15, 2) NOT NULL,
    LineType VARCHAR(20), -- 'Room', 'Food', 'Drink', 'Service', 'Tax', 'Discount'
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Payments (
    PaymentID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    InvoiceID INT NOT NULL REFERENCES Invoices(InvoiceID),
    PaymentDate DATE NOT NULL,
    PaymentMethod VARCHAR(50), -- 'Cash', 'Credit Card', 'Debit Card', 'Cheque', 'Bank Transfer', 'Mobile Money'
    Amount DECIMAL(15, 2) NOT NULL,
    ReferenceNumber VARCHAR(100),
    ReceivedByEmployeeID INT NOT NULL REFERENCES Employees(EmployeeID),
    Notes VARCHAR(255),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
```

---

#### **12. Loyalty & Customer Points**

```sql
CREATE TABLE LoyaltyPoints (
    LoyaltyPointID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    CustomerID INT NOT NULL REFERENCES Customers(CustomerID),
    PointsEarned INT,
    PointsRedeemed INT DEFAULT 0,
    TransactionDate DATE NOT NULL,
    ExpiryDate DATE,
    Source VARCHAR(50), -- 'Purchase', 'Bonus', 'Referral'
    RelatedInvoiceID INT REFERENCES Invoices(InvoiceID),
    Notes VARCHAR(255),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT
);

CREATE TABLE RedemptionHistory (
    RedemptionID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    CustomerID INT NOT NULL REFERENCES Customers(CustomerID),
    PointsRedeemed INT NOT NULL,
    DiscountAmount DECIMAL(10, 2),
    RedemptionDate DATE NOT NULL,
    RelatedInvoiceID INT REFERENCES Invoices(InvoiceID),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT
);
```

---

#### **13. Audit Trail**

```sql
CREATE TABLE AuditLogs (
    AuditLogID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    TableName VARCHAR(100) NOT NULL,
    RecordID INT,
    ActionType VARCHAR(20) NOT NULL, -- 'Insert', 'Update', 'Delete'
    ActionByEmployeeID INT NOT NULL REFERENCES Employees(EmployeeID),
    ActionDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ColumnName VARCHAR(100),
    OldValue VARCHAR(MAX),
    NewValue VARCHAR(MAX),
    IPAddress VARCHAR(50),
    ApplicationVersion VARCHAR(20)
);
```

---

#### **14. System Settings & Configuration**

```sql
CREATE TABLE HotelSettings (
    HotelSettingID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    SettingKey VARCHAR(100) NOT NULL UNIQUE,
    SettingValue VARCHAR(500),
    SettingType VARCHAR(50), -- 'String', 'Int', 'Boolean', 'Decimal'
    SettingDescription VARCHAR(255),
    IsSystemSetting BOOLEAN DEFAULT FALSE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP
);

CREATE TABLE PrinterConfiguration (
    PrinterConfigID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    PrinterName VARCHAR(100) NOT NULL,
    PrinterType VARCHAR(20), -- 'Thermal', 'Regular'
    PrinterModel VARCHAR(100),
    NetworkAddress VARCHAR(100),
    Port INT,
    IsDefault BOOLEAN DEFAULT FALSE,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP
);

CREATE TABLE LanguageSettings (
    LanguageSettingID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    LanguageCode VARCHAR(10), -- 'en', 'es', 'fr', 'de', 'pt', 'zh', etc.
    LanguageName VARCHAR(50),
    IsDefault BOOLEAN DEFAULT FALSE,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

#### **15. Subscriptions & Licensing**

```sql
CREATE TABLE SubscriptionPlans (
    SubscriptionPlanID SERIAL PRIMARY KEY,
    PlanName VARCHAR(100) NOT NULL,
    PlanDescription VARCHAR(500),
    Features VARCHAR(MAX), -- JSON array of features
    MaxEmployees INT,
    AllowMultiHotel BOOLEAN DEFAULT FALSE,
    AllowCloudServices BOOLEAN DEFAULT FALSE,
    AnnualPrice DECIMAL(10, 2),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE SubscriptionInvoices (
    SubscriptionInvoiceID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    SubscriptionPlanID INT NOT NULL REFERENCES SubscriptionPlans(SubscriptionPlanID),
    InvoiceNumber VARCHAR(50) NOT NULL UNIQUE,
    InvoiceDate DATE NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    PaymentStatus VARCHAR(20) DEFAULT 'Pending',
    PaymentDate DATE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### **Database Indexes for Performance**

```sql
-- Performance indexes
CREATE INDEX idx_employees_hotel ON Employees(HotelID);
CREATE INDEX idx_employees_username ON Employees(Username);
CREATE INDEX idx_rooms_hotel ON Rooms(HotelID);
CREATE INDEX idx_reservations_hotel_dates ON Reservations(HotelID, CheckInDate, CheckOutDate);
CREATE INDEX idx_customers_hotel ON Customers(HotelID);
CREATE INDEX idx_orders_hotel_status ON Orders(HotelID, OrderStatus);
CREATE INDEX idx_inventory_hotel ON InventoryItems(HotelID);
CREATE INDEX idx_invoices_hotel_status ON Invoices(HotelID, PaymentStatus);
CREATE INDEX idx_audit_logs_hotel_date ON AuditLogs(HotelID, ActionDate);
```

---

## COMPLETE PROJECT STRUCTURE

```
C:\Users\Admin\OneDrive\Desktop\BuyzaProject\BuHoMaS\
│
├── src/
│   ├── HotelloSys.sln                          # Visual Studio Solution file
│   │
│   ├── HotelloSys.Core/                        # Core business logic
│   │   ├── HotelloSys.Core.csproj
│   │   ├── Models/                             # Domain models
│   │   │   ├── Employee.cs
│   │   │   ├── Room.cs
│   │   │   ├── Reservation.cs
│   │   │   ├── Customer.cs
│   │   │   ├── Order.cs
│   │   │   ├── Invoice.cs
│   │   │   ├── InventoryItem.cs
│   │   │   └── ... (other models)
│   │   │
│   │   ├── Services/                           # Business logic services
│   │   │   ├── IAuthenticationService.cs
│   │   │   ├── AuthenticationService.cs
│   │   │   ├── IReservationService.cs
│   │   │   ├── ReservationService.cs
│   │   │   ├── IInventoryService.cs
│   │   │   ├── InventoryService.cs
│   │   │   ├── IBillingService.cs
│   │   │   ├── BillingService.cs
│   │   │   ├── IReportingService.cs
│   │   │   ├── ReportingService.cs
│   │   │   └── ... (other services)
│   │   │
│   │   ├── Enums/                              # Enumeration types
│   │   │   ├── RoomStatus.cs
│   │   │   ├── OrderStatus.cs
│   │   │   ├── PaymentStatus.cs
│   │   │   ├── UserRole.cs
│   │   │   └── ... (other enums)
│   │   │
│   │   ├── Exceptions/                         # Custom exceptions
│   │   │   ├── HotelloSysException.cs
│   │   │   ├── InvalidCredentialsException.cs
│   │   │   ├── InsufficientInventoryException.cs
│   │   │   └── ... (other exceptions)
│   │   │
│   │   ├── Constants/                          # Application constants
│   │   │   ├── AppConstants.cs
│   │   │   ├── ErrorMessages.cs
│   │   │   └── ValidationRules.cs
│   │   │
│   │   └── appsettings.json                   # Configuration file
│   │
│   ├── HotelloSys.Data/                        # Database & data access layer
│   │   ├── HotelloSys.Data.csproj
│   │   ├── Context/
│   │   │   ├── HotelloSysDbContext.cs         # EF Core DbContext
│   │   │   └── HotelloSysDbContextFactory.cs  # For migrations
│   │   │
│   │   ├── Repositories/                       # Repository pattern implementations
│   │   │   ├── IRepository.cs                 # Generic interface
│   │   │   ├── Repository.cs                  # Generic implementation
│   │   │   ├── IEmployeeRepository.cs
│   │   │   ├── EmployeeRepository.cs
│   │   │   ├── IReservationRepository.cs
│   │   │   ├── ReservationRepository.cs
│   │   │   ├── ICustomerRepository.cs
│   │   │   ├── CustomerRepository.cs
│   │   │   └── ... (other repositories)
│   │   │
│   │   ├── Migrations/                        # EF Core migrations
│   │   │   ├── 20260124_InitialCreate.cs
│   │   │   ├── 20260124_AddAuditTables.cs
│   │   │   └── ... (future migrations)
│   │   │
│   │   ├── Configuration/                     # Database seeding
│   │   │   ├── RoleConfiguration.cs
│   │   │   ├── HotelConfiguration.cs
│   │   │   └── SeedData.cs
│   │   │
│   │   └── appsettings.json                   # DB connection string
│   │
│   ├── HotelloSys.UI/                          # WPF Desktop Application
│   │   ├── HotelloSys.UI.csproj
│   │   ├── App.xaml
│   │   ├── App.xaml.cs
│   │   │
│   │   ├── Views/                              # XAML Windows/Pages
│   │   │   ├── MainWindow.xaml
│   │   │   ├── MainWindow.xaml.cs
│   │   │   ├── LoginWindow.xaml
│   │   │   ├── LoginWindow.xaml.cs
│   │   │   ├── DashboardView.xaml
│   │   │   ├── DashboardView.xaml.cs
│   │   │   ├── EmployeeView.xaml
│   │   │   ├── EmployeeView.xaml.cs
│   │   │   ├── ReservationView.xaml
│   │   │   ├── ReservationView.xaml.cs
│   │   │   ├── RestaurantView.xaml
│   │   │   ├── RestaurantView.xaml.cs
│   │   │   ├── BarView.xaml
│   │   │   ├── BarView.xaml.cs
│   │   │   ├── InventoryView.xaml
│   │   │   ├── InventoryView.xaml.cs
│   │   │   ├── BillingView.xaml
│   │   │   ├── BillingView.xaml.cs
│   │   │   ├── ReportsView.xaml
│   │   │   ├── ReportsView.xaml.cs
│   │   │   ├── SettingsView.xaml
│   │   │   ├── SettingsView.xaml.cs
│   │   │   └── ... (other views)
│   │   │
│   │   ├── ViewModels/                        # MVVM ViewModels
│   │   │   ├── MainWindowViewModel.cs
│   │   │   ├── LoginViewModel.cs
│   │   │   ├── DashboardViewModel.cs
│   │   │   ├── EmployeeViewModel.cs
│   │   │   ├── ReservationViewModel.cs
│   │   │   ├── RestaurantViewModel.cs
│   │   │   ├── BarViewModel.cs
│   │   │   ├── InventoryViewModel.cs
│   │   │   ├── BillingViewModel.cs
│   │   │   ├── ReportsViewModel.cs
│   │   │   ├── SettingsViewModel.cs
│   │   │   └── ... (other view models)
│   │   │
│   │   ├── Converters/                        # WPF value converters
│   │   │   ├── BoolToVisibilityConverter.cs
│   │   │   ├── StatusToColorConverter.cs
│   │   │   └── DateToStringConverter.cs
│   │   │
│   │   ├── Behaviors/                         # WPF behaviors
│   │   │   ├── PasswordBindingBehavior.cs
│   │   │   └── NumericOnlyBehavior.cs
│   │   │
│   │   ├── Resources/                         # XAML resources
│   │   │   ├── Styles/
│   │   │   │   ├── ButtonStyles.xaml
│   │   │   │   ├── TextBoxStyles.xaml
│   │   │   │   └── Colors.xaml
│   │   │   ├── Localization/
│   │   │   │   ├── en-US.xaml
│   │   │   │   ├── es-ES.xaml
│   │   │   │   └── ... (other languages)
│   │   │   └── Icons/
│   │   │       ├── home.png
│   │   │       ├── users.png
│   │   │       └── ... (other icons)
│   │   │
│   │   ├── Helpers/                           # UI Helper classes
│   │   │   ├── WindowHelper.cs
│   │   │   ├── ValidationHelper.cs
│   │   │   ├── MessageBoxHelper.cs
│   │   │   ├── PrintingHelper.cs
│   │   │   └── ReportGenerationHelper.cs
│   │   │
│   │   ├── Controls/                          # Custom controls
│   │   │   ├── DataGridColumn.cs
│   │   │   ├── NumericUpDown.cs
│   │   │   └── SearchBox.cs
│   │   │
│   │   ├── Dialogs/                           # Dialog windows
│   │   │   ├── AddEmployeeDialog.xaml
│   │   │   ├── AddEmployeeDialog.xaml.cs
│   │   │   ├── EditEmployeeDialog.xaml
│   │   │   ├── EditEmployeeDialog.xaml.cs
│   │   │   ├── ReservationDialog.xaml
│   │   │   ├── ReservationDialog.xaml.cs
│   │   │   └── ... (other dialogs)
│   │   │
│   │   └── App.config                        # Application configuration
│   │
│   ├── HotelloSys.API/                         # ASP.NET Core Web API
│   │   ├── HotelloSys.API.csproj
│   │   ├── Program.cs                         # API startup configuration
│   │   ├── Startup.cs
│   │   ├── appsettings.json
│   │   │
│   │   ├── Controllers/                       # API endpoints
│   │   │   ├── AuthController.cs
│   │   │   ├── EmployeesController.cs
│   │   │   ├── ReservationsController.cs
│   │   │   ├── CustomersController.cs
│   │   │   ├── OrdersController.cs
│   │   │   ├── InvoicesController.cs
│   │   │   ├── ReportsController.cs
│   │   │   ├── InventoryController.cs
│   │   │   └── ... (other controllers)
│   │   │
│   │   ├── DTOs/                              # Data Transfer Objects
│   │   │   ├── EmployeeDTO.cs
│   │   │   ├── ReservationDTO.cs
│   │   │   ├── CustomerDTO.cs
│   │   │   ├── OrderDTO.cs
│   │   │   ├── InvoiceDTO.cs
│   │   │   └── ... (other DTOs)
│   │   │
│   │   ├── Middleware/                        # Custom middleware
│   │   │   ├── JwtMiddleware.cs
│   │   │   ├── ErrorHandlingMiddleware.cs
│   │   │   └── LoggingMiddleware.cs
│   │   │
│   │   └── Swagger/                           # API documentation
│   │       └── SwaggerConfig.cs
│   │
│   └── HotelloSys.Tests/                       # Unit and integration tests
│       ├── HotelloSys.Tests.csproj
│       ├── UnitTests/
│       │   ├── Services/
│       │   │   ├── AuthenticationServiceTests.cs
│       │   │   ├── ReservationServiceTests.cs
│       │   │   ├── InventoryServiceTests.cs
│       │   │   ├── BillingServiceTests.cs
│       │   │   └── ... (other service tests)
│       │   ├── Repositories/
│       │   │   ├── EmployeeRepositoryTests.cs
│       │   │   ├── ReservationRepositoryTests.cs
│       │   │   └── ... (other repository tests)
│       │   └── Helpers/
│       │       ├── ValidationHelperTests.cs
│       │       └── ... (other helper tests)
│       │
│       ├── IntegrationTests/
│       │   ├── APITests/
│       │   │   ├── AuthControllerTests.cs
│       │   │   ├── EmployeesControllerTests.cs
│       │   │   └── ... (other API tests)
│       │   ├── DatabaseTests/
│       │   │   ├── EmployeeRepositoryIntegrationTests.cs
│       │   │   └── ... (other database tests)
│       │   └── Fixtures/
│       │       ├── DatabaseFixture.cs
│       │       └── TestDataSeeder.cs
│       │
│       └── TestData/
│           ├── SampleEmployees.json
│           ├── SampleReservations.json
│           └── ... (other test data)
│
├── docs/                                       # Documentation
│   ├── PROJECT_PLAN.md                        # This file
│   ├── ARCHITECTURE.md
│   ├── DATABASE_DESIGN.md
│   ├── API_DOCUMENTATION.md
│   ├── USER_GUIDE.md
│   ├── DEVELOPER_GUIDE.md
│   ├── INSTALLATION_GUIDE.md
│   └── DEPLOYMENT_GUIDE.md
│
├── scripts/                                    # Database scripts and utilities
│   ├── Database/
│   │   ├── CreateDatabase.sql
│   │   ├── DropDatabase.sql
│   │   ├── SeedTestData.sql
│   │   ├── Backup.sql
│   │   └── CreateIndexes.sql
│   ├── Migrations/
│   │   ├── MigrationHelper.ps1                # PowerShell scripts for migrations
│   │   ├── ApplyMigrations.ps1
│   │   └── RollbackMigration.ps1
│   ├── Backup/
│   │   ├── DailyBackup.ps1
│   │   ├── BackupConfig.json
│   │   └── RestoreFromBackup.ps1
│   └── Utilities/
│       ├── ConfigurationHelper.ps1
│       └── DatabaseMaintenance.ps1
│
├── .gitignore                                  # Git ignore file
├── README.md                                   # Project overview
└── LICENSE                                     # License file

```

---

## SAMPLE CODE WITH FULL PATHS

### **File 1: Models - Employee.cs**

**Full Path**: `C:\Users\Admin\OneDrive\Desktop\BuyzaProject\BuHoMaS\src\HotelloSys.Core\Models\Employee.cs`

```csharp
using System;
using System.Collections.Generic;

namespace HotelloSys.Core.Models
{
    /// <summary>
    /// Represents an employee in the hotel management system.
    /// Contains employee information, credentials, and role assignment.
    /// </summary>
    public class Employee
    {
        /// <summary>
        /// Primary key - unique identifier for the employee
        /// </summary>
        public int EmployeeID { get; set; }

        /// <summary>
        /// Foreign key referencing the Hotel this employee works for
        /// </summary>
        public int HotelID { get; set; }

        /// <summary>
        /// Employee's first name
        /// </summary>
        public string FirstName { get; set; }

        /// <summary>
        /// Employee's last name
        /// </summary>
        public string LastName { get; set; }

        /// <summary>
        /// Employee's work email address
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Employee's phone number for contact
        /// </summary>
        public string PhoneNumber { get; set; }

        /// <summary>
        /// Foreign key referencing the Department
        /// </summary>
        public int DepartmentID { get; set; }

        /// <summary>
        /// Foreign key referencing the Role/Position
        /// </summary>
        public int RoleID { get; set; }

        /// <summary>
        /// Job title of the employee (e.g., "Senior Waiter", "Room Manager")
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Gender of the employee (M/F/Other)
        /// </summary>
        public string Gender { get; set; }

        /// <summary>
        /// Employee's date of birth
        /// </summary>
        public DateTime DateOfBirth { get; set; }

        /// <summary>
        /// National ID number (for payroll and compliance)
        /// </summary>
        public string NationalIDNumber { get; set; }

        /// <summary>
        /// Date when employee joined the hotel
        /// </summary>
        public DateTime JoinDate { get; set; }

        /// <summary>
        /// Date when employee left (if applicable)
        /// </summary>
        public DateTime? EndDate { get; set; }

        /// <summary>
        /// File path to employee's photo
        /// </summary>
        public string PhotoPath { get; set; }

        /// <summary>
        /// Login username for system authentication
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// Hashed password for security
        /// </summary>
        public string PasswordHash { get; set; }

        /// <summary>
        /// Flag indicating if employee is still active
        /// </summary>
        public bool IsActive { get; set; }

        /// <summary>
        /// Timestamp of last login
        /// </summary>
        public DateTime? LastLoginDate { get; set; }

        /// <summary>
        /// Audit: Date when record was created
        /// </summary>
        public DateTime CreatedDate { get; set; }

        /// <summary>
        /// Audit: ID of user who created this record
        /// </summary>
        public int CreatedBy { get; set; }

        /// <summary>
        /// Audit: Date when record was last modified
        /// </summary>
        public DateTime? ModifiedDate { get; set; }

        /// <summary>
        /// Audit: ID of user who last modified this record
        /// </summary>
        public int? ModifiedBy { get; set; }

        // ============================================
        // Navigation Properties (for Entity Framework)
        // ============================================

        /// <summary>
        /// Navigation property to the hotel
        /// </summary>
        public Hotel Hotel { get; set; }

        /// <summary>
        /// Navigation property to the department
        /// </summary>
        public Department Department { get; set; }

        /// <summary>
        /// Navigation property to the role
        /// </summary>
        public Role Role { get; set; }

        /// <summary>
        /// Navigation property to transactions made by this employee
        /// </summary>
        public ICollection<InventoryTransaction> InventoryTransactions { get; set; }

        /// <summary>
        /// Navigation property to orders created by this employee
        /// </summary>
        public ICollection<Order> Orders { get; set; }

        /// <summary>
        /// Navigation property to invoices created by this employee
        /// </summary>
        public ICollection<Invoice> Invoices { get; set; }

        // ============================================
        // Methods
        // ============================================

        /// <summary>
        /// Gets the full name of the employee
        /// </summary>
        /// <returns>FirstName + LastName concatenated</returns>
        public string GetFullName()
        {
            return $"{FirstName} {LastName}";
        }

        /// <summary>
        /// Calculates the age of the employee based on date of birth
        /// </summary>
        /// <returns>Age in years</returns>
        public int GetAge()
        {
            int age = DateTime.Now.Year - DateOfBirth.Year;
            if (DateOfBirth.Date > DateTime.Now.AddYears(-age))
                age--;
            return age;
        }

        /// <summary>
        /// Checks if employee is currently employed
        /// </summary>
        /// <returns>True if IsActive and EndDate is not set or is in future</returns>
        public bool IsCurrentlyEmployed()
        {
            return IsActive && (!EndDate.HasValue || EndDate.Value > DateTime.Now);
        }

        /// <summary>
        /// Calculates years of service
        /// </summary>
        /// <returns>Years since join date</returns>
        public int GetYearsOfService()
        {
            DateTime endDate = EndDate.HasValue ? EndDate.Value : DateTime.Now;
            return (endDate.Year - JoinDate.Year) - (endDate < JoinDate.AddYears((endDate.Year - JoinDate.Year)) ? 1 : 0);
        }
    }
}
```

---

### **File 2: Database Context - HotelloSysDbContext.cs**

**Full Path**: `C:\Users\Admin\OneDrive\Desktop\BuyzaProject\BuHoMaS\src\HotelloSys.Data\Context\HotelloSysDbContext.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using HotelloSys.Core.Models;

namespace HotelloSys.Data.Context
{
    /// <summary>
    /// Entity Framework Core DbContext for HotelloSys application.
    /// Manages database connection, configuration, and model mappings.
    /// </summary>
    public class HotelloSysDbContext : DbContext
    {
        // ============================================
        // Constructors
        // ============================================

        /// <summary>
        /// Constructor that accepts DbContextOptions for dependency injection
        /// </summary>
        /// <param name="options">Database context configuration options</param>
        public HotelloSysDbContext(DbContextOptions<HotelloSysDbContext> options)
            : base(options)
        {
        }

        // ============================================
        // DbSets - Database Tables
        // ============================================

        /// <summary>
        /// DbSet for Hotels table
        /// </summary>
        public DbSet<Hotel> Hotels { get; set; }

        /// <summary>
        /// DbSet for Employees table
        /// </summary>
        public DbSet<Employee> Employees { get; set; }

        /// <summary>
        /// DbSet for Departments table
        /// </summary>
        public DbSet<Department> Departments { get; set; }

        /// <summary>
        /// DbSet for Roles table
        /// </summary>
        public DbSet<Role> Roles { get; set; }

        /// <summary>
        /// DbSet for RolePermissions table
        /// </summary>
        public DbSet<RolePermission> RolePermissions { get; set; }

        /// <summary>
        /// DbSet for Rooms table
        /// </summary>
        public DbSet<Room> Rooms { get; set; }

        /// <summary>
        /// DbSet for RoomTypes table
        /// </summary>
        public DbSet<RoomType> RoomTypes { get; set; }

        /// <summary>
        /// DbSet for Reservations table
        /// </summary>
        public DbSet<Reservation> Reservations { get; set; }

        /// <summary>
        /// DbSet for Customers table
        /// </summary>
        public DbSet<Customer> Customers { get; set; }

        /// <summary>
        /// DbSet for MenuItems table
        /// </summary>
        public DbSet<MenuItem> MenuItems { get; set; }

        /// <summary>
        /// DbSet for MenuCategories table
        /// </summary>
        public DbSet<MenuCategory> MenuCategories { get; set; }

        /// <summary>
        /// DbSet for Orders table
        /// </summary>
        public DbSet<Order> Orders { get; set; }

        /// <summary>
        /// DbSet for OrderItems table
        /// </summary>
        public DbSet<OrderItem> OrderItems { get; set; }

        /// <summary>
        /// DbSet for InventoryItems table
        /// </summary>
        public DbSet<InventoryItem> InventoryItems { get; set; }

        /// <summary>
        /// DbSet for InventoryTransactions table
        /// </summary>
        public DbSet<InventoryTransaction> InventoryTransactions { get; set; }

        /// <summary>
        /// DbSet for Invoices table
        /// </summary>
        public DbSet<Invoice> Invoices { get; set; }

        /// <summary>
        /// DbSet for InvoiceLineItems table
        /// </summary>
        public DbSet<InvoiceLineItem> InvoiceLineItems { get; set; }

        /// <summary>
        /// DbSet for Payments table
        /// </summary>
        public DbSet<Payment> Payments { get; set; }

        /// <summary>
        /// DbSet for AuditLogs table
        /// </summary>
        public DbSet<AuditLog> AuditLogs { get; set; }

        // ============================================
        // Configuration
        // ============================================

        /// <summary>
        /// Configures the model, relationships, and constraints
        /// Called when the model is being created
        /// </summary>
        /// <param name="modelBuilder">Used to build the model for the context</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Employee entity
            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.Username)
                .IsUnique();

            // Configure Hotel-Employee relationship
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Hotel)
                .WithMany()
                .HasForeignKey(e => e.HotelID);

            // Configure Employee-Department relationship
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Department)
                .WithMany()
                .HasForeignKey(e => e.DepartmentID);

            // Configure Employee-Role relationship
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Role)
                .WithMany()
                .HasForeignKey(e => e.RoleID);

            // Configure Room entity
            modelBuilder.Entity<Room>()
                .HasOne(r => r.Hotel)
                .WithMany()
                .HasForeignKey(r => r.HotelID);

            // Configure Reservation entity
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Room)
                .WithMany()
                .HasForeignKey(r => r.RoomID);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Customer)
                .WithMany()
                .HasForeignKey(r => r.CustomerID)
                .IsRequired(false);

            // Configure Invoice entity
            modelBuilder.Entity<Invoice>()
                .HasIndex(i => i.InvoiceNumber)
                .IsUnique();

            modelBuilder.Entity<Invoice>()
                .HasMany(i => i.LineItems)
                .WithOne(il => il.Invoice)
                .HasForeignKey(il => il.InvoiceID);

            // Configure audit properties (shadow properties for audit)
            modelBuilder.Entity<Employee>()
                .Property(e => e.CreatedDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            // Seed initial data
            SeedInitialData(modelBuilder);
        }

        /// <summary>
        /// Seeds initial data to the database (roles, default settings, etc.)
        /// </summary>
        /// <param name="modelBuilder">Model builder for seeding data</param>
        private void SeedInitialData(ModelBuilder modelBuilder)
        {
            // Seed default roles
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleID = 1, RoleName = "Admin", Description = "System Administrator" },
                new Role { RoleID = 2, RoleName = "Manager", Description = "Hotel Manager" },
                new Role { RoleID = 3, RoleName = "Front Desk", Description = "Front Desk Staff" },
                new Role { RoleID = 4, RoleName = "Waiter", Description = "Restaurant Waiter" },
                new Role { RoleID = 5, RoleName = "Bartender", Description = "Bar Bartender" },
                new Role { RoleID = 6, RoleName = "Chef", Description = "Kitchen Chef" },
                new Role { RoleID = 7, RoleName = "Housekeeping", Description = "Housekeeping Staff" }
            );

            // Additional seed data can be added here
        }

        /// <summary>
        /// Override SaveChanges to automatically set audit properties
        /// </summary>
        /// <returns>Number of affected rows</returns>
        public override int SaveChanges()
        {
            // Set audit properties before saving
            var now = DateTime.UtcNow;
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.Entity is IAuditableEntity auditableEntity)
                {
                    if (entry.State == EntityState.Added)
                    {
                        auditableEntity.CreatedDate = now;
                    }
                    if (entry.State == EntityState.Added || entry.State == EntityState.Modified)
                    {
                        auditableEntity.ModifiedDate = now;
                    }
                }
            }

            return base.SaveChanges();
        }
    }

    /// <summary>
    /// Interface for entities that require audit tracking
    /// </summary>
    public interface IAuditableEntity
    {
        DateTime CreatedDate { get; set; }
        int CreatedBy { get; set; }
        DateTime? ModifiedDate { get; set; }
        int? ModifiedBy { get; set; }
    }
}
```

---

### **File 3: Service - AuthenticationService.cs**

**Full Path**: `C:\Users\Admin\OneDrive\Desktop\BuyzaProject\BuHoMaS\src\HotelloSys.Core\Services\AuthenticationService.cs`

```csharp
using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using HotelloSys.Core.Models;
using HotelloSys.Data;

namespace HotelloSys.Core.Services
{
    /// <summary>
    /// Service for handling employee authentication and password management
    /// Uses bcrypt or PBKDF2 for secure password hashing
    /// </summary>
    public interface IAuthenticationService
    {
        /// <summary>
        /// Authenticates an employee with username and password
        /// </summary>
        /// <param name="username">Employee username</param>
        /// <param name="password">Employee plain text password</param>
        /// <returns>Employee object if authenticated, null otherwise</returns>
        Task<Employee> AuthenticateAsync(string username, string password);

        /// <summary>
        /// Registers a new employee (for admin use)
        /// </summary>
        /// <param name="employee">Employee details</param>
        /// <param name="password">Initial password</param>
        /// <returns>True if registration successful</returns>
        Task<bool> RegisterEmployeeAsync(Employee employee, string password);

        /// <summary>
        /// Changes employee password
        /// </summary>
        /// <param name="employeeId">Employee ID</param>
        /// <param name="oldPassword">Current password</param>
        /// <param name="newPassword">New password</param>
        /// <returns>True if password changed successfully</returns>
        Task<bool> ChangePasswordAsync(int employeeId, string oldPassword, string newPassword);

        /// <summary>
        /// Resets employee password (admin function)
        /// </summary>
        /// <param name="employeeId">Employee ID</param>
        /// <param name="newPassword">New password</param>
        /// <returns>True if reset successful</returns>
        Task<bool> ResetPasswordAsync(int employeeId, string newPassword);

        /// <summary>
        /// Validates password against complexity requirements
        /// </summary>
        /// <param name="password">Password to validate</param>
        /// <returns>Tuple with (isValid, errorMessage)</returns>
        (bool isValid, string errorMessage) ValidatePasswordStrength(string password);
    }

    /// <summary>
    /// Implementation of authentication service
    /// </summary>
    public class AuthenticationService : IAuthenticationService
    {
        // ============================================
        // Fields
        // ============================================

        /// <summary>
        /// Dependency: employee repository for data access
        /// </summary>
        private readonly IEmployeeRepository _employeeRepository;

        /// <summary>
        /// Dependency: audit service for logging authentication attempts
        /// </summary>
        private readonly IAuditService _auditService;

        /// <summary>
        /// Password hashing iteration count for PBKDF2
        /// </summary>
        private const int HashIterations = 10000;

        /// <summary>
        /// Salt size in bytes for password hashing
        /// </summary>
        private const int SaltSize = 16;

        // ============================================
        // Constructor
        // ============================================

        /// <summary>
        /// Initializes the authentication service with dependencies
        /// </summary>
        /// <param name="employeeRepository">Repository for employee data</param>
        /// <param name="auditService">Service for audit logging</param>
        public AuthenticationService(
            IEmployeeRepository employeeRepository,
            IAuditService auditService)
        {
            _employeeRepository = employeeRepository;
            _auditService = auditService;
        }

        // ============================================
        // Public Methods
        // ============================================

        /// <summary>
        /// Authenticates employee and returns employee object if credentials are valid
        /// </summary>
        public async Task<Employee> AuthenticateAsync(string username, string password)
        {
            try
            {
                // Input validation
                if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
                {
                    await _auditService.LogFailedLoginAttemptAsync(username, "Invalid credentials");
                    return null;
                }

                // Fetch employee by username
                var employee = await _employeeRepository.GetByUsernameAsync(username);

                // If employee not found or not active
                if (employee == null || !employee.IsActive)
                {
                    await _auditService.LogFailedLoginAttemptAsync(username, "User not found or inactive");
                    return null;
                }

                // Verify password
                if (!VerifyPassword(password, employee.PasswordHash))
                {
                    await _auditService.LogFailedLoginAttemptAsync(username, "Invalid password");
                    return null;
                }

                // Update last login date
                employee.LastLoginDate = DateTime.UtcNow;
                await _employeeRepository.UpdateAsync(employee);

                // Log successful login
                await _auditService.LogSuccessfulLoginAsync(employee.EmployeeID, username);

                return employee;
            }
            catch (Exception ex)
            {
                // Log exception and return null
                await _auditService.LogExceptionAsync("AuthenticationService.AuthenticateAsync", ex);
                return null;
            }
        }

        /// <summary>
        /// Registers a new employee with a password
        /// </summary>
        public async Task<bool> RegisterEmployeeAsync(Employee employee, string password)
        {
            try
            {
                // Validate inputs
                if (employee == null || string.IsNullOrWhiteSpace(password))
                    return false;

                // Validate password strength
                var (isValid, errorMessage) = ValidatePasswordStrength(password);
                if (!isValid)
                    throw new ArgumentException($"Password validation failed: {errorMessage}");

                // Hash password
                employee.PasswordHash = HashPassword(password);

                // Save employee
                var createdEmployee = await _employeeRepository.CreateAsync(employee);

                // Log registration
                await _auditService.LogEmployeeRegistrationAsync(createdEmployee.EmployeeID, employee.Username);

                return createdEmployee != null;
            }
            catch (Exception ex)
            {
                await _auditService.LogExceptionAsync("AuthenticationService.RegisterEmployeeAsync", ex);
                return false;
            }
        }

        /// <summary>
        /// Changes employee password after verifying old password
        /// </summary>
        public async Task<bool> ChangePasswordAsync(int employeeId, string oldPassword, string newPassword)
        {
            try
            {
                // Fetch employee
                var employee = await _employeeRepository.GetByIdAsync(employeeId);
                if (employee == null)
                    return false;

                // Verify old password
                if (!VerifyPassword(oldPassword, employee.PasswordHash))
                {
                    await _auditService.LogSecurityEventAsync(employeeId, "Failed password change attempt");
                    return false;
                }

                // Validate new password
                var (isValid, errorMessage) = ValidatePasswordStrength(newPassword);
                if (!isValid)
                    throw new ArgumentException($"New password validation failed: {errorMessage}");

                // Update password
                employee.PasswordHash = HashPassword(newPassword);
                employee.ModifiedDate = DateTime.UtcNow;

                await _employeeRepository.UpdateAsync(employee);

                // Log password change
                await _auditService.LogPasswordChangeAsync(employeeId, employee.Username);

                return true;
            }
            catch (Exception ex)
            {
                await _auditService.LogExceptionAsync("AuthenticationService.ChangePasswordAsync", ex);
                return false;
            }
        }

        /// <summary>
        /// Resets employee password (admin function)
        /// </summary>
        public async Task<bool> ResetPasswordAsync(int employeeId, string newPassword)
        {
            try
            {
                // Fetch employee
                var employee = await _employeeRepository.GetByIdAsync(employeeId);
                if (employee == null)
                    return false;

                // Validate new password
                var (isValid, errorMessage) = ValidatePasswordStrength(newPassword);
                if (!isValid)
                    throw new ArgumentException($"New password validation failed: {errorMessage}");

                // Update password
                employee.PasswordHash = HashPassword(newPassword);
                employee.ModifiedDate = DateTime.UtcNow;

                await _employeeRepository.UpdateAsync(employee);

                // Log password reset
                await _auditService.LogPasswordResetAsync(employeeId, employee.Username);

                return true;
            }
            catch (Exception ex)
            {
                await _auditService.LogExceptionAsync("AuthenticationService.ResetPasswordAsync", ex);
                return false;
            }
        }

        /// <summary>
        /// Validates password against complexity requirements
        /// Requirements:
        /// - Minimum 8 characters
        /// - At least 1 uppercase letter
        /// - At least 1 lowercase letter
        /// - At least 1 digit
        /// - At least 1 special character
        /// </summary>
        public (bool isValid, string errorMessage) ValidatePasswordStrength(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                return (false, "Password cannot be empty");

            if (password.Length < 8)
                return (false, "Password must be at least 8 characters long");

            bool hasUpperCase = false;
            bool hasLowerCase = false;
            bool hasDigit = false;
            bool hasSpecialChar = false;

            foreach (char c in password)
            {
                if (char.IsUpper(c)) hasUpperCase = true;
                if (char.IsLower(c)) hasLowerCase = true;
                if (char.IsDigit(c)) hasDigit = true;
                if ("!@#$%^&*()-_=+[]{}|;:,.<>?".Contains(c)) hasSpecialChar = true;
            }

            if (!hasUpperCase)
                return (false, "Password must contain at least one uppercase letter");
            if (!hasLowerCase)
                return (false, "Password must contain at least one lowercase letter");
            if (!hasDigit)
                return (false, "Password must contain at least one digit");
            if (!hasSpecialChar)
                return (false, "Password must contain at least one special character");

            return (true, "");
        }

        // ============================================
        // Private Helper Methods
        // ============================================

        /// <summary>
        /// Hashes a password using PBKDF2
        /// </summary>
        /// <param name="password">Plain text password</param>
        /// <returns>Salt + hash concatenated and base64 encoded</returns>
        private string HashPassword(string password)
        {
            // Generate random salt
            using (var rng = new RNGCryptoServiceProvider())
            {
                byte[] salt = new byte[SaltSize];
                rng.GetBytes(salt);

                // Hash password with salt
                using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, HashIterations, HashAlgorithmName.SHA256))
                {
                    byte[] hash = pbkdf2.GetBytes(20);

                    // Combine salt and hash
                    byte[] hashWithSalt = new byte[salt.Length + hash.Length];
                    Array.Copy(salt, 0, hashWithSalt, 0, salt.Length);
                    Array.Copy(hash, 0, hashWithSalt, salt.Length, hash.Length);

                    // Return base64 encoded string
                    return Convert.ToBase64String(hashWithSalt);
                }
            }
        }

        /// <summary>
        /// Verifies a password against a stored hash
        /// </summary>
        /// <param name="password">Plain text password to verify</param>
        /// <param name="hash">Stored password hash</param>
        /// <returns>True if password matches hash</returns>
        private bool VerifyPassword(string password, string hash)
        {
            try
            {
                // Decode hash
                byte[] hashBytes = Convert.FromBase64String(hash);

                // Extract salt (first SaltSize bytes)
                byte[] salt = new byte[SaltSize];
                Array.Copy(hashBytes, 0, salt, 0, SaltSize);

                // Compute hash of provided password with extracted salt
                using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, HashIterations, HashAlgorithmName.SHA256))
                {
                    byte[] computedHash = pbkdf2.GetBytes(20);

                    // Compare hashes
                    for (int i = 0; i < computedHash.Length; i++)
                    {
                        if (hashBytes[i + SaltSize] != computedHash[i])
                            return false;
                    }
                }

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
```

---

### **File 4: WPF ViewModel - LoginViewModel.cs**

**Full Path**: `C:\Users\Admin\OneDrive\Desktop\BuyzaProject\BuHoMaS\src\HotelloSys.UI\ViewModels\LoginViewModel.cs`

```csharp
using System;
using System.Windows.Input;
using System.Windows;
using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.Command;
using GalaSoft.MvvmLight.Messaging;
using HotelloSys.Core.Services;
using HotelloSys.Core.Models;

namespace HotelloSys.UI.ViewModels
{
    /// <summary>
    /// ViewModel for the Login window
    /// Handles user authentication and navigation to main window
    /// Implements MVVM pattern for separation of concerns
    /// </summary>
    public class LoginViewModel : ViewModelBase
    {
        // ============================================
        // Fields
        // ============================================

        /// <summary>
        /// Dependency: authentication service for user login
        /// </summary>
        private readonly IAuthenticationService _authenticationService;

        /// <summary>
        /// Backing field for Username property
        /// </summary>
        private string _username;

        /// <summary>
        /// Backing field for Password property
        /// </summary>
        private string _password;

        /// <summary>
        /// Backing field for error message display
        /// </summary>
        private string _errorMessage;

        /// <summary>
        /// Backing field for loading indicator
        /// </summary>
        private bool _isLoading;

        /// <summary>
        /// Backing field for remember me checkbox
        /// </summary>
        private bool _rememberMe;

        /// <summary>
        /// Currently authenticated employee
        /// </summary>
        private Employee _currentEmployee;

        // ============================================
        // Properties
        // ============================================

        /// <summary>
        /// Gets or sets the username entered by user
        /// </summary>
        public string Username
        {
            get { return _username; }
            set { Set(ref _username, value); }
        }

        /// <summary>
        /// Gets or sets the password entered by user
        /// Note: Password binding requires special handling in WPF for security
        /// </summary>
        public string Password
        {
            get { return _password; }
            set { Set(ref _password, value); }
        }

        /// <summary>
        /// Gets or sets error message to display
        /// </summary>
        public string ErrorMessage
        {
            get { return _errorMessage; }
            set { Set(ref _errorMessage, value); }
        }

        /// <summary>
        /// Gets or sets loading state
        /// </summary>
        public bool IsLoading
        {
            get { return _isLoading; }
            set { Set(ref _isLoading, value); }
        }

        /// <summary>
        /// Gets or sets remember me option
        /// </summary>
        public bool RememberMe
        {
            get { return _rememberMe; }
            set { Set(ref _rememberMe, value); }
        }

        /// <summary>
        /// Gets the currently authenticated employee
        /// </summary>
        public Employee CurrentEmployee
        {
            get { return _currentEmployee; }
            private set { Set(ref _currentEmployee, value); }
        }

        // ============================================
        // Commands
        // ============================================

        /// <summary>
        /// Command to execute login
        /// </summary>
        public ICommand LoginCommand { get; private set; }

        /// <summary>
        /// Command to exit application
        /// </summary>
        public ICommand ExitCommand { get; private set; }

        /// <summary>
        /// Command to show forgot password dialog
        /// </summary>
        public ICommand ForgotPasswordCommand { get; private set; }

        // ============================================
        // Constructor
        // ============================================

        /// <summary>
        /// Initializes the login view model
        /// </summary>
        /// <param name="authenticationService">Authentication service dependency</param>
        public LoginViewModel(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;

            // Initialize commands
            LoginCommand = new RelayCommand(ExecuteLogin, CanExecuteLogin);
            ExitCommand = new RelayCommand(ExecuteExit);
            ForgotPasswordCommand = new RelayCommand(ExecuteForgotPassword);

            // Set default values
            RememberMe = false;
            IsLoading = false;

            // For demonstration, you can set test credentials
            // Username = "admin";
            // Password = "";
        }

        // ============================================
        // Command Implementations
        // ============================================

        /// <summary>
        /// Executes the login command
        /// Authenticates user and navigates to main window if successful
        /// </summary>
        private async void ExecuteLogin()
        {
            try
            {
                // Clear previous error
                ErrorMessage = "";

                // Validate inputs
                if (string.IsNullOrWhiteSpace(Username) || string.IsNullOrWhiteSpace(Password))
                {
                    ErrorMessage = "Username and password are required";
                    return;
                }

                // Show loading indicator
                IsLoading = true;

                // Attempt authentication
                var employee = await _authenticationService.AuthenticateAsync(Username, Password);

                if (employee == null)
                {
                    ErrorMessage = "Invalid username or password";
                    IsLoading = false;
                    return;
                }

                // Store authenticated employee
                CurrentEmployee = employee;

                // Save credentials if remember me is checked
                if (RememberMe)
                {
                    // In production, use secure credential manager
                    // Example: CredentialManager.SaveCredentials(Username, Password);
                }

                // Send message to application to navigate to main window
                Messenger.Default.Send<LoginSuccessMessage>(
                    new LoginSuccessMessage(employee));

                IsLoading = false;
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Login failed: {ex.Message}";
                IsLoading = false;
            }
        }

        /// <summary>
        /// Determines if login command can execute
        /// </summary>
        /// <returns>True if fields are not empty and not already loading</returns>
        private bool CanExecuteLogin()
        {
            return !string.IsNullOrWhiteSpace(Username) &&
                   !string.IsNullOrWhiteSpace(Password) &&
                   !IsLoading;
        }

        /// <summary>
        /// Executes the exit command
        /// Closes the application
        /// </summary>
        private void ExecuteExit()
        {
            Application.Current.Shutdown();
        }

        /// <summary>
        /// Executes the forgot password command
        /// Shows forgot password dialog
        /// </summary>
        private void ExecuteForgotPassword()
        {
            // Send message to show forgot password dialog
            Messenger.Default.Send<ForgotPasswordMessage>(
                new ForgotPasswordMessage());
        }
    }

    // ============================================
    // Messages
    // ============================================

    /// <summary>
    /// Message sent when login is successful
    /// </summary>
    public class LoginSuccessMessage
    {
        /// <summary>
        /// Authenticated employee
        /// </summary>
        public Employee Employee { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="employee">Authenticated employee</param>
        public LoginSuccessMessage(Employee employee)
        {
            Employee = employee;
        }
    }

    /// <summary>
    /// Message sent when user requests password reset
    /// </summary>
    public class ForgotPasswordMessage
    {
    }
}
```

---

## DEVELOPMENT ROADMAP WITH TIME ESTIMATES

### **Overall Timeline: ~15 Months (66 Weeks) - UPDATED February 13, 2026**

| Phase | Name | Duration | Key Deliverables | Status |
|-------|------|----------|------------------|--------|
| **1** | Foundation & Core + **License Mgmt** | 5 weeks | Database, Auth, MVVM, **License System** | **UPDATED** |
| **2** | Employees & Hotel + **Dept CRUD** | 5 weeks | Employee CRUD, Admin dashboard, **Department Management** | **UPDATED** |
| **3** | Rooms & Reservations + **Mobile** | 6 weeks | Rooms, Reservations, **Down-Payments, Sync** | **UPDATED** |
| **4** | Restaurant Module | 7 weeks | Menu, Orders, Kitchen Display System | ✅ Standard |
| **5** | Bar Module & Inventory | 7 weeks | Bar operations, Inventory tracking | ✅ Standard |
| **6** | Billing & Invoicing | 5 weeks | Invoices, Payments, Receipts | ✅ Standard |
| **7** | Customer Management & Loyalty | 4 weeks | Customer profiles, Loyalty points | ✅ Standard |
| **8** | Reporting & Analytics | 4 weeks | Reports, Dashboards, Exports | ✅ Standard |
| **9** | Web API + **Mobile Endpoints** | 5 weeks | Web API, Dashboard, **Mobile API** | **UPDATED** |
| **10** | Audit & Compliance | 3 weeks | Audit logs, GDPR features | ✅ Standard |
| **11** | Testing & Optimization | Throughout | Unit tests, Performance tuning | ✅ Standard |
| **12** | Deployment & Backup | 3 weeks | Installation wizard, Backup system | ✅ Standard |
| **13** | **MOBILE APP (NEW)** | **14 weeks** | **iOS & Android app** | **🆕 NEW** |

**Total**: 52 weeks (Phases 1-12) + 14 weeks (Phase 13 Mobile App) = **66 weeks (~15 months)**

---

### **Detailed Monthly Breakdown**

#### **MONTH 1: Foundation & Core System (Weeks 1-4)**

**Week 1: Project Setup & Database Design**
- Set up Visual Studio Community
- Create solution structure
- Install all NuGet packages
- Design and create PostgreSQL database
- Create initial Entity Framework migrations
- **Hours**: 20-25
- **Deliverables**: Working project structure, database created

**Week 2: Authentication & Authorization**
- Implement Employee model and authentication service
- Create password hashing and verification
- Implement role-based access control (RBAC)
- Create Role and RolePermission entities
- **Hours**: 25-30
- **Deliverables**: Login functionality working

**Week 3: WPF UI Foundation & MVVM**
- Create WPF application shell
- Implement MVVM pattern with ViewModels
- Create LoginWindow and MainWindow
- Implement dependency injection
- Set up resource styling and theming
- **Hours**: 30-35
- **Deliverables**: UI framework ready, login screen functional

**Week 4: Hotel Configuration & Settings**
- Create Hotel setup wizard
- Implement HotelSettings management
- Create initial database seeding
- Set up localization framework
- Write unit tests for core services
- **Hours**: 25-30
- **Deliverables**: Hotel setup complete, core services tested

**MONTH 1 TOTAL: ~100-120 hours**

---

#### **MONTH 2: Employee & Hotel Management (Weeks 5-8)**

**Week 5: Employee Management UI & CRUD**
- Create EmployeeView.xaml with DataGrid
- Implement Employee CRUD dialogs
- Create EmployeeViewModel
- Implement employee search and filtering
- **Hours**: 25-30
- **Deliverables**: Add/Edit/Delete employees working

**Week 6: Employee Profiles & Photos**
- Add photo upload/storage functionality
- Create employee profile detail view
- Implement department management
- Create employee search by name/ID/department
- **Hours**: 20-25
- **Deliverables**: Employee profiles complete with photos

**Week 7: Admin Dashboard & Reporting**
- Create admin dashboard overview
- Implement quick statistics widgets
- Create employee list with filtering
- Implement permission management interface
- **Hours**: 25-30
- **Deliverables**: Admin dashboard functional

**Week 8: Testing & Documentation**
- Write integration tests for employee operations
- Create unit tests for services
- Document database schema
- Create developer guide for first two phases
- **Hours**: 20-25
- **Deliverables**: Phase 1-2 documentation, tests passing

**MONTH 2 TOTAL: ~90-110 hours**

---

#### **MONTH 3: Room Management & Reservations (Weeks 9-13)**

**Week 9: Room Types & Room Management**
- Create RoomType management interface
- Create Room entity and repository
- Implement room status tracking
- Create room inventory view
- **Hours**: 25-30
- **Deliverables**: Room management functional

**Week 10: Reservation System - Part 1**
- Create Reservation entity and repository
- Create Customer entity and management
- Implement reservation creation form
- Create calendar view for room availability
- **Hours**: 30-35
- **Deliverables**: Basic reservation creation working

**Week 11: Reservation System - Part 2**
- Implement check-in/check-out workflow
- Create reservation modification functionality
- Implement guest information management
- Add special requests handling
- **Hours**: 30-35
- **Deliverables**: Full reservation workflow complete

**Week 12: Reservation Reports & Printing**
- Create reservation confirmation printing
- Implement reservation reports
- Add reservation search and filtering
- Create occupancy analytics
- **Hours**: 25-30
- **Deliverables**: Reservation reports and printing working

**Week 13: Testing & Optimization**
- Test concurrent reservation booking
- Optimize database queries
- Add performance indexes
- Write comprehensive tests
- **Hours**: 20-25
- **Deliverables**: Phase 3 tested and optimized

**MONTH 3 TOTAL: ~130-155 hours**

---

#### **MONTH 4-5: Restaurant Module (Weeks 14-22)**

**Week 14: Menu Management**
- Create MenuCategory entity
- Create MenuItem entity and management
- Create menu administration interface
- Implement menu item pricing and descriptions
- **Hours**: 25-30
- **Deliverables**: Menu management working

**Week 15: Order Creation Interface**
- Create order entry interface
- Implement quick order templates
- Add item quantity and special instructions
- Create order summary display
- **Hours**: 30-35
- **Deliverables**: Order creation interface complete

**Week 16: Kitchen Display System (KDS)**
- Create KDS view showing pending orders
- Implement order status updates
- Add order priority/rush indicators
- Create order preparation tracking
- **Hours**: 35-40
- **Deliverables**: KDS functional

**Week 17: Order Management & Modifications**
- Implement order modification
- Add order cancellation
- Create order history view
- Implement order filtering and search
- **Hours**: 25-30
- **Deliverables**: Order management complete

**Week 18: Restaurant Inventory Integration**
- Link restaurant orders to inventory
- Implement automatic stock deduction
- Create low stock alerts
- Add inventory adjustment for spoilage
- **Hours**: 30-35
- **Deliverables**: Inventory linked with orders

**Week 19: Restaurant Printing & Reports**
- Create order receipts printing (thermal)
- Implement restaurant performance reports
- Add item popularity analysis
- Create daily restaurant summary
- **Hours**: 25-30
- **Deliverables**: Printing and reports working

**Week 20-22: Testing & Refinement (3 weeks)**
- Performance testing with 50+ concurrent orders
- Test order printing on various printers
- Load testing on KDS
- User acceptance testing preparation
- **Hours**: 75-90
- **Deliverables**: Restaurant module completed and tested

**MONTHS 4-5 TOTAL: ~280-325 hours**

---

#### **MONTH 6-7: Bar Module & Inventory System (Weeks 23-30)**

**Week 23: Bar Menu & Operations**
- Create bar menu management
- Implement drink ordering system
- Create bar order interface
- Link bar orders to bar inventory
- **Hours**: 25-30
- **Deliverables**: Bar operations setup

**Week 24-25: Inventory Management System (2 weeks)**
- Create InventoryItem management
- Implement barcode/QR code system (optional feature toggle)
- Create stock tracking interface
- Implement barcode scanning with ZXing
- **Hours**: 50-60
- **Deliverables**: Inventory system with barcode support

**Week 26: Inventory Transactions & Adjustments**
- Implement inventory in/out transactions
- Create stock adjustment workflows
- Add approval for adjustments
- Implement inventory history tracking
- **Hours**: 30-35
- **Deliverables**: Inventory transactions working

**Week 27: Supplier Management**
- Create supplier management interface
- Implement purchase orders
- Create supplier contact management
- Add supplier performance tracking
- **Hours**: 25-30
- **Deliverables**: Supplier management complete

**Week 28: Inventory Alerts & Reporting**
- Implement low stock alerts
- Create reorder level management
- Generate inventory consumption reports
- Add stock value calculations
- **Hours**: 25-30
- **Deliverables**: Inventory alerts and reports

**Week 29-30: Testing & Barcode Integration (2 weeks)**
- Test barcode scanning with various devices
- Test inventory accuracy with large datasets
- Performance testing with high transaction volume
- User acceptance testing
- **Hours**: 50-60
- **Deliverables**: Inventory system fully tested

**MONTHS 6-7 TOTAL: ~280-315 hours**

---

#### **MONTH 8: Billing & Invoicing (Weeks 31-35)**

**Week 31: Invoice System Foundation**
- Create Invoice and InvoiceLineItem entities
- Implement invoice number generation
- Create invoice creation from reservations
- Implement invoice calculation (totals, tax, etc.)
- **Hours**: 30-35
- **Deliverables**: Invoice generation working

**Week 32: Multiple Service Billing**
- Implement combined billing (Room + Restaurant + Bar)
- Create bill itemization
- Add discount application
- Implement service charge calculations
- **Hours**: 30-35
- **Deliverables**: Combined billing working

**Week 33: Payment Processing**
- Create Payment entity and processing
- Implement multiple payment methods (Cash, Card, Check, Bank Transfer, Mobile Money)
- Create payment reconciliation
- Implement partial payment support
- **Hours**: 30-35
- **Deliverables**: Payment processing complete

**Week 34: Printing & Receipt Generation**
- Implement thermal printer support for receipts
- Create regular printer support for invoices
- Add printer configuration interface
- Generate PDF invoices for email
- **Hours**: 30-35
- **Deliverables**: Printing system working

**Week 35: Billing Reports & Testing**
- Create billing reports (daily, weekly, monthly)
- Implement outstanding bills tracking
- Add payment reconciliation reports
- Complete testing and optimization
- **Hours**: 25-30
- **Deliverables**: Billing module complete

**MONTH 8 TOTAL: ~145-170 hours**

---

#### **MONTH 9: Customer Management & Loyalty (Weeks 36-39)**

**Week 36: Customer Profiles**
- Enhance Customer entity
- Create customer profile management
- Implement customer preferences
- Add customer communication history
- **Hours**: 25-30
- **Deliverables**: Customer management working

**Week 37: Customer Ranking & Analytics**
- Implement customer tier system (VIP, Regular, Occasional)
- Create automatic tier assignment based on spending
- Implement customer lifetime value calculation
- Create customer analytics dashboard
- **Hours**: 30-35
- **Deliverables**: Customer analytics working

**Week 38: Loyalty Points System**
- Create LoyaltyPoints entity
- Implement points earning rules
- Create points redemption workflow
- Add points expiry management
- **Hours**: 30-35
- **Deliverables**: Loyalty program working

**Week 39: Testing & Reporting**
- Create customer reports
- Implement customer analytics visualizations
- Performance test with large customer database
- Complete testing and optimization
- **Hours**: 25-30
- **Deliverables**: Customer module complete

**MONTH 9 TOTAL: ~110-130 hours**

---

#### **MONTH 10: Reporting & Analytics (Weeks 40-43)**

**Week 40: Daily & Weekly Reports**
- Create daily transaction reports
- Implement weekly summary reports
- Add department-wise reports
- Create employee performance reports
- **Hours**: 30-35
- **Deliverables**: Daily/weekly reports

**Week 41: Monthly & Quarterly Reports**
- Create monthly financial reports
- Implement quarterly analysis
- Add year-over-year comparisons
- Create revenue breakdown reports
- **Hours**: 30-35
- **Deliverables**: Monthly/quarterly reports

**Week 42: Specialized Reports**
- Create occupancy reports
- Implement inventory consumption reports
- Add customer analytics reports
- Create tax/compliance reports
- **Hours**: 30-35
- **Deliverables**: Specialized reports complete

**Week 43: Report Export & Scheduling**
- Implement PDF export functionality
- Add Excel export support
- Create report scheduling
- Implement automated email delivery
- **Hours**: 25-30
- **Deliverables**: Report system complete

**MONTH 10 TOTAL: ~115-135 hours**

---

#### **MONTH 11: Web Dashboard & Mobile Access (Weeks 44-48)**

**Week 44: ASP.NET Core Web API**
- Create ASP.NET Core API project
- Implement API endpoints for reports
- Add JWT authentication
- Implement API documentation (Swagger)
- **Hours**: 35-40
- **Deliverables**: API endpoints working

**Week 45: Responsive Web Dashboard - Part 1**
- Set up Angular/React frontend
- Create dashboard layout
- Implement real-time metrics display
- Add occupancy status view
- **Hours**: 35-40
- **Deliverables**: Basic dashboard layout

**Week 46: Responsive Web Dashboard - Part 2**
- Implement revenue metrics
- Add employee performance view
- Create customer analytics dashboard
- Implement report access and download
- **Hours**: 30-35
- **Deliverables**: Dashboard features complete

**Week 47: Mobile Optimization**
- Make dashboard mobile responsive
- Create mobile-specific views
- Implement touch-friendly controls
- Test on various devices
- **Hours**: 25-30
- **Deliverables**: Mobile-friendly dashboard

**Week 48: Testing & Deployment Preparation**
- Test API with various clients
- Performance test web dashboard
- Security testing (SQL injection, XSS, etc.)
- Prepare deployment documentation
- **Hours**: 30-35
- **Deliverables**: Web dashboard tested and ready

**MONTH 11 TOTAL: ~155-180 hours**

---

#### **MONTH 12: Audit, Compliance & Finalization (Weeks 49-52)**

**Week 49: Audit Trail Implementation**
- Create comprehensive audit logging
- Implement user activity tracking
- Add data modification history
- Create audit report generation
- **Hours**: 30-35
- **Deliverables**: Audit system working

**Week 50: GDPR & Compliance Features**
- Implement data export functionality
- Add data deletion workflows
- Create compliance reports
- Implement data retention policies
- **Hours**: 30-35
- **Deliverables**: Compliance features complete

**Week 51: Backup & Disaster Recovery**
- Implement automated daily backups
- Create backup encryption
- Implement restore functionality
- Create disaster recovery procedures
- **Hours**: 25-30
- **Deliverables**: Backup system automated

**Week 52: Final Testing & Release Preparation**
- Conduct comprehensive system testing
- Performance optimization final pass
- Security vulnerability scanning
- Prepare installation package and documentation
- **Hours**: 35-40
- **Deliverables**: Version 1.0 ready for deployment

**MONTH 12 TOTAL: ~120-140 hours**

---

### **OVERALL TIME ALLOCATION - UPDATED (February 13, 2026)**

| Category | Hours | Percentage | Status |
|----------|-------|-----------|--------|
| **Phase 1: Foundation + License** | 160-180 | 8% | **+60 hours** |
| **Phase 2: Employees + Departments** | 105-125 | 5% | **+15 hours** |
| **Phase 3: Rooms + Mobile Features** | 190-215 | 9% | **+60 hours** |
| **Phase 4: Restaurant** | 280-325 | 13% | Unchanged |
| **Phase 5: Bar & Inventory** | 280-315 | 13% | Unchanged |
| **Phase 6: Billing** | 145-170 | 7% | Unchanged |
| **Phase 7: Customer & Loyalty** | 110-130 | 5% | Unchanged |
| **Phase 8: Reporting** | 115-135 | 6% | Unchanged |
| **Phase 9: Web API + Mobile** | 185-210 | 9% | **+30 hours** |
| **Phase 10: Audit & Compliance** | 235-275 | 11% | **+15 hours** |
| **Phase 11: Testing** | 100-120 | 5% | Unchanged |
| **Phase 12: Deployment** | 80-100 | 4% | Unchanged |
| **Phase 13: Mobile App (NEW)** | **336-350** | **16%** | **🆕 NEW** |
| **Contingency (10-15%)** | 144-182 | 7% | Adjusted |
| **TOTAL** | **2,071-2,421 hours** | **100%** | **+516 hours** |

**Cost of New Features**:
- License Management System: +40 hours
- Modular System: +20 hours
- Department CRUD: +15 hours
- Down-Payment & Room Holds: +25 hours
- Cross-Hotel Sync: +35 hours
- Mobile Endpoints (Phase 9): +30 hours
- Mobile Deployment (Phase 10-12): +15 hours
- **Mobile App (Phase 13)**: +336 hours
- **Total**: +516 hours

---

### **Hours per Week Target**

- **Assuming 40-hour work weeks**: ~39-47 weeks
- **Assuming 50-hour work weeks**: ~31-37 weeks  
- **Assuming 60-hour work weeks**: ~26-31 weeks

**For a 15-month timeline (66 weeks)**, target **31-37 hours/week** on average  
*(Original plan was 52 weeks at 30-36 hours/week)*

---

### **Critical Path & Dependencies**

```
Phase 1 (Foundation)
    ↓
Phase 2 (Employee Mgmt) + Phase 3 (Rooms) can run in parallel after Phase 1
    ↓
Phase 4 (Restaurant) depends on Phase 2 & 3
    ↓
Phase 5 (Bar & Inventory) can run in parallel with Phase 4
    ↓
Phase 6 (Billing) depends on Phase 4 & 5
    ↓
Phase 7 (Customer) can start after Phase 3
    ↓
Phase 8 (Reporting) depends on Phase 6 & 7
    ↓
Phase 9 (Web/Mobile) can run in parallel with Phase 8
    ↓
Phase 10 (Audit & Compliance) runs throughout
    ↓
Version 1.0 Release Ready
```

---

### **Risks & Mitigation**

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Database performance at scale | High | Medium | Regular performance testing, query optimization |
| Complex reporting requirements | Medium | Medium | Use proven reporting library (SSRS/Crystal) |
| Printer driver compatibility | Medium | High | Support multiple print APIs, extensive testing |
| Barcode integration issues | Low | Low | Early integration testing, vendor support |
| Scope creep from requirements | High | High | Strict change control, separate into Phase 2 |
| Team size (solo developer) | High | N/A | Clear documentation, modular architecture |

---

## NEXT STEPS

1. **Week 1 Action Items**:
   - [ ] Install all software (Visual Studio, PostgreSQL, .NET 8 SDK)
   - [ ] Create project structure in workspace
   - [ ] Create initial solution and projects
   - [ ] Set up git repository

2. **Week 2-3 Action Items**:
   - [ ] Create database schema in PostgreSQL
   - [ ] Implement core models (Employee, Hotel, etc.)
   - [ ] Set up Entity Framework migrations
   - [ ] Create authentication service and tests

3. **Ongoing**:
   - [ ] Weekly progress tracking against this roadmap
   - [ ] Monthly review of completed vs. planned work
   - [ ] Quarterly architecture reviews
   - [ ] Continuous testing and code quality assessment

---

## CONCLUSION

This comprehensive plan provides:
✅ Complete technology stack recommendation  
✅ Detailed database schema design  
✅ Complete project structure  
✅ Sample code with full paths and detailed comments  
✅ Step-by-step installation guide  
✅ 12-month development roadmap with hour estimates  
✅ Risk mitigation strategies  
✅ Clear milestones and deliverables  

**Total estimated effort: 2,071-2,421 hours (~15 months at 31-37 hours/week)**

*Original estimate was 1,555-1,875 hours (52 weeks). New features add +516 hours.*

### **New Features Summary (Added February 13, 2026)**

| Feature | Phase | Additional Hours | Benefit |
|---------|-------|-----------------|---------|
| License Management | 1 | +40 | Prevent software piracy, one key per PC |
| Modular System | 1 | +20 | Customers pay only for modules they use |
| Department CRUD | 2 | +15 | Hotel owners manage departments |
| Down-Payment System | 3 | +25 | Prevent no-shows with down-payments |
| Cross-Hotel Sync | 3-9 | +35 | Unified customer profiles across hotels |
| Mobile API Endpoints | 9 | +30 | Backend for mobile app |
| Mobile Deployment | 10-12 | +15 | Production deployment preparation |
| **Mobile App (iOS/Android)** | **13** | **+336** | **Customer booking app** |
| **TOTAL NEW** | — | **+516** | — |

Ready to start development? Let's begin with **Phase 1: Foundation & Core System**!

---

**Document Version**: 1.0  
**Last Updated**: January 24, 2026  
**Status**: Ready for Development  
**Next Review**: Monthly (End of Phase 1)

