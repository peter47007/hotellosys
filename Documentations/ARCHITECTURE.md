# HotelloSys - Technical Architecture Document

## System Overview

HotelloSys is a three-tier enterprise desktop application built with modern .NET technologies.

```
┌─────────────────────────────────────┐
│      Presentation Layer (WPF)       │
│    - Windows Forms with XAML        │
│    - MVVM Pattern                   │
│    - Real-time UI Updates           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Business Logic Layer (Services)   │
│    - Authentication Service         │
│    - Reservation Service            │
│    - Inventory Service              │
│    - Billing Service                │
│    - Reporting Service              │
│    - etc.                           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Data Access Layer (Repositories)   │
│    - Entity Framework Core          │
│    - LINQ Queries                   │
│    - Database Operations            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      PostgreSQL Database            │
│    - Tables & Relationships         │
│    - Indexes & Constraints          │
│    - Stored Procedures (optional)   │
└─────────────────────────────────────┘
```

---

## Design Patterns Used

### 1. **Model-View-ViewModel (MVVM)**
Used in WPF application for separation of concerns.

**Example**:
```
LoginWindow.xaml (View)
        ↓
LoginWindow.xaml.cs (Code-behind - minimal)
        ↓
LoginViewModel.cs (ViewModel - logic)
        ↓
AuthenticationService.cs (Service - business logic)
        ↓
EmployeeRepository.cs (Repository - data access)
```

### 2. **Repository Pattern**
Abstracts data access logic from business logic.

```csharp
public interface IEmployeeRepository
{
    Task<Employee> GetByIdAsync(int id);
    Task<Employee> GetByUsernameAsync(string username);
    Task<IEnumerable<Employee>> GetAllAsync();
    Task<Employee> CreateAsync(Employee employee);
    Task UpdateAsync(Employee employee);
    Task DeleteAsync(int id);
}
```

### 3. **Dependency Injection (DI)**
All services use constructor injection for loose coupling.

```csharp
public class LoginViewModel
{
    private readonly IAuthenticationService _authService;
    
    public LoginViewModel(IAuthenticationService authService)
    {
        _authService = authService;
    }
}
```

### 4. **Service Layer Pattern**
Business logic separated from data access.

```csharp
// Service - Business Logic
public class ReservationService : IReservationService
{
    private readonly IReservationRepository _repo;
    private readonly IInventoryService _inventory;
    
    public async Task<Reservation> CreateReservationAsync(Reservation res)
    {
        // Business logic here
        // Validation
        // Rules enforcement
        return await _repo.CreateAsync(res);
    }
}
```

### 5. **Factory Pattern**
For creating complex objects.

```csharp
public interface IPrinterFactory
{
    IPrinter CreatePrinter(PrinterType type);
}

public class PrinterFactory : IPrinterFactory
{
    public IPrinter CreatePrinter(PrinterType type)
    {
        return type switch
        {
            PrinterType.Thermal => new ThermalPrinter(),
            PrinterType.Regular => new RegularPrinter(),
            _ => throw new NotSupportedException()
        };
    }
}
```

### 6. **Observer Pattern**
For real-time updates (e.g., inventory changes).

```csharp
public interface IInventoryObserver
{
    void OnStockChanged(InventoryItem item);
}

public class KitchenDisplaySystem : IInventoryObserver
{
    public void OnStockChanged(InventoryItem item)
    {
        // Update KDS display
    }
}
```

---

## Project Dependencies

```
HotelloSys.UI
├── HotelloSys.Core
├── HotelloSys.Data
└── WPF Framework

HotelloSys.API
├── HotelloSys.Core
└── HotelloSys.Data

HotelloSys.Tests
├── HotelloSys.Core
├── xUnit
└── Moq

HotelloSys.Data
└── HotelloSys.Core

HotelloSys.Core
└── (No dependencies on other projects)
```

---

## Database Schema Relationships

```
Hotels (1) ──────────→ (Many) Employees
   ↓
   ├─→ Departments
   ├─→ Rooms → RoomTypes
   ├─→ Customers
   ├─→ InventoryItems
   ├─→ MenuItems
   └─→ Invoices

Employees (1) ──────→ (Many) Orders
   ↓
   ├─→ Reservations
   ├─→ Invoices
   └─→ AuditLogs

Reservations (1) ────→ (Many) Invoices
   ↓
   └─→ Customers
   └─→ Rooms

Orders (1) ──────────→ (Many) OrderItems → MenuItems

Invoices (1) ────────→ (Many) InvoiceLineItems
   ↓
   └─→ Payments
```

---

## Core Services

### 1. **Authentication Service**
- User login/logout
- Password management
- Role-based access control (RBAC)
- Session management

### 2. **Reservation Service**
- Create/modify/cancel reservations
- Room availability checking
- Check-in/check-out process
- Overbooking prevention

### 3. **Inventory Service**
- Track stock levels
- Process in/out transactions
- Low stock alerts
- Barcode integration

### 4. **Billing Service**
- Generate invoices
- Calculate totals and taxes
- Process payments
- Handle discounts and service charges

### 5. **Reporting Service**
- Generate various reports
- Export to PDF/Excel
- Schedule report generation
- Email delivery

### 6. **Order Service**
- Create orders (Restaurant/Bar)
- Update order status
- Manage kitchen display system (KDS)
- Integrate with inventory

---

## Security Architecture

### Authentication
- Username/Password authentication
- Password hashing with PBKDF2 + salt
- Failed login attempt tracking
- Session timeout management

### Authorization
- Role-Based Access Control (RBAC)
- Fine-grained permissions per role
- Feature-level access control
- Department-level restrictions

### Data Protection
- Encrypted password storage
- Audit trail of all changes
- Sensitive data encryption (optional)
- Two-factor authentication (future)

### Network Security
- Local network only (LAN)
- Connection string encryption
- API authentication (JWT for web)
- HTTPS for web services

---

## Performance Considerations

### Database Optimization
1. **Indexes**: Created on frequently queried columns
   - Employee.Username
   - Reservation.CheckInDate/CheckOutDate
   - Invoice.InvoiceNumber
   - AuditLog.ActionDate

2. **Query Optimization**: LINQ queries optimized to:
   - Use `.AsNoTracking()` for read-only queries
   - Eager load related data with `.Include()`
   - Use pagination for large datasets

3. **Connection Pooling**: Entity Framework Core manages connection pool automatically

### UI Performance
1. **Data Binding**: Async operations to prevent UI freezing
2. **Virtual Scrolling**: For large DataGrids
3. **Lazy Loading**: Load data on demand
4. **Caching**: Cache frequently accessed data

### Scalability
- Designed to handle 30-100 concurrent users
- Database designed for growth beyond 1 million records
- Can be extended to multi-hotel deployment
- Web API ready for cloud deployment

---

## Configuration Management

### Application Settings
Stored in `appsettings.json`:
```json
{
  "ConnectionStrings": { },
  "Logging": { },
  "HotelloSys": {
    "DefaultLanguage": "en-US",
    "TimeZone": "UTC",
    "MaxLoginAttempts": 5,
    "SessionTimeout": 30
  }
}
```

### Database Configuration
- Connection string per environment (Dev, Test, Production)
- Migration scripts for version management
- Backup scheduling configuration

### Printer Configuration
- Stored in database (PrinterConfiguration table)
- Runtime configuration UI in settings
- Support for multiple printers

---

## Data Flow Example: Creating a Reservation

```
1. User fills reservation form in UI (ReservationView)
   ↓
2. ViewModel validates input (ReservationViewModel)
   ↓
3. ViewModel calls service (ReservationService.CreateAsync())
   ↓
4. Service validates business rules:
   - Check room availability
   - Validate dates
   - Verify customer
   - Calculate pricing
   ↓
5. Service calls repository (ReservationRepository.CreateAsync())
   ↓
6. Repository performs database insert via EF Core
   ↓
7. Database triggers:
   - Create audit log entry
   - Update room status
   ↓
8. Service publishes event (ReservationCreatedEvent)
   ↓
9. UI updates with confirmation
   ↓
10. Notification sent (Email, SMS - optional)
```

---

## Error Handling

### Exception Hierarchy
```
Exception
├── HotelloSysException (custom base)
│   ├── InvalidCredentialsException
│   ├── InsufficientInventoryException
│   ├── RoomNotAvailableException
│   ├── DuplicateInvoiceException
│   └── ... (other domain exceptions)
└── (Framework exceptions)
```

### Logging Strategy
- Structured logging with Serilog
- Different levels: Trace, Debug, Information, Warning, Error, Fatal
- Logs written to:
  - File system
  - Event Viewer (Windows)
  - Database (audit trail)

---

## Testing Strategy

### Unit Tests
- Services tested in isolation
- Repositories mocked
- Business logic validation
- Example: `AuthenticationServiceTests.cs`

### Integration Tests
- Database operations tested
- End-to-end workflows
- Example: `ReservationRepositoryIntegrationTests.cs`

### UI Tests
- ViewModel behavior
- Command execution
- Data binding

### Load Testing
- 50+ concurrent users
- 1000+ orders per minute (restaurant peak)
- 10000+ inventory transactions per day

---

## Deployment Architecture

### Single-Hotel Installation
```
Hotel PC
├── WPF Application (HotelloSys.UI.exe)
├── PostgreSQL Database (local or network)
├── Configuration Files
└── Backup Storage (external drive)
```

### Multi-Hotel Deployment (Premium)
```
Central Server
├── Database (PostgreSQL)
├── Web API (HotelloSys.API)
└── Backup Services

Hotel 1 → WPF App (connects to central DB)
Hotel 2 → WPF App (connects to central DB)
Hotel 3 → WPF App (connects to central DB)
```

---

## Future Scalability

### Cloud Deployment (Phase 2+)
- Migrate to Azure SQL Database
- Host API on Azure App Service
- Use Azure Blob Storage for backups
- Implement multi-tenancy at database level

### Mobile App (Phase 3+)
- Native iOS/Android apps using Xamarin
- Share code with API
- Real-time synchronization

### Analytics Platform (Phase 4+)
- Big Data processing
- Business Intelligence dashboards
- Predictive analytics
- Machine learning for recommendations

---

## Version Control Strategy

### Git Branching
```
main (production)
├── develop (staging)
│   ├── feature/login-system
│   ├── feature/reservations
│   ├── bugfix/printer-issue
│   └── release/v1.0.0
```

### Commit Convention
```
feat: Add email notifications for reservations
fix: Correct decimal precision in billing
docs: Update database schema documentation
test: Add tests for inventory service
refactor: Simplify authentication service
```

---

## Monitoring & Maintenance

### Health Checks
- Database connectivity
- Required file paths
- Printer availability
- Backup completion

### Performance Monitoring
- Query execution time
- Application response time
- Memory usage
- Database file size

### Automated Maintenance
- Daily backup execution
- Index optimization
- Log file rotation
- Update checks

---

## Change Management

### Adding a New Feature
1. Create feature branch
2. Create models in HotelloSys.Core
3. Create repository interface/implementation in HotelloSys.Data
4. Create service interface/implementation in HotelloSys.Core
5. Create ViewModel in HotelloSys.UI
6. Create View (XAML) in HotelloSys.UI
7. Write unit tests in HotelloSys.Tests
8. Integration testing
9. Code review
10. Merge to develop → main

### Database Changes
1. Create migration: `dotnet ef migrations add MigrationName`
2. Review generated migration file
3. Apply migration: `dotnet ef database update`
4. Commit migration to version control
5. Document schema changes

---

**Architecture Version**: 1.0  
**Last Updated**: January 24, 2026  
**For Questions**: See HotelloSys_Complete_Development_Plan.md
