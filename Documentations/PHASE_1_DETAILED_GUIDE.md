# HotelloSys - Phase 1: Foundation & Core System (Weeks 1-4)

## Phase 1 Overview

**Duration**: 4 weeks (6-8 weeks if part-time)  
**Total Hours**: 100-120 hours (~25-30 hours/week)  
**Objective**: Build the foundation for HotelloSys with authentication, authorization, database, license management, and basic UI structure

### NEW FEATURE: License Management System
Phase 1 now includes license key management to control module installations:
- One license key per PC installation
- Support for modular features (Rooms, Restaurant, Bar)
- License validation and expiration
- Feature flag configuration system
- See detailed section below: **"License Management Integration"**

---

## Phase 1 Deliverables Checklist

### Week 1: Project Setup & Database
- [ ] Create solution structure with 5 projects
- [ ] Install all NuGet packages
- [ ] Create PostgreSQL database "hotello_sys"
- [ ] Design and create database schema (15+ tables)
- [ ] Create Entity Framework migrations
- [ ] Document database schema
- [ ] Set up initial seed data (roles, departments)
- [ ] **Target Hours**: 20-25
- [ ] **Estimate**: 5-6 days

### Week 2: Authentication & Authorization
- [ ] Create Employee, Hotel, Department, Role models
- [ ] Create database repositories
- [ ] Implement AuthenticationService
  - [ ] Password hashing (PBKDF2)
  - [ ] Login functionality
  - [ ] Password management
  - [ ] Session tracking
- [ ] Implement role-based access control (RBAC)
- [ ] Create audit logging
- [ ] Write comprehensive unit tests
- [ ] **Target Hours**: 25-30
- [ ] **Estimate**: 6-7 days

### Week 3: WPF UI Foundation & MVVM
- [ ] Create WPF application shell
- [ ] Implement MVVM pattern infrastructure
  - [ ] Base ViewModel class
  - [ ] RelayCommand implementation
  - [ ] Dependency injection setup
- [ ] Create LoginWindow UI
  - [ ] XAML layout
  - [ ] LoginViewModel
  - [ ] Data binding
  - [ ] Validation
- [ ] Create MainWindow foundation
- [ ] Set up resource styles and themes
- [ ] Implement navigation between windows
- [ ] Write UI tests
- [ ] **Target Hours**: 30-35
- [ ] **Estimate**: 7-8 days

### Week 4: Hotel Configuration & System Setup
- [ ] Create Hotel setup wizard
  - [ ] Hotel details entry form
  - [ ] Database initialization
  - [ ] Admin user creation
- [ ] Implement system settings management
  - [ ] HotelSettings table & management
  - [ ] Settings retrieval and caching
  - [ ] Configuration UI
- [ ] Create basic dashboard
  - [ ] Employee welcome
  - [ ] Quick stats widgets
  - [ ] Menu navigation
- [ ] Write integration tests
- [ ] Code review and refactoring
- [ ] **Target Hours**: 25-30
- [ ] **Estimate**: 6-7 days

---

## Phase 1 Technical Tasks

### 1. Project Structure Setup (Day 1)

```bash
# From command line
cd C:\Users\Admin\OneDrive\Desktop\BuyzaProject\BuHoMaS\src

# Create solution
dotnet new sln -n HotelloSys

# Create class libraries
dotnet new classlib -n HotelloSys.Core
dotnet new classlib -n HotelloSys.Data

# Create WPF app
dotnet new wpf -n HotelloSys.UI

# Create Web API (for future use)
dotnet new webapi -n HotelloSys.API

# Create test project
dotnet new xunit -n HotelloSys.Tests

# Add all to solution
dotnet sln HotelloSys.sln add HotelloSys.Core/HotelloSys.Core.csproj
dotnet sln HotelloSys.sln add HotelloSys.Data/HotelloSys.Data.csproj
dotnet sln HotelloSys.sln add HotelloSys.UI/HotelloSys.UI.csproj
dotnet sln HotelloSys.sln add HotelloSys.API/HotelloSys.API.csproj
dotnet sln HotelloSys.sln add HotelloSys.Tests/HotelloSys.Tests.csproj
```

---

### 2. Database Setup (Days 1-2)

**Create PostgreSQL Database**:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE hotello_sys;

# Exit
\q
```

**Create Initial Tables** (using EF Core migrations):

This will be done via Entity Framework, but the tables created should match the schema in [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md):
- Hotels
- Employees
- Departments
- Roles
- RolePermissions
- Rooms
- RoomTypes
- Reservations
- Customers
- MenuItems
- MenuCategories
- Orders
- OrderItems
- Invoices
- InvoiceLineItems
- Payments
- InventoryItems
- InventoryCategories
- InventoryTransactions
- Suppliers
- LoyaltyPoints
- AuditLogs
- HotelSettings
- PrinterConfiguration
- LanguageSettings

---

### 3. Core Models (Days 2-3)

Create these models in `HotelloSys.Core\Models\`:

1. **Hotel.cs**
2. **Employee.cs** ← Sample code provided in main document
3. **Department.cs**
4. **Role.cs**
5. **RolePermission.cs**
6. **Room.cs**
7. **RoomType.cs**
8. **Reservation.cs**
9. **Customer.cs**
10. **Invoice.cs**
11. **Payment.cs**
12. **InventoryItem.cs**
13. **Order.cs**
14. **OrderItem.cs**
15. **MenuItem.cs**
16. **AuditLog.cs**

Each model should:
- Have appropriate properties with XML comments
- Include audit properties (CreatedDate, CreatedBy, ModifiedDate, ModifiedBy)
- Implement navigation properties for relationships
- Include validation attributes

---

### 4. Database Context (Day 3)

Create `HotelloSys.Data\Context\HotelloSysDbContext.cs`:

Key requirements:
- [ ] Inherit from DbContext
- [ ] Configure all 15+ DbSets
- [ ] Override OnModelCreating() for relationships
- [ ] Implement audit trail in SaveChanges()
- [ ] Seed initial roles and departments
- [ ] Handle foreign keys and constraints

Sample code provided in main document.

---

### 5. Repositories (Days 3-4)

Create in `HotelloSys.Data\Repositories\`:

1. **IRepository.cs** (generic interface)
2. **Repository.cs** (generic implementation)
3. **IEmployeeRepository.cs** (specialized interface)
4. **EmployeeRepository.cs** (specialized implementation)
5. Other specialized repositories as needed

Repositories should:
- [ ] Handle all CRUD operations
- [ ] Use LINQ for queries
- [ ] Include filtering and pagination
- [ ] Use async/await
- [ ] Include unit test support (use IRepository)

---

### 6. Authentication Service (Days 4-5)

Create in `HotelloSys.Core\Services\`:

**IAuthenticationService.cs**:
```csharp
public interface IAuthenticationService
{
    Task<Employee> AuthenticateAsync(string username, string password);
    Task<bool> RegisterEmployeeAsync(Employee employee, string password);
    Task<bool> ChangePasswordAsync(int employeeId, string oldPassword, string newPassword);
    Task<bool> ResetPasswordAsync(int employeeId, string newPassword);
    (bool isValid, string errorMessage) ValidatePasswordStrength(string password);
}
```

**AuthenticationService.cs**: (Sample code provided in main document)
- [ ] Implement password hashing with PBKDF2
- [ ] Validate passwords before hashing
- [ ] Track failed login attempts
- [ ] Update last login date
- [ ] Log authentication events

---

### 7. WPF Login Window (Days 5-6)

Create in `HotelloSys.UI\Views\`:

**LoginWindow.xaml**:
```xml
<Window>
    <StackPanel>
        <TextBlock Text="HotelloSys - Hotel Management" FontSize="24" FontWeight="Bold" />
        <TextBlock Text="Employee Login" FontSize="16" />
        
        <TextBlock Text="Username:" />
        <TextBox x:Name="UsernameTextBox" />
        
        <TextBlock Text="Password:" />
        <PasswordBox x:Name="PasswordBox" />
        
        <CheckBox Content="Remember Me" />
        
        <Button Content="Login" Command="{Binding LoginCommand}" />
        <Button Content="Exit" Command="{Binding ExitCommand}" />
        <Button Content="Forgot Password?" Command="{Binding ForgotPasswordCommand}" />
        
        <TextBlock Text="{Binding ErrorMessage}" Foreground="Red" />
    </StackPanel>
</Window>
```

**LoginViewModel.cs**: (Sample code provided in main document)
- [ ] Bind UI controls to ViewModel properties
- [ ] Implement RelayCommand for Login button
- [ ] Handle error messages
- [ ] Show loading indicator during login
- [ ] Remember Me functionality
- [ ] Send message on successful login

---

### 8. Dependency Injection Setup (Day 6)

In `HotelloSys.UI\App.xaml.cs` or separate `ServiceProvider.cs`:

```csharp
// Set up dependency injection
var services = new ServiceCollection();

// Register DbContext
services.AddDbContext<HotelloSysDbContext>(options =>
    options.UseNpgsql(connectionString)
);

// Register repositories
services.AddScoped<IEmployeeRepository, EmployeeRepository>();
services.AddScoped<IHotelRepository, HotelRepository>();
// ... other repositories

// Register services
services.AddScoped<IAuthenticationService, AuthenticationService>();
services.AddScoped<IAuditService, AuditService>();
// ... other services

// Register ViewModels
services.AddScoped<LoginViewModel>();
services.AddScoped<MainWindowViewModel>();

var serviceProvider = services.BuildServiceProvider();
```

---

### 9. Unit Tests (Days 6-7)

Create in `HotelloSys.Tests\UnitTests\Services\`:

**AuthenticationServiceTests.cs**:
```csharp
[Fact]
public async Task AuthenticateAsync_WithValidCredentials_ReturnsEmployee()
{
    // Arrange
    var authService = new AuthenticationService(mockRepo, mockAudit);
    
    // Act
    var result = await authService.AuthenticateAsync("admin", "Password123!");
    
    // Assert
    Assert.NotNull(result);
}

[Fact]
public async Task AuthenticateAsync_WithInvalidPassword_ReturnsNull()
{
    // Arrange & Act & Assert
}

[Theory]
[InlineData("short")]          // Too short
[InlineData("lowercase")]      // No uppercase
[InlineData("UPPERCASE")]      // No lowercase
[InlineData("NoDigits!")]      // No digits
public void ValidatePasswordStrength_WeakPassword_ReturnsFalse(string password)
{
    // Arrange & Act & Assert
}
```

---

### 10. Integration Tests (Day 7)

Create in `HotelloSys.Tests\IntegrationTests\`:

**EmployeeRepositoryIntegrationTests.cs**:
```csharp
[Fact]
public async Task CreateAsync_WithValidEmployee_InsertsToDatabase()
{
    // Use real DbContext
    // Verify database insertion
}

[Fact]
public async Task GetByUsernameAsync_WithExistingUsername_ReturnsEmployee()
{
    // Query database
    // Verify returned data
}
```

---

## Phase 1 Code Standards

### Naming Conventions
- **Classes**: PascalCase (Employee, AuthenticationService)
- **Methods**: PascalCase (GetEmployeeAsync, ValidatePassword)
- **Properties**: PascalCase (FirstName, IsActive)
- **Fields**: _camelCase (_employeeRepository, _logger)
- **Local Variables**: camelCase (employee, result)
- **Constants**: ALL_CAPS (HASH_ITERATIONS, SALT_SIZE)

### Code Comments
```csharp
/// <summary>
/// Authenticates employee with username and password
/// </summary>
/// <param name="username">Employee username</param>
/// <param name="password">Plain text password</param>
/// <returns>Employee if authenticated, null otherwise</returns>
public async Task<Employee> AuthenticateAsync(string username, string password)
{
    // Input validation
    if (string.IsNullOrWhiteSpace(username))
        return null;
    
    // Fetch employee
    var employee = await _repository.GetByUsernameAsync(username);
    
    // Verify password
    if (!VerifyPassword(password, employee.PasswordHash))
        return null;
    
    return employee;
}
```

### Exception Handling
- Create custom exceptions in `HotelloSys.Core\Exceptions\`
- Catch and log exceptions
- Return null or false for expected failures
- Log all exceptions to AuditLog

### Async/Await
- Always use async methods for database operations
- Method names end in "Async"
- Use ConfigureAwait(false) in libraries
- Don't use `.Result` (causes deadlocks)

---

---

## License Management Integration (NEW FEATURE)

### Phase 1: License System Foundation

This section adds license key management to control which modules are active and limit installations to one PC per license.

### 1. License Models (Add to Core/Models/)

**License.cs**:
```csharp
public class License
{
    public Guid LicenseId { get; set; }
    public string LicenseKey { get; set; } = string.Empty; // HOTELLO-XXXX-XXXX-XXXX-HOTELLO
    public Guid HotelId { get; set; }
    
    // Modules
    public bool RoomsModuleEnabled { get; set; } = true;
    public bool RestaurantModuleEnabled { get; set; } = false;
    public bool BarModuleEnabled { get; set; } = false;
    
    // Validation
    public DateTime IssuedDate { get; set; }
    public DateTime ValidUntil { get; set; }
    public int MaxInstallations { get; set; } = 1;  // One PC per license
    
    // Status
    public bool IsActive { get; set; } = true;
    public DateTime? ActivationDate { get; set; }
}

public class LicenseInstallation
{
    public Guid InstallationId { get; set; }
    public Guid LicenseId { get; set; }
    public License License { get; set; } = null!;
    
    // PC Identification
    public string MachineName { get; set; } = string.Empty;
    public string MachineId { get; set; } = string.Empty;  // Unique PC ID
    public string? WindowsProductId { get; set; }
    
    public DateTime InstalledDate { get; set; }
    public DateTime? LastUsedDate { get; set; }
}
```

### 2. License Service (Add to Core/Services/)

**ILicenseService.cs**:
```csharp
public interface ILicenseService
{
    Task<LicenseValidationResult> ValidateLicenseAsync(string licenseKey);
    Task<License?> GetLicenseAsync(string licenseKey);
    Task RegisterInstallationAsync(string licenseKey, string machineId);
    Task<bool> IsModuleEnabledAsync(string moduleName);
}
```

**LicenseService.cs**:
```csharp
public class LicenseService : ILicenseService
{
    private readonly HotelloSysDbContext _context;
    private readonly IConfiguration _config;
    
    public async Task<LicenseValidationResult> ValidateLicenseAsync(string licenseKey)
    {
        // Check format
        if (!IsValidFormat(licenseKey))
            return LicenseValidationResult.InvalidFormat;
        
        var license = await _context.Licenses
            .FirstOrDefaultAsync(l => l.LicenseKey == licenseKey);
        
        if (license == null)
            return LicenseValidationResult.NotFound;
        
        if (license.ValidUntil < DateTime.UtcNow)
            return LicenseValidationResult.Expired;
        
        if (license.LicenseInstallations.Count >= license.MaxInstallations)
            return LicenseValidationResult.LimitExceeded;
        
        return LicenseValidationResult.Valid;
    }
    
    public async Task<bool> IsModuleEnabledAsync(string moduleName)
    {
        var setting = _config[$"Modules:{moduleName}:Enabled"];
        return setting == "true";
    }
}

public enum LicenseValidationResult
{
    Valid,
    InvalidFormat,
    NotFound,
    Expired,
    LimitExceeded,
    InActive
}
```

### 3. Update appsettings.json

Add module configuration:
```json
{
  "Modules": {
    "RoomManagement": {
      "Enabled": true,
      "LicensedUntil": "2026-12-31"
    },
    "RestaurantOperations": {
      "Enabled": false,
      "LicensedUntil": null
    },
    "BarOperations": {
      "Enabled": false,
      "LicensedUntil": null
    }
  }
}
```

### 4. License Validation at Startup

Update `Program.cs`:
```csharp
// Register license service
builder.Services.AddScoped<ILicenseService, LicenseService>();

var app = builder.Build();

// Validate license on startup
using (var scope = app.Services.CreateScope())
{
    var licenseService = scope.ServiceProvider.GetRequiredService<ILicenseService>();
    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    
    var licenseKey = config["System:LicenseKey"];
    if (!string.IsNullOrEmpty(licenseKey))
    {
        var result = await licenseService.ValidateLicenseAsync(licenseKey);
        if (result != LicenseValidationResult.Valid)
        {
            Console.WriteLine($"License validation failed: {result}");
            // Optionally prevent startup
        }
    }
}
```

### 5. Database Migration

Create EF Core migration:
```bash
dotnet ef migrations add AddLicenseManagement
dotnet ef database update
```

### 6. Unit Tests for License System

**LicenseServiceTests.cs**:
```csharp
public class LicenseServiceTests
{
    [Fact]
    public async Task ValidateLicense_WithValidKey_ReturnsValid()
    {
        // Arrange
        var licenseKey = "HOTELLO-ABC1-DEF2-GHI3-HOTELLO";
        var license = new License { LicenseKey = licenseKey, ValidUntil = DateTime.UtcNow.AddYears(1) };
        // Mock database...
        
        // Act
        var result = await _licenseService.ValidateLicenseAsync(licenseKey);
        
        // Assert
        Assert.Equal(LicenseValidationResult.Valid, result);
    }
    
    [Fact]
    public async Task ValidateLicense_WithExpiredKey_ReturnsExpired()
    {
        // Test expired license
    }
}
```

### 7. Add to Week 1-4 Deliverables
- [ ] License models created
- [ ] License service implemented
- [ ] License validation at startup
- [ ] Database migration created and applied
- [ ] Unit tests for license system (70%+ coverage)
- [ ] Configuration updated with modules
- [ ] Documentation updated

---

## Phase 1 Configuration Files

### appsettings.json

`HotelloSys.Data\appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=hotello_sys;Username=postgres;Password=YOUR_PASSWORD;Include Error Detail=true"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  },
  "HotelloSys": {
    "DefaultLanguage": "en-US",
    "TimeZone": "UTC",
    "MaxLoginAttempts": 5,
    "SessionTimeoutMinutes": 30,
    "PasswordExpiryDays": 90
  },
  "System": {
    "LicenseKey": "HOTELLO-XXXX-XXXX-XXXX-HOTELLO"
  },
  "Modules": {
    "RoomManagement": {
      "Enabled": true,
      "LicensedUntil": "2026-12-31"
    },
    "RestaurantOperations": {
      "Enabled": false,
      "LicensedUntil": null
    },
    "BarOperations": {
      "Enabled": false,
      "LicensedUntil": null
    }
  }
}
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

---

## Phase 1 Key Decisions

### 1. Password Hashing Algorithm
**Decision**: PBKDF2 with SHA-256
**Why**: Industry standard, built into .NET, no external libraries needed

### 2. Audit Strategy
**Decision**: AuditLog table + SaveChanges override
**Why**: Captures all changes, immutable trail, GDPR compliant

### 3. Error Handling
**Decision**: Custom exceptions, return null for failures
**Why**: Distinguishes critical errors from expected failures

### 4. Dependency Injection
**Decision**: Microsoft.Extensions.DependencyInjection
**Why**: Built into .NET, no additional dependencies

### 5. Repository Pattern
**Decision**: Generic + specialized repositories
**Why**: Separates data access, easier to test, follows SOLID

---

## Phase 1 Testing Strategy

### Unit Tests (aim for 70%+ coverage)
- Test AuthenticationService methods
- Test password validation
- Test repository CRUD operations
- Test business logic in services
- Mock database access

### Integration Tests (aim for 30%+ coverage)
- Test repository with real database
- Test entity relationships
- Test EF Core configurations
- Test complete workflows

### Manual Testing
- Test login with valid/invalid credentials
- Test hotel setup wizard
- Test dashboard loading
- Verify database data is saved
- Test UI responsiveness

---

## Phase 1 Performance Targets

- Login: < 500ms
- Database query: < 100ms
- UI button response: < 100ms
- Window open: < 500ms
- No memory leaks
- Handles 100+ concurrent login attempts

---

## Phase 1 Security Checklist

- [ ] Passwords hashed with PBKDF2 + salt
- [ ] No plain text passwords in logs/memory
- [ ] Failed login attempts tracked
- [ ] SQL injection prevented (use parameterized queries)
- [ ] XSS prevention (WPF bound controls)
- [ ] CSRF prevention (not applicable to desktop app)
- [ ] Audit trail complete
- [ ] Sensitive data not logged
- [ ] Connection string stored securely (not hardcoded)

---

## Phase 1 Deployment Preparation

Not deploying yet, but prepare for Phase 12:

- [ ] Create migration scripts folder
- [ ] Document database setup steps
- [ ] Create installer/setup program skeleton
- [ ] Test backup/restore procedures
- [ ] Document configuration file locations
- [ ] Create user documentation template

---

## Phase 1 Documentation

Create these documents:

1. **PHASE_1_COMPLETION_REPORT.md**
   - What was built
   - What works
   - Known issues
   - Time tracking

2. **DATABASE_SETUP.md**
   - Database creation steps
   - Schema overview
   - Sample data

3. **DEVELOPER_GUIDE.md**
   - How to add new repositories
   - How to add new services
   - How to add new UI screens
   - Code organization

4. **TROUBLESHOOTING.md**
   - Common errors and solutions
   - Database connection issues
   - WPF debugging
   - EF Core migration issues

---

## Phase 1 Git Commit Messages

Use these commit patterns:

```
feat: Add authentication service and login window
feat: Create database schema and EF Core migrations
feat: Implement role-based access control (RBAC)
feat: Create employee repository and CRUD operations
feat: Add hotel setup wizard

fix: Fix password validation regex
fix: Correct null reference exception in login

test: Add unit tests for AuthenticationService
test: Add integration tests for EmployeeRepository

docs: Add Phase 1 completion documentation
docs: Document database schema

refactor: Extract duplicate code into helper method
refactor: Simplify MVVM base classes
```

---

## Phase 1 Success Criteria

You'll know Phase 1 is complete when:

✅ Solution builds without errors  
✅ All unit tests pass (70%+ coverage)  
✅ Login works with test credentials  
✅ Hotel setup wizard completes successfully  
✅ Dashboard displays after login  
✅ Database contains proper data  
✅ Audit logs are being created  
✅ RBAC prevents unauthorized access  
✅ Password validation works correctly  
✅ Error messages display on login failure  
✅ Code passes code review  
✅ Documentation is complete  
✅ Performance targets are met  

---

## Phase 1 → Phase 2 Transition

After Phase 1 is complete:

1. **Code Review**
   - Have someone review your code
   - Address feedback
   - Commit improvements

2. **Documentation**
   - Create API documentation
   - Document architecture decisions
   - Create troubleshooting guide

3. **Backup & Version**
   - Tag version 1.0.0 in Git
   - Create backup of Phase 1 codebase
   - Document lessons learned

4. **Plan Phase 2**
   - Review Phase 2 requirements
   - Identify dependencies
   - Estimate tasks
   - Create detailed task list

---

## Frequently Asked Phase 1 Questions

### Q: Should I test manually or write automated tests first?
A: Do both. Write automated unit tests, then manual testing to verify UI works.

### Q: How do I debug Entity Framework queries?
A: Enable logging in DbContext:
```csharp
optionsBuilder.LogTo(Console.WriteLine);
```

### Q: What if authentication fails for no reason?
A: Check:
1. Database connection string
2. Employee record exists in database
3. Password hash is stored correctly
4. Clock sync between machines (for some hashing algorithms)

### Q: How do I handle the PasswordBox control in WPF?
A: Use Behavior or attached behavior since PasswordBox doesn't support binding:
```xml
<PasswordBox Behavior:PasswordBoxBehavior.BindPassword="True" 
             Behavior:PasswordBoxBehavior.BoundPassword="{Binding Password}" />
```

### Q: Should I commit database backups to Git?
A: No! Only commit code. Store backups separately and add to .gitignore.

---

**Phase 1 Ready? Let's build! 🚀**

---

**Phase 1 Guide Version**: 1.0  
**Created**: January 24, 2026  
**For Questions**: See HotelloSys_Complete_Development_Plan.md
