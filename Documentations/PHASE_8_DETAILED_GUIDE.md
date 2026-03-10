# Phase 8: Reporting, Analytics & Business Intelligence - DETAILED GUIDE

**Phase Duration**: 4 weeks (Weeks 37-40)  
**Estimated Hours**: 115-135 hours  
**Weekly Target**: 28-34 hours/week  
**Complexity**: High  
**Dependencies**: Phases 1-7 (All systems complete)

---

## Phase Overview

Phase 8 creates comprehensive reporting and analytics capabilities providing business intelligence for decision-making.

### Key Objectives:
- Create occupancy analysis
- Build revenue reporting
- Implement operational metrics
- Create management dashboards
- Build business intelligence
- Implement data visualization
- Create export capabilities
- Build forecasting models

### Business Value:
- Real-time business insights
- Data-driven decision making
- Performance tracking
- Trend identification
- Forecasting accuracy

---

## Week 1: Occupancy & Revenue Reports (28-31 hours)

### Report Models

**OccupancyReport.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class OccupancyReport
    {
        public int ReportId { get; set; }
        public DateTime ReportDate { get; set; }

        public int TotalRooms { get; set; }
        public int OccupiedRooms { get; set; }
        public int ReservedRooms { get; set; }
        public int MaintenanceRooms { get; set; }
        public int AvailableRooms { get; set; }

        public decimal OccupancyRate { get; set; } // %
        public decimal RevenuePAR { get; set; } // Revenue Per Available Room
        public decimal ADR { get; set; } // Average Daily Rate

        public decimal PotentialRevenue { get; set; }
        public decimal ActualRevenue { get; set; }
        public decimal RevenuePercentageOfPotential { get; set; }

        public ICollection<OccupancyByRoomType> ByRoomType { get; set; } = new List<OccupancyByRoomType>();

        public DateTime CreatedAt { get; set; }
    }

    public class OccupancyByRoomType
    {
        public int Id { get; set; }
        public int OccupancyReportId { get; set; }
        public int RoomTypeId { get; set; }

        public int TotalRooms { get; set; }
        public int OccupiedRooms { get; set; }
        public decimal OccupancyRate { get; set; }
        public decimal Revenue { get; set; }
    }
}
```

**RevenueReport.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class RevenueReport
    {
        public int ReportId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public decimal RoomRevenue { get; set; }
        public decimal FoodRevenue { get; set; }
        public decimal BeverageRevenue { get; set; }
        public decimal OtherRevenue { get; set; }

        public decimal TotalRevenue { get; set; }

        public decimal RoomPercentage { get; set; }
        public decimal FoodPercentage { get; set; }
        public decimal BeveragePercentage { get; set; }

        public int ReservationCount { get; set; }
        public int GuestCount { get; set; }
        public int NightsSold { get; set; }

        public decimal RevenueGrowthPercent { get; set; } // vs previous period
        public decimal ADRGrowthPercent { get; set; }
        public decimal OccupancyGrowthPercent { get; set; }

        public ICollection<DailyRevenue> DailyRevenues { get; set; } = new List<DailyRevenue>();

        public DateTime CreatedAt { get; set; }
    }

    public class DailyRevenue
    {
        public int Id { get; set; }
        public int RevenueReportId { get; set; }
        public DateTime RevenueDate { get; set; }

        public decimal RoomRevenue { get; set; }
        public decimal FoodRevenue { get; set; }
        public decimal BeverageRevenue { get; set; }
        public decimal TotalRevenue { get; set; }

        public int OccupiedRooms { get; set; }
        public int CheckIns { get; set; }
        public int CheckOuts { get; set; }
    }
}
```

### Report Services

**ReportingService**:
```csharp
public interface IReportingService
{
    Task<OccupancyReport> GenerateOccupancyReportAsync(DateTime reportDate);
    Task<RevenueReport> GenerateRevenueReportAsync(DateTime startDate, DateTime endDate);
    Task<IEnumerable<OccupancyReport>> GetOccupancyTrendAsync(DateTime startDate, DateTime endDate);
    Task<IEnumerable<RevenueReport>> GetRevenueHistoryAsync(int months = 12);
    
    Task<decimal> CalculateRevenuePARAsync(DateTime date);
    Task<decimal> CalculateADRAsync(DateTime date);
    Task<decimal> CalculateOccupancyRateAsync(DateTime date);
    
    Task<RevenueForecasting> ForecastRevenueAsync(int daysAhead = 30);
}

public class ReportingService : IReportingService
{
    private readonly IReservationRepository _reservationRepository;
    private readonly IRoomRepository _roomRepository;
    private readonly IInvoiceRepository _invoiceRepository;

    public async Task<OccupancyReport> GenerateOccupancyReportAsync(DateTime reportDate)
    {
        var allRooms = await _roomRepository.GetAllAsync();
        var totalRooms = allRooms.Count;

        var occupiedRooms = await _reservationRepository.CountAsync(r =>
            r.CheckInDate <= reportDate && r.CheckOutDate > reportDate &&
            r.Status != ReservationStatus.Cancelled
        );

        var occupancyRate = (decimal)occupiedRooms / totalRooms * 100;

        var report = new OccupancyReport
        {
            ReportDate = reportDate,
            TotalRooms = totalRooms,
            OccupiedRooms = occupiedRooms,
            OccupancyRate = occupancyRate,
            RevenuePAR = await CalculateRevenuePARAsync(reportDate),
            ADR = await CalculateADRAsync(reportDate),
            CreatedAt = DateTime.UtcNow
        };

        return report;
    }

    public async Task<decimal> CalculateRevenuePARAsync(DateTime date)
    {
        var dailyRevenue = await _invoiceRepository.SumAsync(i =>
            i.InvoiceDate.Date == date.Date,
            i => i.TotalAmount
        );

        var availableRooms = await _roomRepository.CountAsync(r => r.IsActive);

        return availableRooms > 0 ? dailyRevenue / availableRooms : 0;
    }

    public async Task<decimal> CalculateADRAsync(DateTime date)
    {
        var dailyRevenue = await _invoiceRepository.SumAsync(i =>
            i.InvoiceDate.Date == date.Date,
            i => i.TotalAmount
        );

        var occupiedRooms = await _reservationRepository.CountAsync(r =>
            r.CheckInDate <= date && r.CheckOutDate > date &&
            r.Status != ReservationStatus.Cancelled
        );

        return occupiedRooms > 0 ? dailyRevenue / occupiedRooms : 0;
    }
}
```

---

## Week 2: Operational Metrics & KPIs (28-32 hours)

### KPI Models

**OperationalMetrics.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class OperationalMetrics
    {
        public int MetricsId { get; set; }
        public DateTime MetricsDate { get; set; }

        // Housekeeping
        public int RoomsToClean { get; set; }
        public int RoomsCleaned { get; set; }
        public decimal HousekeepingEfficiency { get; set; }
        public decimal AvgCleaningTimeMinutes { get; set; }

        // Front Desk
        public int CheckInCount { get; set; }
        public int CheckOutCount { get; set; }
        public decimal AvgCheckInTimeSeconds { get; set; }
        public decimal AvgCheckOutTimeSeconds { get; set; }

        // Restaurant
        public int MenuItemsSold { get; set; }
        public int TablesServed { get; set; }
        public int AverageTableTurnTime { get; set; }
        public decimal FoodCostPercent { get; set; }

        // Bar
        public int BeveragesSold { get; set; }
        public decimal BeverageRevenue { get; set; }
        public decimal AverageBeveragePrice { get; set; }

        // Staff
        public int StaffPresent { get; set; }
        public int CalloutCount { get; set; }
        public decimal StaffEfficiency { get; set; }

        // Guest Satisfaction (1-5 scale average)
        public decimal OverallSatisfaction { get; set; }
        public decimal RoomSatisfaction { get; set; }
        public decimal ServiceSatisfaction { get; set; }
        public decimal CleaningSatisfaction { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
```

### KPI Service

**KPIService**:
```csharp
public interface IKPIService
{
    Task<OperationalMetrics> GenerateOperationalMetricsAsync(DateTime date);
    Task<IEnumerable<KPITrend>> GetKPITrendAsync(DateTime startDate, DateTime endDate);
    Task<KPIDashboard> GetDashboardAsync();
    Task<IEnumerable<KPIAlert>> GetAlertsAsync(); // KPIs out of target range
}

public class KPIService : IKPIService
{
    public async Task<OperationalMetrics> GenerateOperationalMetricsAsync(DateTime date)
    {
        var metrics = new OperationalMetrics
        {
            MetricsDate = date,

            // Housekeeping
            RoomsToClean = await CalculateRoomsToCleanAsync(date),
            RoomsCleaned = await CalculateRoomsCleanedAsync(date),

            // Front Desk
            CheckInCount = await _reservationRepository.CountAsync(r =>
                r.CheckInDate.Date == date.Date &&
                r.Status != ReservationStatus.Cancelled
            ),

            // Restaurant
            MenuItemsSold = await _orderRepository.SumAsync(o =>
                o.OrderTime.Date == date.Date &&
                o.Status != OrderStatus.Cancelled,
                o => o.OrderItems.Sum(oi => oi.Quantity)
            ),

            // Guest Satisfaction
            OverallSatisfaction = await CalculateAverageSatisfactionAsync(date),

            CreatedAt = DateTime.UtcNow
        };

        return metrics;
    }
}
```

---

## Week 3: Management Dashboard & Visualization (28-32 hours)

### Dashboard Models

**DashboardWidget.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class DashboardWidget
    {
        public int WidgetId { get; set; }
        public string WidgetName { get; set; } = string.Empty;
        public string WidgetType { get; set; } = string.Empty; // "Chart", "Gauge", "Table", "KPI"

        public int DisplayOrder { get; set; }
        public int? RowPosition { get; set; }
        public int? ColumnPosition { get; set; }

        public string? WidgetConfig { get; set; } // JSON with chart settings

        public bool IsActive { get; set; } = true;
        public bool DefaultForAllUsers { get; set; } = false;
    }

    public class UserDashboard
    {
        public int UserDashboardId { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; } = null!;

        public string DashboardName { get; set; } = string.Empty;
        public bool IsDefault { get; set; }

        public ICollection<DashboardWidget> Widgets { get; set; } = new List<DashboardWidget>();

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
```

### Dashboard UI Components

**ManagementDashboard.xaml**:
```xml
<!-- Real-time dashboard with -->
<!-- 1. KPI gauges (Occupancy, ADR, RevPAR, Food Cost) -->
<!-- 2. Revenue trend chart (30-day) -->
<!-- 3. Occupancy forecast (14-day) -->
<!-- 4. Top performing staff -->
<!-- 5. Alerts and warnings -->
<!-- 6. Guest satisfaction trend -->
```

---

## Week 4: Export & Advanced Analytics (31-35 hours)

### Export Service

**ExportService**:
```csharp
public interface IExportService
{
    Task<string> ExportToExcelAsync(IEnumerable<object> data, string fileName);
    Task<string> ExportToPdfAsync(object reportData, string fileName);
    Task<string> ExportToCSVAsync(IEnumerable<object> data, string fileName);
    
    Task<byte[]> GeneratePdfReportAsync(ReportType reportType, DateTime startDate, DateTime endDate);
    Task SendReportEmailAsync(int employeeId, ReportType reportType, DateTime startDate, DateTime endDate);
}
```

### Forecasting

**ForecastingService**:
```csharp
public class ForecastingService
{
    public async Task<RevenueForecast> ForecastRevenueAsync(int daysAhead = 30)
    {
        // Use simple moving average or exponential smoothing
        var historicalData = await GetHistoricalRevenueAsync(90);
        var forecast = CalculateMovingAverage(historicalData, daysAhead);

        return new RevenueForecast
        {
            ForecastDate = DateTime.UtcNow,
            DaysAhead = daysAhead,
            ForecastedRevenue = forecast,
            ConfidenceInterval = 95,
            Accuracy = CalculateAccuracy(historicalData)
        };
    }

    public async Task<OccupancyForecast> ForecastOccupancyAsync(int daysAhead = 30)
    {
        // Predict based on current reservations and historical patterns
        var reservations = await _reservationRepository.GetFutureReservationsAsync(daysAhead);
        var historicalOccupancy = await GetHistoricalOccupancyAsync(90);

        return new OccupancyForecast
        {
            ForecastedOccupancy = CalculateExpectedOccupancy(reservations, historicalOccupancy),
            CriticalDates = IdentifyCriticalOccupancyDates(),
            RecommendedActions = GenerateYieldManagementActions()
        };
    }
}
```

---

## Phase 8 Key Deliverables

| Component | Details | Status |
|-----------|---------|--------|
| Occupancy Reports | Daily, weekly, monthly | ✅ |
| Revenue Reports | By source, trend, forecast | ✅ |
| KPI Tracking | Operational metrics, alerts | ✅ |
| Dashboards | Real-time, customizable | ✅ |
| Forecasting | Revenue & occupancy | ✅ |
| Export Capability | Excel, PDF, CSV | ✅ |

---

## Phase 8 Completion Checklist

- [ ] All report models created
- [ ] ReportingService fully implemented
- [ ] KPIService calculating correctly
- [ ] All dashboards created
- [ ] Export functionality working
- [ ] Forecasting models implemented
- [ ] All UI windows created
- [ ] Reports generating correctly
- [ ] Tests passing (>70% coverage)
- [ ] No calculation errors

**Ready for Phase 9 when complete** ✅
