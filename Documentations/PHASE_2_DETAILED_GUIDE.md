# Phase 2: Employee & Department Management - DETAILED GUIDE

**Phase Duration**: 4 weeks (Weeks 5-8)  
**Estimated Hours**: 90-110 hours  
**Weekly Target**: 22-28 hours/week  
**Complexity**: Medium  
**Dependencies**: Phase 1 (Foundation) must be complete

---

## Phase Overview

Phase 2 focuses on building the employee and department management system. This phase expands the basic authentication from Phase 1 into a full employee lifecycle management system with departments, roles, job positions, and employment tracking.

### Key Objectives:
- Expand role-based access control (RBAC) system
- Create department management module - **Hotel Owners Can Add, Modify, Delete Departments** (NEW)
- Implement employee lifecycle (hire, transfer, terminate)
- Build employee directory
- Create department/team management
- Implement employee leave management
- Add salary/compensation tracking
- Create employee reports

### NEW FEATURE: Hotel Owners Can Manage Departments
- Hotel owners (HotelOwner role) can create, update, and delete departments
- Full CRUD API endpoints
- Complex department hierarchies supported
- Employees automatically linked to departments
- Audit trail for all changes
- See detailed section: **\"Department Management CRUD System\"**

### Business Value:
- Centralized employee information management
- Role-based permission system
- Department organization
- Employment lifecycle tracking
- Compliance with employment records
- Hotel owners flexible organizational structure

---

## Week 1: Department & Role Structure (22-25 hours)

### Week 1 Overview
Establish the foundation for employee management by creating the department, role, and permission hierarchy.

### Monday - Project Structure & Dependencies

**Morning (3-4 hours)**:
1. Create folder structure for Phase 2:
   ```
   HotelloSys.Core/
     Models/
       Department.cs
       Role.cs
       RolePermission.cs
       Permission.cs
       EmployeeRole.cs
     Services/
       DepartmentService.cs
       RoleService.cs
       RolePermissionService.cs
   
   HotelloSys.Data/
     Repositories/
       DepartmentRepository.cs
       RoleRepository.cs
       PermissionRepository.cs
   
   HotelloSys.UI/
     Views/
       Departments/
         DepartmentWindow.xaml
         DepartmentListView.xaml
     ViewModels/
       DepartmentViewModel.cs
       DepartmentListViewModel.cs
   ```

2. Create NuGet package dependencies (if needed):
   - AutoMapper (for DTO mapping)
   - FluentValidation (for business rule validation)

3. Update DbContext with new DbSets

**Afternoon (2-3 hours)**:
1. Create git branch for Phase 2
2. Set up unit test project structure
3. Create test fixtures and mock data

**Daily Deliverable**: Folder structure created, dependencies installed, git branch ready

---

### Tuesday - Department Model & Repository

**Morning (3-4 hours)**:
1. Create Department.cs model:
```csharp
namespace HotelloSys.Core.Models
{
    /// <summary>
    /// Represents a hotel department/division
    /// </summary>
    public class Department
    {
        /// <summary>
        /// Unique identifier for the department
        /// </summary>
        public int DepartmentId { get; set; }

        /// <summary>
        /// Department name (e.g., "Front Desk", "Housekeeping")
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Department description/purpose
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Department manager employee ID
        /// </summary>
        public int? ManagerId { get; set; }

        /// <summary>
        /// Department head/manager employee
        /// </summary>
        public Employee? Manager { get; set; }

        /// <summary>
        /// Budget allocated to this department
        /// </summary>
        public decimal Budget { get; set; }

        /// <summary>
        /// Department location/floor
        /// </summary>
        public string? Location { get; set; }

        /// <summary>
        /// Is department active
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Employees in this department
        /// </summary>
        public ICollection<Employee> Employees { get; set; } = new List<Employee>();

        /// <summary>
        /// Audit properties
        /// </summary>
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }
        public string UpdatedBy { get; set; } = string.Empty;
    }
}
```

2. Create DepartmentRepository.cs with CRUD operations:
```csharp
namespace HotelloSys.Data.Repositories
{
    public class DepartmentRepository : IRepository<Department>
    {
        private readonly HotelloSysDbContext _context;

        public DepartmentRepository(HotelloSysDbContext context)
        {
            _context = context;
        }

        public async Task<Department?> GetByIdAsync(int id)
        {
            return await _context.Departments
                .Include(d => d.Manager)
                .Include(d => d.Employees)
                .FirstOrDefaultAsync(d => d.DepartmentId == id);
        }

        public async Task<IEnumerable<Department>> GetAllAsync()
        {
            return await _context.Departments
                .Where(d => d.IsActive)
                .OrderBy(d => d.Name)
                .ToListAsync();
        }

        public async Task<Department> AddAsync(Department entity)
        {
            _context.Departments.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task UpdateAsync(Department entity)
        {
            _context.Departments.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var department = await GetByIdAsync(id);
            if (department != null)
            {
                department.IsActive = false; // Soft delete
                await UpdateAsync(department);
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Departments.AnyAsync(d => d.DepartmentId == id);
        }
    }
}
```

**Afternoon (2-3 hours)**:
1. Create unit tests for Department model
2. Create unit tests for DepartmentRepository (CRUD operations)
3. Verify tests pass

**Daily Deliverable**: Department model created with validation, repository with CRUD ops, tests passing

---

### Wednesday - Role & Permission Models

**Morning (3-4 hours)**:
1. Create Permission.cs:
```csharp
namespace HotelloSys.Core.Models
{
    /// <summary>
    /// Represents a system permission/capability
    /// </summary>
    public class Permission
    {
        public int PermissionId { get; set; }
        public string PermissionName { get; set; } = string.Empty; // "CanViewReservations"
        public string PermissionCode { get; set; } = string.Empty; // "VIEW_RESERVATIONS"
        public string? Description { get; set; }
        public string? Module { get; set; } // "Reservations", "Rooms", "Billing"
        public bool IsActive { get; set; } = true;

        public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }
}
```

2. Create Role.cs:
```csharp
namespace HotelloSys.Core.Models
{
    /// <summary>
    /// Represents a user role with specific permissions
    /// </summary>
    public class Role
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty; // "Manager", "Receptionist"
        public string? Description { get; set; }
        public int HierarchyLevel { get; set; } // 1=Admin, 2=Manager, 3=Staff, 4=Guest
        public bool IsActive { get; set; } = true;

        public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
        public ICollection<Employee> Employees { get; set; } = new List<Employee>();

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }
        public string UpdatedBy { get; set; } = string.Empty;
    }
}
```

3. Create RolePermission.cs (Junction table):
```csharp
namespace HotelloSys.Core.Models
{
    /// <summary>
    /// Junction table for Role-Permission many-to-many relationship
    /// </summary>
    public class RolePermission
    {
        public int RolePermissionId { get; set; }
        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;
        public int PermissionId { get; set; }
        public Permission Permission { get; set; } = null!;
        public DateTime AssignedAt { get; set; }
        public string AssignedBy { get; set; } = string.Empty;
    }
}
```

**Afternoon (2-3 hours)**:
1. Create RoleRepository.cs
2. Create PermissionRepository.cs
3. Create unit tests for both models and repositories

**Daily Deliverable**: Permission, Role, RolePermission models created, repositories implemented, tests passing

---

### Thursday - Role Service & Permissions Logic

**Morning (3-4 hours)**:
1. Create RoleService.cs:
```csharp
namespace HotelloSys.Core.Services
{
    public interface IRoleService
    {
        Task<Role> CreateRoleAsync(string roleName, string description, int hierarchyLevel);
        Task UpdateRoleAsync(Role role);
        Task<Role?> GetRoleByIdAsync(int roleId);
        Task<IEnumerable<Role>> GetAllRolesAsync();
        Task AssignPermissionToRoleAsync(int roleId, int permissionId);
        Task RemovePermissionFromRoleAsync(int roleId, int permissionId);
        Task<IEnumerable<Permission>> GetRolePermissionsAsync(int roleId);
        Task<bool> EmployeeHasPermissionAsync(int employeeId, string permissionCode);
        Task<IEnumerable<Role>> GetRolesByHierarchyLevelAsync(int level);
    }

    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IPermissionRepository _permissionRepository;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IAuditService _auditService;

        public RoleService(
            IRoleRepository roleRepository,
            IPermissionRepository permissionRepository,
            IEmployeeRepository employeeRepository,
            IAuditService auditService)
        {
            _roleRepository = roleRepository;
            _permissionRepository = permissionRepository;
            _employeeRepository = employeeRepository;
            _auditService = auditService;
        }

        public async Task<Role> CreateRoleAsync(string roleName, string description, int hierarchyLevel)
        {
            if (string.IsNullOrWhiteSpace(roleName))
                throw new ArgumentException("Role name is required");

            if (hierarchyLevel < 1 || hierarchyLevel > 4)
                throw new ArgumentException("Hierarchy level must be between 1 and 4");

            var role = new Role
            {
                RoleName = roleName,
                Description = description,
                HierarchyLevel = hierarchyLevel,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System" // Should be current user
            };

            var createdRole = await _roleRepository.AddAsync(role);
            await _auditService.LogActionAsync("ROLE_CREATED", $"Created role: {roleName}");
            return createdRole;
        }

        public async Task<bool> EmployeeHasPermissionAsync(int employeeId, string permissionCode)
        {
            var employee = await _employeeRepository.GetByIdAsync(employeeId);
            if (employee == null || employee.RoleId == null)
                return false;

            var permissions = await GetRolePermissionsAsync(employee.RoleId.Value);
            return permissions.Any(p => p.PermissionCode == permissionCode);
        }

        // Additional methods...
    }
}
```

**Afternoon (2-3 hours)**:
1. Create RolePermissionService.cs
2. Create permission validation utilities
3. Unit tests for RoleService

**Daily Deliverable**: RoleService implemented with permission logic, tests passing

---

### Friday - Database Migration & UI Foundation

**Morning (3-4 hours)**:
1. Create EF Core migration:
```powershell
Add-Migration Phase2_DepartmentRoleStructure
```

2. Update HotelloSysDbContext.cs with new DbSets:
```csharp
public DbSet<Department> Departments { get; set; }
public DbSet<Role> Roles { get; set; }
public DbSet<Permission> Permissions { get; set; }
public DbSet<RolePermission> RolePermissions { get; set; }
```

3. Add seed data for roles and permissions

4. Run migration and verify database

**Afternoon (2-3 hours)**:
1. Create DepartmentWindow.xaml (WPF view)
2. Create DepartmentViewModel.cs
3. Implement basic CRUD UI

**Daily Deliverable**: Database migration complete, seed data loaded, basic UI structure created

**Weekly Deliverable**: 
- ✅ Department model & repository
- ✅ Role & Permission models
- ✅ RoleService with permission logic
- ✅ Database migration complete
- ✅ Basic CRUD UI
- ✅ Unit tests for all components

---

## Week 2: Employee Lifecycle (22-25 hours)

### Week 2 Overview
Implement comprehensive employee management including hiring, transfers, and termination.

### Monday - Employee Model Enhancement

**Morning (3-4 hours)**:
1. Update Employee.cs model with additional properties:
```csharp
namespace HotelloSys.Core.Models
{
    public class Employee
    {
        // ... existing properties ...

        /// <summary>
        /// Employee's job position/title
        /// </summary>
        public string? Position { get; set; }

        /// <summary>
        /// Employee hire date
        /// </summary>
        public DateTime HireDate { get; set; }

        /// <summary>
        /// Employee termination date (null if active)
        /// </summary>
        public DateTime? TerminationDate { get; set; }

        /// <summary>
        /// Employee salary/wage
        /// </summary>
        public decimal Salary { get; set; }

        /// <summary>
        /// Employment status (Active, OnLeave, Terminated, Suspended)
        /// </summary>
        public EmploymentStatus EmploymentStatus { get; set; }

        /// <summary>
        /// Date of birth
        /// </summary>
        public DateTime? DateOfBirth { get; set; }

        /// <summary>
        /// Employee address
        /// </summary>
        public string? Address { get; set; }

        /// <summary>
        /// Employee phone number
        /// </summary>
        public string? PhoneNumber { get; set; }

        /// <summary>
        /// Employee email
        /// </summary>
        public string? Email { get; set; }

        /// <summary>
        /// National ID/SSN
        /// </summary>
        public string? NationalId { get; set; }

        /// <summary>
        /// Emergency contact name
        /// </summary>
        public string? EmergencyContactName { get; set; }

        /// <summary>
        /// Emergency contact phone
        /// </summary>
        public string? EmergencyContactPhone { get; set; }

        /// <summary>
        /// Employee bank details for salary
        /// </summary>
        public string? BankDetails { get; set; }

        /// <summary>
        /// Manager/supervisor ID
        /// </summary>
        public int? ManagerId { get; set; }

        /// <summary>
        /// Manager/supervisor reference
        /// </summary>
        public Employee? Manager { get; set; }

        /// <summary>
        /// Direct reports
        /// </summary>
        public ICollection<Employee> DirectReports { get; set; } = new List<Employee>();

        /// <summary>
        /// Employee performance reviews
        /// </summary>
        public ICollection<PerformanceReview> PerformanceReviews { get; set; } = new List<PerformanceReview>();

        /// <summary>
        /// Employee leave records
        /// </summary>
        public ICollection<LeaveRecord> LeaveRecords { get; set; } = new List<LeaveRecord>();

        /// <summary>
        /// Employee salary history
        /// </summary>
        public ICollection<SalaryHistory> SalaryHistory { get; set; } = new List<SalaryHistory>();
    }

    /// <summary>
    /// Employment status enumeration
    /// </summary>
    public enum EmploymentStatus
    {
        Active = 1,
        OnLeave = 2,
        Suspended = 3,
        Terminated = 4
    }
}
```

2. Create EmploymentHistory.cs:
```csharp
namespace HotelloSys.Core.Models
{
    /// <summary>
    /// Tracks employment status changes and transfers
    /// </summary>
    public class EmploymentHistory
    {
        public int EmploymentHistoryId { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; } = null!;

        public EmploymentStatus PreviousStatus { get; set; }
        public EmploymentStatus NewStatus { get; set; }

        public int? PreviousDepartmentId { get; set; }
        public int? NewDepartmentId { get; set; }

        public string? Reason { get; set; }

        public DateTime EffectiveDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }
}
```

**Afternoon (2-3 hours)**:
1. Create unit tests for enhanced Employee model
2. Create EmploymentHistoryRepository
3. Update DbContext and create migration

**Daily Deliverable**: Enhanced Employee model, EmploymentHistory tracking, migration created

---

### Tuesday - Employee Service

**Morning (3-4 hours)**:
1. Create EmployeeService.cs:
```csharp
namespace HotelloSys.Core.Services
{
    public interface IEmployeeService
    {
        Task<Employee> HireEmployeeAsync(HireEmployeeRequest request);
        Task TransferEmployeeAsync(int employeeId, int newDepartmentId, string reason);
        Task TerminateEmployeeAsync(int employeeId, string reason);
        Task UpdateEmployeeSalaryAsync(int employeeId, decimal newSalary, string reason);
        Task<Employee?> GetEmployeeByIdAsync(int id);
        Task<IEnumerable<Employee>> GetEmployeesByDepartmentAsync(int departmentId);
        Task<IEnumerable<Employee>> GetActiveEmployeesAsync();
        Task<IEnumerable<EmploymentHistory>> GetEmploymentHistoryAsync(int employeeId);
        Task<decimal> CalculateTotalPayrollAsync(int departmentId);
    }

    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IDepartmentRepository _departmentRepository;
        private readonly IRoleService _roleService;
        private readonly IAuditService _auditService;

        public EmployeeService(
            IEmployeeRepository employeeRepository,
            IDepartmentRepository departmentRepository,
            IRoleService roleService,
            IAuditService auditService)
        {
            _employeeRepository = employeeRepository;
            _departmentRepository = departmentRepository;
            _roleService = roleService;
            _auditService = auditService;
        }

        public async Task<Employee> HireEmployeeAsync(HireEmployeeRequest request)
        {
            // Validate department
            var department = await _departmentRepository.GetByIdAsync(request.DepartmentId);
            if (department == null || !department.IsActive)
                throw new InvalidOperationException("Invalid or inactive department");

            // Create employee
            var employee = new Employee
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Position = request.Position,
                DepartmentId = request.DepartmentId,
                RoleId = request.RoleId,
                HireDate = DateTime.UtcNow,
                EmploymentStatus = EmploymentStatus.Active,
                Salary = request.Salary,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                ManagerId = request.ManagerId,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            };

            var createdEmployee = await _employeeRepository.AddAsync(employee);

            // Log action
            await _auditService.LogActionAsync(
                "EMPLOYEE_HIRED",
                $"Hired employee: {employee.FirstName} {employee.LastName} (ID: {employee.EmployeeId})"
            );

            return createdEmployee;
        }

        public async Task TransferEmployeeAsync(int employeeId, int newDepartmentId, string reason)
        {
            var employee = await _employeeRepository.GetByIdAsync(employeeId);
            if (employee == null)
                throw new InvalidOperationException("Employee not found");

            var newDepartment = await _departmentRepository.GetByIdAsync(newDepartmentId);
            if (newDepartment == null)
                throw new InvalidOperationException("Invalid department");

            // Record history
            var history = new EmploymentHistory
            {
                EmployeeId = employeeId,
                PreviousDepartmentId = employee.DepartmentId,
                NewDepartmentId = newDepartmentId,
                Reason = reason,
                EffectiveDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            };

            // Update employee
            employee.DepartmentId = newDepartmentId;
            await _employeeRepository.UpdateAsync(employee);

            await _auditService.LogActionAsync(
                "EMPLOYEE_TRANSFERRED",
                $"Transferred employee {employee.FirstName} from dept {history.PreviousDepartmentId} to {newDepartmentId}"
            );
        }

        public async Task TerminateEmployeeAsync(int employeeId, string reason)
        {
            var employee = await _employeeRepository.GetByIdAsync(employeeId);
            if (employee == null)
                throw new InvalidOperationException("Employee not found");

            var previousStatus = employee.EmploymentStatus;

            // Update employee
            employee.EmploymentStatus = EmploymentStatus.Terminated;
            employee.TerminationDate = DateTime.UtcNow;
            await _employeeRepository.UpdateAsync(employee);

            // Record history
            var history = new EmploymentHistory
            {
                EmployeeId = employeeId,
                PreviousStatus = previousStatus,
                NewStatus = EmploymentStatus.Terminated,
                Reason = reason,
                EffectiveDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            };

            await _auditService.LogActionAsync(
                "EMPLOYEE_TERMINATED",
                $"Terminated employee: {employee.FirstName} {employee.LastName}. Reason: {reason}"
            );
        }

        // Additional methods...
    }
}
```

**Afternoon (2-3 hours)**:
1. Create HireEmployeeRequest DTO
2. Create unit tests for EmployeeService
3. Verify all methods work correctly

**Daily Deliverable**: EmployeeService with hire/transfer/terminate logic, tests passing

---

### Wednesday - Leave Management

**Morning (3-4 hours)**:
1. Create LeaveType.cs:
```csharp
namespace HotelloSys.Core.Models
{
    public class LeaveType
    {
        public int LeaveTypeId { get; set; }
        public string LeaveTypeName { get; set; } = string.Empty; // "Vacation", "Sick", "Medical"
        public int AnnualEntitlement { get; set; } // Days per year
        public bool RequiresApproval { get; set; } = true;
        public bool IsPaidLeave { get; set; } = true;
        public bool IsActive { get; set; } = true;

        public ICollection<LeaveRecord> LeaveRecords { get; set; } = new List<LeaveRecord>();

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }
}
```

2. Create LeaveRecord.cs:
```csharp
namespace HotelloSys.Core.Models
{
    public class LeaveRecord
    {
        public int LeaveRecordId { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; } = null!;

        public int LeaveTypeId { get; set; }
        public LeaveType LeaveType { get; set; } = null!;

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public int DaysRequested { get; set; }

        public LeaveStatus Status { get; set; }

        public string? Remarks { get; set; }

        public int? ApprovedByEmployeeId { get; set; }
        public Employee? ApprovedBy { get; set; }

        public DateTime? ApprovalDate { get; set; }

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }

    public enum LeaveStatus
    {
        Pending = 1,
        Approved = 2,
        Rejected = 3,
        Cancelled = 4
    }
}
```

3. Create LeaveService.cs with request/approval logic

**Afternoon (2-3 hours)**:
1. Create LeaveRepository
2. Create unit tests
3. Create database migration

**Daily Deliverable**: Leave management system implemented, tests passing

---

### Thursday - Salary Management

**Morning (3-4 hours)**:
1. Create SalaryHistory.cs:
```csharp
namespace HotelloSys.Core.Models
{
    public class SalaryHistory
    {
        public int SalaryHistoryId { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; } = null!;

        public decimal PreviousSalary { get; set; }
        public decimal NewSalary { get; set; }

        public string? Reason { get; set; } // "Promotion", "Raise", "Adjustment"

        public DateTime EffectiveDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }
}
```

2. Create SalaryService.cs with salary calculations
3. Create salary history tracking

**Afternoon (2-3 hours)**:
1. Create payroll calculation methods
2. Create unit tests
3. Create database migration

**Daily Deliverable**: Salary management and history tracking implemented

---

### Friday - Employee UI & Reporting

**Morning (3-4 hours)**:
1. Create EmployeeWindow.xaml (main employee management)
2. Create EmployeeViewModel.cs (MVVM binding)
3. Create EmployeeListView.xaml

**Afternoon (2-3 hours)**:
1. Create basic reports:
   - Employee directory
   - Department payroll summary
   - Leave balances
2. Create ReportService.cs
3. Test all UI functionality

**Weekly Deliverable**:
- ✅ Enhanced Employee model with lifecycle tracking
- ✅ Employment history tracking
- ✅ Leave management system
- ✅ Salary tracking
- ✅ Employee management UI
- ✅ Employee reports
- ✅ All tests passing

---

## Week 3: Department & Team Management (23-25 hours)

### Monday - Department Management UI (5-6 hours)
1. Create DepartmentListView with CRUD
2. Create DepartmentDetailView with staff
3. Create department budget tracking
4. Test all functionality

### Tuesday - Team Hierarchy (5-6 hours)
1. Implement manager-subordinate relationships
2. Create organizational chart visualization
3. Create team management UI
4. Unit tests

### Wednesday - Permission Administration (5-6 hours)
1. Create role-permission assignment UI
2. Create permission matrix view
3. Implement permission inheritance
4. Tests

### Thursday - Validation & Business Rules (4-5 hours)
1. Add FluentValidation rules
2. Implement salary range validation
3. Add leave balance validation
4. Unit tests

### Friday - Integration Testing (4-5 hours)
1. End-to-end testing of Phase 2 features
2. Performance testing with 500+ employees
3. Database optimization
4. Fix issues and refine UI

**Phase 2 Deliverables**:
- ✅ Complete department management
- ✅ Role-based access control (RBAC)
- ✅ Employee lifecycle management
- ✅ Leave management system
- ✅ Salary tracking
- ✅ Organizational hierarchy
- ✅ Employee directory
- ✅ Department reports
- ✅ Full unit test coverage
- ✅ Database schema complete

---

## Success Criteria

### Functional Requirements:
- [ ] All employees can be created, viewed, updated, deleted
- [ ] Departments can be created and managed
- [ ] Leave can be requested and approved
- [ ] Employee transfers/terminations tracked
- [ ] Salary changes audited
- [ ] Permissions assigned per role

### Technical Requirements:
- [ ] All services have async/await
- [ ] Unit test coverage > 70%
- [ ] Database migrations applied successfully
- [ ] No SQL injection vulnerabilities
- [ ] Soft deletes for data preservation

### Performance Requirements:
- [ ] Employee list loads < 500ms (1000+ employees)
- [ ] Department reports generate < 1000ms
- [ ] Leave approval < 200ms
- [ ] Salary updates < 500ms

### Code Quality:
- [ ] All code follows naming conventions
- [ ] XML documentation complete
- [ ] No code duplication
- [ ] SOLID principles applied
- [ ] Repository pattern used consistently

---

## Phase 2 Code Examples

### Employee Service Query Example
```csharp
public async Task<IEnumerable<Employee>> GetEmployeesByDepartmentAsync(int departmentId)
{
    return await _context.Employees
        .Where(e => e.DepartmentId == departmentId && 
                    e.EmploymentStatus == EmploymentStatus.Active)
        .Include(e => e.Department)
        .Include(e => e.Role)
        .OrderBy(e => e.LastName)
        .ThenBy(e => e.FirstName)
        .ToListAsync();
}
```

### Leave Validation Example
```csharp
public async Task<LeaveRecord> RequestLeaveAsync(LeaveRequest request)
{
    var employee = await _employeeRepository.GetByIdAsync(request.EmployeeId);
    if (employee == null)
        throw new InvalidOperationException("Employee not found");

    // Validate dates
    if (request.EndDate < request.StartDate)
        throw new InvalidOperationException("End date must be after start date");

    // Check leave balance
    var usedDays = await GetUsedLeaveDaysAsync(request.EmployeeId, request.LeaveTypeId);
    var leaveType = await _leaveTypeRepository.GetByIdAsync(request.LeaveTypeId);
    
    if (usedDays + request.DaysRequested > leaveType.AnnualEntitlement)
        throw new InvalidOperationException("Insufficient leave balance");

    // Create leave record
    var leaveRecord = new LeaveRecord
    {
        EmployeeId = request.EmployeeId,
        LeaveTypeId = request.LeaveTypeId,
        StartDate = request.StartDate,
        EndDate = request.EndDate,
        DaysRequested = request.DaysRequested,
        Status = LeaveStatus.Pending,
        CreatedAt = DateTime.UtcNow
    };

    return await _leaveRepository.AddAsync(leaveRecord);
}
```

---

## Dependencies & Blockers

**Dependencies**:
- ✅ Phase 1 (Authentication & Foundation) must be complete
- All models must have DbSet in DbContext
- Repository pattern must be established

**Potential Blockers**:
- Complex organizational hierarchies (self-referencing)
- Leave balance calculations across fiscal year
- Payroll integration with external systems

**Mitigation**:
- Use stored procedures for complex queries
- Cache leave balance calculations
- Design flexible payroll interface for Phase 6

---

## Testing Strategy

### Unit Tests (70% coverage target)
- All service methods
- All validation rules
- Repository CRUD operations
- Permission checks

### Integration Tests
- End-to-end employee hiring
- Leave request workflow
- Salary update tracking
- Department transfers

### UI Tests
- Employee list filtering
- Leave approval workflow
- Department budget view
- Report generation

---

## Rollback Plan

If issues arise:
1. Rollback latest migration: `Update-Database -Migration "Phase1_Foundation"`
2. Keep git branch for recovery
3. Identify data inconsistencies
4. Re-apply migration with fixes
5. Test thoroughly before commit

---

## Next Phase Dependency

Phase 3 (Rooms & Reservations) depends on:
- ✅ Employee system (housekeeping assignments)
- ✅ Role-based permissions (room management)
- ✅ Department hierarchy (front desk structure)

All Phase 2 deliverables must be complete before starting Phase 3.

---

## Phase 2 Completion Checklist

- [ ] All models created and documented
- [ ] All repositories implemented with CRUD
- [ ] All services implemented with business logic
- [ ] All DbSets added to DbContext
- [ ] Database migration created and applied
- [ ] Seed data loaded (departments, roles, permissions)
- [ ] XAML views created
- [ ] ViewModels implemented
- [ ] All unit tests passing (70%+ coverage)
- [ ] Integration tests passing
- [ ] No compiler errors or warnings
- [ ] Code reviewed
- [ ] Git branches merged to main
- [ ] Documentation updated
- [ ] Phase 3 dependencies verified ready

**Phase 2 COMPLETE when all checkboxes are marked ✅**
