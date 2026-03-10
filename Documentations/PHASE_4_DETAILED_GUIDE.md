# Phase 4: Restaurant Operations & Management - DETAILED GUIDE

**Phase Duration**: 7 weeks (Weeks 14-20)  
**Estimated Hours**: 280-325 hours  
**Weekly Target**: 40-46 hours/week  
**Complexity**: High  
**Dependencies**: Phases 1-3 (Foundation, Employees, Rooms/Reservations)

---

## Phase Overview

Phase 4 implements the restaurant module covering menu management, table reservations, order processing, kitchen operations, and restaurant reporting.

### Key Objectives:
- Create menu and item management
- Build table/seating management
- Implement restaurant reservations
- Create order entry system
- Build kitchen order management
- Implement order tracking
- Create table management UI
- Generate restaurant reports

### Business Value:
- Automated order processing
- Real-time kitchen management
- Table efficiency tracking
- Menu cost analysis
- Revenue from food sales

---

## Week 1-2: Menu & Item Management (45-50 hours)

### Core Models

**MenuItem.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class MenuItem
    {
        public int MenuItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        public int MenuCategoryId { get; set; }
        public MenuCategory MenuCategory { get; set; } = null!;

        public decimal Price { get; set; }
        public decimal CostOfGoods { get; set; }
        
        public string? ImageUrl { get; set; }
        public bool IsVegetarian { get; set; }
        public bool IsSpicy { get; set; }
        public bool IsAvailable { get; set; } = true;
        
        public int PreparationTimeMinutes { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public ICollection<MenuItemIngredient> Ingredients { get; set; } = new List<MenuItemIngredient>();

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }

    public class MenuCategory
    {
        public int MenuCategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
    }
}
```

**MenuItemIngredient.cs** (for inventory):
```csharp
namespace HotelloSys.Core.Models
{
    public class MenuItemIngredient
    {
        public int MenuItemIngredientId { get; set; }
        public int MenuItemId { get; set; }
        public MenuItem MenuItem { get; set; } = null!;

        public int InventoryItemId { get; set; }
        public InventoryItem InventoryItem { get; set; } = null!;

        public decimal QuantityRequired { get; set; }
        public string Unit { get; set; } = string.Empty; // kg, grams, ml, etc
    }
}
```

### Services

**MenuService**:
```csharp
public interface IMenuService
{
    Task<MenuItem> CreateMenuItemAsync(CreateMenuItemRequest request);
    Task<MenuItem?> GetMenuItemByIdAsync(int id);
    Task<IEnumerable<MenuItem>> GetMenuByCategoryAsync(int categoryId);
    Task<IEnumerable<MenuItem>> GetAvailableMenuItemsAsync();
    Task UpdateMenuItemAsync(MenuItem item);
    Task ToggleMenuItemAvailabilityAsync(int itemId);
    Task<decimal> CalculateMenuItemProfitAsync(int itemId);
    Task<IEnumerable<MenuItemSalesReport>> GetMenuAnalyticsAsync(DateTime startDate, DateTime endDate);
}

public class MenuService : IMenuService
{
    private readonly IMenuItemRepository _menuRepository;
    private readonly IInventoryService _inventoryService;

    public async Task<decimal> CalculateMenuItemProfitAsync(int itemId)
    {
        var item = await _menuRepository.GetByIdAsync(itemId);
        return item.Price - item.CostOfGoods;
    }

    public async Task<IEnumerable<MenuItemSalesReport>> GetMenuAnalyticsAsync(
        DateTime startDate, 
        DateTime endDate)
    {
        return await _menuRepository.GetSalesAnalyticsAsync(startDate, endDate);
    }
}
```

---

## Week 3: Restaurant Orders & Kitchen (45-50 hours)

### Order Models

**Order.cs** (Restaurant Order):
```csharp
namespace HotelloSys.Core.Models
{
    public class Order
    {
        public int OrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty; // "ORD-2026-001234"

        public int TableId { get; set; }
        public RestaurantTable Table { get; set; } = null!;

        public int? ReservationId { get; set; }
        public Reservation? Reservation { get; set; }

        public int EmployeeId { get; set; }
        public Employee Employee { get; set; } = null!; // Server/Waiter

        public OrderStatus Status { get; set; }
        public OrderType OrderType { get; set; } // Dine-in, Room Service, Takeout

        public DateTime OrderTime { get; set; }
        public DateTime? ServedTime { get; set; }
        public DateTime? CompletedTime { get; set; }

        public decimal Subtotal { get; set; }
        public decimal Tax { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }

        public string? Notes { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }

    public enum OrderStatus
    {
        Pending = 1,
        Confirmed = 2,
        InProgress = 3,
        Ready = 4,
        Served = 5,
        Completed = 6,
        Cancelled = 7
    }

    public enum OrderType
    {
        DineIn = 1,
        RoomService = 2,
        Takeout = 3
    }
}
```

**OrderItem.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class OrderItem
    {
        public int OrderItemId { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;

        public int MenuItemId { get; set; }
        public MenuItem MenuItem { get; set; } = null!;

        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal LineTotal { get; set; }

        public OrderItemStatus Status { get; set; }

        public DateTime OrderedTime { get; set; }
        public DateTime? ReadyTime { get; set; }
        public string? SpecialInstructions { get; set; }

        public DateTime CreatedAt { get; set; }
    }

    public enum OrderItemStatus
    {
        Pending = 1,
        Cooking = 2,
        Ready = 3,
        Delivered = 4,
        Cancelled = 5
    }
}
```

**KitchenOrder.cs** (Kitchen Display System):
```csharp
namespace HotelloSys.Core.Models
{
    public class KitchenOrder
    {
        public int KitchenOrderId { get; set; }
        public int OrderItemId { get; set; }
        public OrderItem OrderItem { get; set; } = null!;

        public DateTime ReceivedTime { get; set; }
        public DateTime? StartCookingTime { get; set; }
        public DateTime? ReadyTime { get; set; }

        public int? AssignedToEmployeeId { get; set; }
        public Employee? AssignedTo { get; set; }

        public string? CookNotes { get; set; }
        public bool IsUrgent { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
```

### Services

**OrderService**:
```csharp
public interface IOrderService
{
    Task<Order> CreateOrderAsync(CreateOrderRequest request);
    Task AddOrderItemAsync(int orderId, OrderItemRequest item);
    Task RemoveOrderItemAsync(int orderItemId);
    Task<Order?> GetOrderByNumberAsync(string orderNumber);
    Task UpdateOrderStatusAsync(int orderId, OrderStatus newStatus);
    Task<decimal> CalculateOrderTotalAsync(int orderId);
    Task<IEnumerable<Order>> GetActiveOrdersAsync();
    Task<IEnumerable<Order>> GetOrdersByTableAsync(int tableId);
    Task CompleteOrderAsync(int orderId);
}

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IMenuItemRepository _menuRepository;
    private readonly IKitchenOrderRepository _kitchenOrderRepository;

    public async Task<Order> CreateOrderAsync(CreateOrderRequest request)
    {
        var order = new Order
        {
            OrderNumber = GenerateOrderNumber(),
            TableId = request.TableId,
            EmployeeId = request.EmployeeId,
            Status = OrderStatus.Pending,
            OrderType = request.OrderType,
            OrderTime = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System"
        };

        return await _orderRepository.AddAsync(order);
    }

    public async Task AddOrderItemAsync(int orderId, OrderItemRequest itemRequest)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        var menuItem = await _menuRepository.GetByIdAsync(itemRequest.MenuItemId);

        var orderItem = new OrderItem
        {
            OrderId = orderId,
            MenuItemId = itemRequest.MenuItemId,
            Quantity = itemRequest.Quantity,
            UnitPrice = menuItem.Price,
            LineTotal = menuItem.Price * itemRequest.Quantity,
            Status = OrderItemStatus.Pending,
            OrderedTime = DateTime.UtcNow,
            SpecialInstructions = itemRequest.SpecialInstructions,
            CreatedAt = DateTime.UtcNow
        };

        await _orderRepository.AddOrderItemAsync(orderItem);

        // Create kitchen order
        var kitchenOrder = new KitchenOrder
        {
            OrderItemId = orderItem.OrderItemId,
            ReceivedTime = DateTime.UtcNow,
            IsUrgent = itemRequest.IsUrgent,
            CreatedAt = DateTime.UtcNow
        };

        await _kitchenOrderRepository.AddAsync(kitchenOrder);

        // Recalculate totals
        await RecalculateOrderTotalsAsync(orderId);
    }
}
```

---

## Week 4: Table Management & Reservations (45-50 hours)

### Table Models

**RestaurantTable.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class RestaurantTable
    {
        public int TableId { get; set; }
        public string TableNumber { get; set; } = string.Empty; // "1", "T-12"
        
        public int Capacity { get; set; }
        public TableStatus Status { get; set; }
        public TableLocation Location { get; set; }

        public DateTime? OccupiedSince { get; set; }
        public DateTime? LastCleaned { get; set; }

        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<TableReservation> Reservations { get; set; } = new List<TableReservation>();

        public DateTime CreatedAt { get; set; }
    }

    public enum TableStatus
    {
        Available = 1,
        Occupied = 2,
        Reserved = 3,
        Maintenance = 4
    }

    public enum TableLocation
    {
        MainDiningRoom = 1,
        PrivateDiningRoom = 2,
        Patio = 3,
        Bar = 4
    }
}
```

**TableReservation.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class TableReservation
    {
        public int TableReservationId { get; set; }
        public int TableId { get; set; }
        public RestaurantTable Table { get; set; } = null!;

        public int? CustomerId { get; set; }
        public Customer? Customer { get; set; }

        public string GuestName { get; set; } = string.Empty;
        public string GuestPhone { get; set; } = string.Empty;

        public DateTime ReservationDateTime { get; set; }
        public int PartySize { get; set; }

        public TableReservationStatus Status { get; set; }

        public string? SpecialRequests { get; set; }

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }

    public enum TableReservationStatus
    {
        Pending = 1,
        Confirmed = 2,
        Seated = 3,
        Completed = 4,
        NoShow = 5,
        Cancelled = 6
    }
}
```

### Services

**TableService**:
```csharp
public interface ITableService
{
    Task<IEnumerable<RestaurantTable>> GetAvailableTablesAsync(int partySize, DateTime time);
    Task AssignTableAsync(int tableId, int orderId);
    Task ReleaseTableAsync(int tableId);
    Task<TableReservation> ReserveTableAsync(ReserveTableRequest request);
    Task<IEnumerable<TableReservation>> GetTodayReservationsAsync();
    Task CheckInReservationAsync(int reservationId);
    Task<decimal> GetAverageTableTurnTimeAsync();
}
```

---

## Week 5: Kitchen Operations (40-45 hours)

### Kitchen Display System (KDS)

**KitchenService**:
```csharp
public interface IKitchenService
{
    Task<IEnumerable<KitchenOrder>> GetPendingOrdersAsync();
    Task<IEnumerable<KitchenOrder>> GetUrgentOrdersAsync();
    Task StartCookingAsync(int kitchenOrderId, int cookEmployeeId);
    Task MarkOrderReadyAsync(int kitchenOrderId);
    Task<int> GetAveragePreparationTimeAsync(int menuItemId);
    Task<KitchenMetrics> GetKitchenMetricsAsync(DateTime date);
}

public class KitchenService : IKitchenService
{
    private readonly IKitchenOrderRepository _kitchenOrderRepository;

    public async Task StartCookingAsync(int kitchenOrderId, int cookEmployeeId)
    {
        var kitchenOrder = await _kitchenOrderRepository.GetByIdAsync(kitchenOrderId);
        kitchenOrder.StartCookingTime = DateTime.UtcNow;
        kitchenOrder.AssignedToEmployeeId = cookEmployeeId;
        kitchenOrder.OrderItem.Status = OrderItemStatus.Cooking;

        await _kitchenOrderRepository.UpdateAsync(kitchenOrder);
    }

    public async Task MarkOrderReadyAsync(int kitchenOrderId)
    {
        var kitchenOrder = await _kitchenOrderRepository.GetByIdAsync(kitchenOrderId);
        kitchenOrder.ReadyTime = DateTime.UtcNow;
        kitchenOrder.OrderItem.Status = OrderItemStatus.Ready;
        kitchenOrder.OrderItem.ReadyTime = DateTime.UtcNow;

        await _kitchenOrderRepository.UpdateAsync(kitchenOrder);

        // Notify server
        await _notificationService.NotifyServerAsync(
            kitchenOrder.OrderItem.Order.EmployeeId,
            $"Order item {kitchenOrder.OrderItem.MenuItem.ItemName} is ready"
        );
    }
}
```

---

## Week 6-7: UI & Reporting (50-55 hours)

### UI Components

1. **RestaurantMainView.xaml** - Dashboard showing:
   - Active orders
   - Kitchen orders
   - Table status
   - Pending reservations

2. **OrderEntryWindow.xaml** - Server order entry:
   - Table/Guest selection
   - Menu browsing with search
   - Item quantity & special instructions
   - Payment options

3. **KitchenDisplayWindow.xaml** - Kitchen view:
   - Pending orders sorted by time
   - Urgent flag highlighting
   - Cook assignment
   - Mark as ready button

4. **TableManagementWindow.xaml** - Table layout:
   - Visual table map
   - Status indicators
   - Quick actions (occupy, release, maintenance)

### Reports

**RestaurantReportService**:
```csharp
public class RestaurantReportService
{
    public async Task<SalesReport> GenerateSalesReportAsync(DateTime startDate, DateTime endDate)
    {
        // Revenue by category
        // Top selling items
        // Revenue by time period
    }

    public async Task<EfficiencyReport> GenerateEfficiencyReportAsync(DateTime date)
    {
        // Table turnover times
        // Order preparation times
        // Server efficiency
        // Peak hours
    }

    public async Task<CostAnalysisReport> GenerateCostAnalysisAsync(DateTime month)
    {
        // Food cost percentage
        // Profit margins by item
        // Ingredient usage
    }
}
```

---

## Phase 4 Key Deliverables

| Component | Details | Status |
|-----------|---------|--------|
| Menu Management | Item categories, pricing, images | ✅ |
| Orders | Full order lifecycle | ✅ |
| Kitchen Operations | Order assignment, tracking | ✅ |
| Table Management | Status, reservations | ✅ |
| KDS | Kitchen display system | ✅ |
| Reports | Sales, efficiency, cost analysis | ✅ |

---

## Phase 4 Testing

- Unit tests for order calculations
- Integration tests for full order flow
- Kitchen workflow tests
- UI tests for order entry
- Performance with 1000+ daily orders

---

## Phase 4 Completion Checklist

- [ ] All menu models created
- [ ] Order system implemented
- [ ] Kitchen display system working
- [ ] Table management complete
- [ ] Restaurant reservations working
- [ ] All UI windows created
- [ ] Reports generating correctly
- [ ] Tests passing (>70% coverage)
- [ ] No inventory issues

**Ready for Phase 5 when all items complete** ✅
