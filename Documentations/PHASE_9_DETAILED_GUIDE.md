# Phase 9: Web Dashboard & Mobile Access - DETAILED GUIDE

**Phase Duration**: 5 weeks (Weeks 41-45)  
**Estimated Hours**: 155-180 hours  
**Weekly Target**: 31-36 hours/week  
**Complexity**: Very High  
**Dependencies**: Phases 1-8 (All systems complete)

**IMPORTANT**: This phase creates the WEB API and web/mobile dashboards. The desktop app is the main system.

---

## Phase Overview

Phase 9 extends the hotel management system with web-based dashboards and API for managers/guests to access the system remotely.

### Key Objectives:
- Create ASP.NET Core Web API
- Build manager web dashboard
- Create guest portal
- Implement mobile-responsive design
- Create API security and authentication
- Build real-time notifications
- Implement data synchronization
- Create mobile app compatibility

### Business Value:
- Remote access for managers
- Guest self-service capabilities
- Mobile accessibility
- 24/7 system availability
- Extended reach

---

## Week 1: Web API Foundation (30-35 hours)

### API Architecture

**Startup.cs / Program.cs** (ASP.NET Core 8):
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowWebAndMobile", policy =>
    {
        policy.WithOrigins("https://yourdomain.com", "https://app.yourdomain.com")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "HotelloSys",
            ValidAudience = "HotelloSysUsers",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "HotelloSys API", Version = "v1" });
});

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowWebAndMobile");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

### API Controllers

**AuthenticationController.cs**:
```csharp
[ApiController]
[Route("api/[controller]")]
public class AuthenticationController : ControllerBase
{
    private readonly IAuthenticationService _authService;
    private readonly IConfiguration _configuration;

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.AuthenticateAsync(request.Username, request.Password);

        if (result == null)
            return Unauthorized("Invalid credentials");

        var token = GenerateJwtToken(result);

        return Ok(new LoginResponse
        {
            Token = token,
            ExpiresIn = 3600,
            EmployeeId = result.EmployeeId,
            FirstName = result.FirstName,
            LastName = result.LastName,
            Role = result.Role.RoleName
        });
    }

    private string GenerateJwtToken(Employee employee)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, employee.EmployeeId.ToString()),
                new Claim(ClaimTypes.Name, $"{employee.FirstName} {employee.LastName}"),
                new Claim(ClaimTypes.Role, employee.Role.RoleName)
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
```

**ReservationController.cs** (API endpoints):
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReservationsController : ControllerBase
{
    private readonly IReservationService _reservationService;

    [HttpGet("{id}")]
    public async Task<ActionResult<ReservationDTO>> GetReservation(int id)
    {
        var reservation = await _reservationService.GetReservationByIdAsync(id);
        if (reservation == null)
            return NotFound();

        return Ok(MapToDTO(reservation));
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<ReservationDTO>>> SearchReservations(
        [FromQuery] string? guestName,
        [FromQuery] DateTime? checkInDate,
        [FromQuery] ReservationStatus? status)
    {
        var reservations = await _reservationService.SearchReservationsAsync(
            guestName, checkInDate, status
        );

        return Ok(reservations.Select(MapToDTO));
    }

    [HttpPost]
    [Authorize(Roles = "Manager,Receptionist")]
    public async Task<ActionResult<ReservationDTO>> CreateReservation([FromBody] CreateReservationDTO request)
    {
        var reservation = await _reservationService.CreateReservationAsync(
            MapToDomain(request)
        );

        return CreatedAtAction(nameof(GetReservation), new { id = reservation.ReservationId }, MapToDTO(reservation));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Manager,Receptionist")]
    public async Task<IActionResult> UpdateReservation(int id, [FromBody] UpdateReservationDTO request)
    {
        await _reservationService.UpdateReservationAsync(id, MapToDomain(request));
        return NoContent();
    }
}
```

---

## Week 2: Manager Web Dashboard (32-37 hours)

### Frontend (ASP.NET Core + Razor + JavaScript)

**Dashboard/Index.cshtml**:
```html
@{
    ViewData["Title"] = "Management Dashboard";
}

<div class="dashboard-container">
    <!-- KPI Cards -->
    <div class="kpi-row">
        <div class="kpi-card">
            <h3>Occupancy Rate</h3>
            <div id="occupancyGauge" style="width:100%;height:200px;"></div>
        </div>
        <div class="kpi-card">
            <h3>ADR</h3>
            <p id="adrValue" class="big-number">$0.00</p>
        </div>
        <div class="kpi-card">
            <h3>Today's Revenue</h3>
            <p id="revenueValue" class="big-number">$0.00</p>
        </div>
        <div class="kpi-card">
            <h3>Pending Issues</h3>
            <p id="issuesCount" class="big-number">0</p>
        </div>
    </div>

    <!-- Revenue Chart -->
    <div class="chart-section">
        <h3>Revenue Trend (30 days)</h3>
        <canvas id="revenueChart"></canvas>
    </div>

    <!-- Occupancy Forecast -->
    <div class="chart-section">
        <h3>Occupancy Forecast (14 days)</h3>
        <canvas id="occupancyChart"></canvas>
    </div>

    <!-- Alerts & Issues -->
    <div class="alerts-section">
        <h3>Alerts & Issues</h3>
        <table id="alertsTable" class="table">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Priority</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <!-- Populated by JavaScript -->
            </tbody>
        </table>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
        <button onclick="openNewReservation()" class="btn btn-primary">New Reservation</button>
        <button onclick="viewCheckins()" class="btn btn-secondary">Today's Check-ins</button>
        <button onclick="viewInventory()" class="btn btn-secondary">Inventory</button>
        <button onclick="generateReport()" class="btn btn-secondary">Generate Report</button>
    </div>
</div>

@section Scripts {
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
    <script src="~/js/dashboard.js"></script>
}
```

**dashboard.js**:
```javascript
// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    startRealtimeUpdates();
});

async function loadDashboardData() {
    const token = localStorage.getItem('authToken');
    
    try {
        // Load KPI data
        const kpiResponse = await fetch('/api/kpi/today', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const kpiData = await kpiResponse.json();

        // Update KPI cards
        document.getElementById('occupancyGauge').textContent = 
            kpiData.occupancyRate.toFixed(1) + '%';
        document.getElementById('adrValue').textContent = 
            '$' + kpiData.adr.toFixed(2);
        document.getElementById('revenueValue').textContent = 
            '$' + kpiData.dailyRevenue.toFixed(2);

        // Load revenue chart
        const chartResponse = await fetch('/api/reports/revenue?days=30', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const chartData = await chartResponse.json();
        renderRevenueChart(chartData);

        // Load alerts
        const alertsResponse = await fetch('/api/alerts', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const alerts = await alertsResponse.json();
        displayAlerts(alerts);

    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function startRealtimeUpdates() {
    // Update every 5 minutes
    setInterval(loadDashboardData, 300000);
}

function renderRevenueChart(data) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [{
                label: 'Revenue',
                data: data.revenues,
                borderColor: '#007bff',
                tension: 0.4
            }]
        }
    });
}
```

---

## Week 3: Guest Portal (30-35 hours)

### Guest Features

**GuestDashboard.cshtml**:
```html
<div class="guest-portal">
    <!-- Reservation Details -->
    <div class="reservation-card">
        <h3>Your Current Reservation</h3>
        <div class="reservation-info">
            <p>Room: <strong id="roomNumber"></strong></p>
            <p>Check-in: <strong id="checkInDate"></strong></p>
            <p>Check-out: <strong id="checkOutDate"></strong></p>
            <p>Balance Due: <strong id="balanceDue"></strong></p>
        </div>
    </div>

    <!-- Room Service -->
    <div class="service-section">
        <h3>Room Services</h3>
        <div class="service-buttons">
            <button onclick="callFrontDesk()" class="btn">Call Front Desk</button>
            <button onclick="requestHousekeeping()" class="btn">Housekeeping</button>
            <button onclick="orderRoomService()" class="btn">Room Service</button>
        </div>
    </div>

    <!-- Account & Preferences -->
    <div class="account-section">
        <h3>Account</h3>
        <ul>
            <li><a href="/guest/invoices">View Invoices</a></li>
            <li><a href="/guest/preferences">Update Preferences</a></li>
            <li><a href="/guest/loyalty">Loyalty Program</a></li>
        </ul>
    </div>
</div>
```

### Guest APIs

**GuestController.cs**:
```csharp
[ApiController]
[Route("api/guest")]
[Authorize(Roles = "Guest")]
public class GuestController : ControllerBase
{
    [HttpGet("reservation")]
    public async Task<ActionResult<ReservationDTO>> GetCurrentReservation()
    {
        var guestId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var reservation = await _reservationService.GetCurrentReservationAsync(guestId);

        if (reservation == null)
            return NotFound("No active reservation");

        return Ok(MapToDTO(reservation));
    }

    [HttpPost("requests/housekeeping")]
    public async Task<IActionResult> RequestHousekeeping([FromBody] HousekeepingRequestDTO request)
    {
        var guestId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        var maintenance = new MaintenanceRequest
        {
            RequestType = MaintenanceType.Housekeeping,
            Description = request.Description,
            RoomId = request.RoomId,
            Priority = request.Priority,
            CreatedAt = DateTime.UtcNow
        };

        await _maintenanceService.CreateMaintenanceRequestAsync(maintenance);

        return Ok(new { message = "Housekeeping request submitted" });
    }

    [HttpGet("invoices")]
    public async Task<ActionResult<IEnumerable<InvoiceDTO>>> GetInvoices()
    {
        var customerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var invoices = await _invoiceService.GetCustomerInvoicesAsync(customerId);

        return Ok(invoices.Select(MapToDTO));
    }
}
```

---

## Week 4-5: Mobile Optimization & Deployment (31-36 hours)

### Mobile App (React Native or Flutter bridge)

**Mobile-Responsive Design**:
```css
/* Responsive dashboard */
@media (max-width: 768px) {
    .dashboard-container {
        flex-direction: column;
    }

    .kpi-row {
        grid-template-columns: 1fr;
    }

    .chart-section {
        width: 100%;
        height: 300px;
    }
}
```

### Deployment

**Azure Deployment**:
1. Create Azure App Service (ASP.NET Core)
2. Set up Azure SQL Database
3. Configure Application Insights
4. Set up CI/CD with GitHub Actions
5. Configure SSL certificates

**.github/workflows/deploy.yml**:
```yaml
name: Deploy to Azure

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup .NET
        uses: actions/setup-dotnet@v1
        with:
          dotnet-version: '8.0.x'
      - name: Publish
        run: dotnet publish -c Release
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'hotellosaas'
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
          package: './publish'
```

---

## Phase 9 Key Deliverables

| Component | Details | Status |
|-----------|---------|--------|
| Web API | ASP.NET Core 8, JWT auth | ✅ |
| Manager Dashboard | Real-time, charts, alerts | ✅ |
| Guest Portal | Reservations, requests, invoices | ✅ |
| Mobile Responsive | All pages responsive | ✅ |
| API Documentation | Swagger/OpenAPI | ✅ |
| Deployment | Azure or hosting of choice | ✅ |

---

## Phase 9 Completion Checklist

- [ ] Web API fully implemented
- [ ] All API endpoints secured with JWT
- [ ] Manager dashboard fully functional
- [ ] Guest portal working
- [ ] Mobile responsive design complete
- [ ] API documentation (Swagger) complete
- [ ] Deployment infrastructure set up
- [ ] SSL certificates configured
- [ ] Performance tested
- [ ] No security vulnerabilities

**Ready for Phase 10 when complete** ✅
