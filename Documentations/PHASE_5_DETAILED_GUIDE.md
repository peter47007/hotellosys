# Phase 5: Bar & Beverage + Inventory Management - DETAILED GUIDE

**Phase Duration**: 7 weeks (Weeks 21-27)  
**Estimated Hours**: 280-315 hours  
**Weekly Target**: 40-45 hours/week  
**Complexity**: High  
**Dependencies**: Phases 1-4 (All previous systems)

---

## Phase Overview

Phase 5 implements the bar/beverage management system and comprehensive inventory management across the hotel including stock tracking, purchasing, and vendor management.

### Key Objectives:
- Create beverage menu and bar operations
- Implement inventory management system
- Create purchase order system
- Build vendor management
- Implement stock tracking
- Create inventory reports
- Build bar POS integration
- Implement inventory analytics

### Business Value:
- Real-time inventory visibility
- Waste reduction through tracking
- Efficient purchasing
- Cost control
- Vendor performance metrics

---

## Week 1-2: Beverage & Bar Management (45-50 hours)

### Bar Models

**Beverage.cs**:
```csharp
namespace HotelloMachineLearningSys.Core.Models
{
    public class Beverage
    {
        public int BeverageId { get; set; }
        public string BeverageName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public int BeverageCategoryId { get; set; }
        public BeverageCategory BeverageCategory { get; set; } = null!;

        public decimal Price { get; set; }
        public decimal CostOfGoods { get; set; }

        public string? AlcoholType { get; set; } // "Beer", "Wine", "Spirit", null for non-alcoholic
        public bool RequiresLicense { get; set; } // For regulated sale
        public decimal AlcoholPercentage { get; set; }

        public bool IsAvailable { get; set; } = true;
        public int MinimumStock { get; set; }

        public ICollection<BeverageInventory> Inventory { get; set; } = new List<BeverageInventory>();
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }

    public class BeverageCategory
    {
        public int BeverageCategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<Beverage> Beverages { get; set; } = new List<Beverage>();
    }
}
```

**BarOrder.cs** (Bar-specific orders):
```csharp
namespace HotelloSys.Core.Models
{
    public class BarOrder
    {
        public int BarOrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;

        public int? TableId { get; set; }
        public RestaurantTable? Table { get; set; }

        public int? RoomId { get; set; }
        public Room? Room { get; set; }

        public int BartenderEmployeeId { get; set; }
        public Employee Bartender { get; set; } = null!;

        public BarOrderStatus Status { get; set; }

        public DateTime OrderTime { get; set; }
        public DateTime? CompletedTime { get; set; }

        public decimal TotalAmount { get; set; }

        public ICollection<BarOrderItem> Items { get; set; } = new List<BarOrderItem>();

        public DateTime CreatedAt { get; set; }
    }

    public class BarOrderItem
    {
        public int BarOrderItemId { get; set; }
        public int BarOrderId { get; set; }
        public BarOrder BarOrder { get; set; } = null!;

        public int BeverageId { get; set; }
        public Beverage Beverage { get; set; } = null!;

        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal LineTotal { get; set; }

        public string? SpecialInstructions { get; set; }
    }

    public enum BarOrderStatus
    {
        Pending = 1,
        InProgress = 2,
        Completed = 3,
        Served = 4,
        Cancelled = 5
    }
}
```

### Bar Service

**BarService**:
```csharp
public interface IBarService
{
    Task<BarOrder> CreateBarOrderAsync(CreateBarOrderRequest request);
    Task AddBeverageToOrderAsync(int barOrderId, BeverageOrderItem item);
    Task<BarOrder?> GetBarOrderByNumberAsync(string orderNumber);
    Task CompleteBarOrderAsync(int barOrderId);
    Task<IEnumerable<BarOrder>> GetActiveBarOrdersAsync();
    Task<decimal> GetBartenderSalesAsync(int employeeId, DateTime date);
    Task<IEnumerable<BeverageSalesReport>> GetBeverageSalesAsync(DateTime startDate, DateTime endDate);
}

public class BarService : IBarService
{
    private readonly IBarOrderRepository _barOrderRepository;
    private readonly IBeverageRepository _beverageRepository;
    private readonly IBeverageInventoryService _inventoryService;

    public async Task<BarOrder> CreateBarOrderAsync(CreateBarOrderRequest request)
    {
        var barOrder = new BarOrder
        {
            OrderNumber = GenerateBarOrderNumber(),
            TableId = request.TableId,
            RoomId = request.RoomId,
            BartenderEmployeeId = request.BartenderEmployeeId,
            Status = BarOrderStatus.InProgress,
            OrderTime = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System"
        };

        return await _barOrderRepository.AddAsync(barOrder);
    }

    public async Task AddBeverageToOrderAsync(int barOrderId, BeverageOrderItem itemRequest)
    {
        var barOrder = await _barOrderRepository.GetByIdAsync(barOrderId);
        var beverage = await _beverageRepository.GetByIdAsync(itemRequest.BeverageId);

        // Check inventory
        var stock = await _inventoryService.GetStockLevelAsync(itemRequest.BeverageId);
        if (stock < itemRequest.Quantity)
            throw new InvalidOperationException("Insufficient stock for this beverage");

        var orderItem = new BarOrderItem
        {
            BarOrderId = barOrderId,
            BeverageId = itemRequest.BeverageId,
            Quantity = itemRequest.Quantity,
            UnitPrice = beverage.Price,
            LineTotal = beverage.Price * itemRequest.Quantity,
            SpecialInstructions = itemRequest.SpecialInstructions
        };

        await _barOrderRepository.AddBarOrderItemAsync(orderItem);

        // Reduce inventory
        await _inventoryService.ReduceStockAsync(itemRequest.BeverageId, itemRequest.Quantity);

        // Update order total
        barOrder.TotalAmount += orderItem.LineTotal;
        await _barOrderRepository.UpdateAsync(barOrder);
    }
}
```

---

## Week 3: Core Inventory System (45-50 hours)

### Inventory Models

**InventoryItem.cs** (Generic inventory for all hotel items):
```csharp
namespace HotelloSys.Core.Models
{
    public class InventoryItem
    {
        public int InventoryItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string SKU { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public int InventoryCategoryId { get; set; }
        public InventoryCategory Category { get; set; } = null!;

        public decimal UnitCost { get; set; }
        public decimal ReorderPrice { get; set; }

        public int CurrentStock { get; set; }
        public int MinimumStockLevel { get; set; }
        public int ReorderQuantity { get; set; }

        public string Unit { get; set; } = string.Empty; // "piece", "kg", "liter"

        public int? SupplierId { get; set; }
        public Supplier? PrimarySupplier { get; set; }

        public bool IsActive { get; set; } = true;

        public ICollection<InventoryTransaction> Transactions { get; set; } = new List<InventoryTransaction>();
        public ICollection<InventoryHistory> History { get; set; } = new List<InventoryHistory>();

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }
        public string UpdatedBy { get; set; } = string.Empty;
    }

    public class InventoryCategory
    {
        public int InventoryCategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<InventoryItem> Items { get; set; } = new List<InventoryItem>();
    }
}
```

**InventoryTransaction.cs** (Track all movements):
```csharp
namespace HotelloSys.Core.Models
{
    public class InventoryTransaction
    {
        public int InventoryTransactionId { get; set; }
        public int InventoryItemId { get; set; }
        public InventoryItem InventoryItem { get; set; } = null!;

        public InventoryTransactionType TransactionType { get; set; }
        public decimal Quantity { get; set; }
        public string Unit { get; set; } = string.Empty;

        public decimal UnitPrice { get; set; }
        public decimal TotalValue { get; set; }

        public string Reference { get; set; } = string.Empty; // PO#, Order#, etc
        public string? Notes { get; set; }

        public int? SourceEmployeeId { get; set; }
        public Employee? SourceEmployee { get; set; }

        public DateTime TransactionDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }

    public enum InventoryTransactionType
    {
        Purchase = 1,           // From supplier
        Adjustment = 2,         // Manual adjustment
        Usage = 3,              // Used in cooking/operations
        Waste = 4,              // Spoilage/loss
        Transfer = 5,           // Between locations
        Return = 6,             // Returned to supplier
        StockCount = 7          // Physical count
    }
}
```

**InventoryHistory.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class InventoryHistory
    {
        public int InventoryHistoryId { get; set; }
        public int InventoryItemId { get; set; }
        public InventoryItem InventoryItem { get; set; } = null!;

        public int PreviousStock { get; set; }
        public int NewStock { get; set; }

        public InventoryTransactionType ChangeType { get; set; }
        public string? Reason { get; set; }

        public DateTime ChangedDate { get; set; }
        public string ChangedBy { get; set; } = string.Empty;
    }
}
```

### Inventory Service

**InventoryService**:
```csharp
public interface IInventoryService
{
    Task<InventoryItem?> GetInventoryItemByIdAsync(int id);
    Task<InventoryItem?> GetInventoryItemBySKUAsync(string sku);
    Task<IEnumerable<InventoryItem>> GetLowStockItemsAsync();
    Task<int> GetStockLevelAsync(int inventoryItemId);
    
    Task ReduceStockAsync(int inventoryItemId, decimal quantity, InventoryTransactionType type, string? reason);
    Task IncreaseStockAsync(int inventoryItemId, decimal quantity, InventoryTransactionType type, string? reason);
    Task AdjustStockAsync(int inventoryItemId, decimal newQuantity, string reason);
    
    Task<InventoryItem> CreateInventoryItemAsync(CreateInventoryItemRequest request);
    Task UpdateInventoryItemAsync(InventoryItem item);
    
    Task<IEnumerable<InventoryTransaction>> GetTransactionHistoryAsync(int inventoryItemId, int days = 30);
    Task<decimal> GetInventoryValueAsync();
    Task<IEnumerable<InventoryItem>> GetItemsByCategoryAsync(int categoryId);
}

public class InventoryService : IInventoryService
{
    private readonly IInventoryRepository _inventoryRepository;
    private readonly IInventoryTransactionRepository _transactionRepository;
    private readonly IAuditService _auditService;

    public async Task ReduceStockAsync(
        int inventoryItemId, 
        decimal quantity, 
        InventoryTransactionType type,
        string? reason)
    {
        var item = await _inventoryRepository.GetByIdAsync(inventoryItemId);
        if (item == null)
            throw new InvalidOperationException("Inventory item not found");

        if (item.CurrentStock < quantity)
            throw new InvalidOperationException($"Insufficient stock. Available: {item.CurrentStock}");

        // Record transaction
        var transaction = new InventoryTransaction
        {
            InventoryItemId = inventoryItemId,
            TransactionType = type,
            Quantity = quantity,
            Unit = item.Unit,
            UnitPrice = item.UnitCost,
            TotalValue = quantity * item.UnitCost,
            Notes = reason,
            TransactionDate = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System"
        };

        await _transactionRepository.AddAsync(transaction);

        // Update stock
        item.CurrentStock -= (int)quantity;
        await _inventoryRepository.UpdateAsync(item);

        // Record history
        var history = new InventoryHistory
        {
            InventoryItemId = inventoryItemId,
            PreviousStock = item.CurrentStock + (int)quantity,
            NewStock = item.CurrentStock,
            ChangeType = type,
            Reason = reason,
            ChangedDate = DateTime.UtcNow,
            ChangedBy = "System"
        };

        await _inventoryRepository.AddHistoryAsync(history);

        // Check if below minimum
        if (item.CurrentStock <= item.MinimumStockLevel)
        {
            await _auditService.LogActionAsync(
                "LOW_STOCK_WARNING",
                $"{item.ItemName} stock level ({item.CurrentStock}) below minimum ({item.MinimumStockLevel})"
            );
        }
    }

    public async Task<IEnumerable<InventoryItem>> GetLowStockItemsAsync()
    {
        return await _inventoryRepository.GetItemsWhereAsync(
            i => i.CurrentStock <= i.MinimumStockLevel && i.IsActive
        );
    }

    public async Task<decimal> GetInventoryValueAsync()
    {
        var items = await _inventoryRepository.GetAllAsync();
        return items.Sum(i => i.CurrentStock * i.UnitCost);
    }
}
```

---

## Week 4: Purchase Order & Vendor Management (45-50 hours)

### Purchasing Models

**Supplier.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class Supplier
    {
        public int SupplierId { get; set; }
        public string SupplierName { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;

        public decimal AverageDeliveryDays { get; set; }
        public decimal AveragePrice { get; set; }

        public bool IsActive { get; set; } = true;
        public decimal Rating { get; set; } // 1-5 stars

        public ICollection<PurchaseOrder> PurchaseOrders { get; set; } = new List<PurchaseOrder>();
        public ICollection<InventoryItem> Items { get; set; } = new List<InventoryItem>();

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }
}
```

**PurchaseOrder.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class PurchaseOrder
    {
        public int PurchaseOrderId { get; set; }
        public string PONumber { get; set; } = string.Empty; // "PO-2026-001234"

        public int SupplierId { get; set; }
        public Supplier Supplier { get; set; } = null!;

        public int OrderedByEmployeeId { get; set; }
        public Employee OrderedBy { get; set; } = null!;

        public DateTime OrderDate { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public DateTime? ActualDeliveryDate { get; set; }

        public PurchaseOrderStatus Status { get; set; }

        public decimal Subtotal { get; set; }
        public decimal Tax { get; set; }
        public decimal ShippingCost { get; set; }
        public decimal TotalAmount { get; set; }

        public string? Notes { get; set; }

        public ICollection<PurchaseOrderItem> Items { get; set; } = new List<PurchaseOrderItem>();

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }

    public class PurchaseOrderItem
    {
        public int PurchaseOrderItemId { get; set; }
        public int PurchaseOrderId { get; set; }
        public PurchaseOrder PurchaseOrder { get; set; } = null!;

        public int InventoryItemId { get; set; }
        public InventoryItem InventoryItem { get; set; } = null!;

        public decimal QuantityOrdered { get; set; }
        public decimal QuantityReceived { get; set; }

        public decimal UnitPrice { get; set; }
        public decimal LineTotal { get; set; }

        public PurchaseOrderItemStatus Status { get; set; }
    }

    public enum PurchaseOrderStatus
    {
        Draft = 1,
        Submitted = 2,
        Confirmed = 3,
        PartiallyReceived = 4,
        Received = 5,
        Cancelled = 6,
        OnHold = 7
    }

    public enum PurchaseOrderItemStatus
    {
        Pending = 1,
        Partial = 2,
        Received = 3,
        Cancelled = 4
    }
}
```

### Purchasing Service

**PurchaseOrderService**:
```csharp
public interface IPurchaseOrderService
{
    Task<PurchaseOrder> CreatePurchaseOrderAsync(CreatePORequest request);
    Task AddItemToPOAsync(int poId, POItemRequest item);
    Task<PurchaseOrder?> GetPOByNumberAsync(string poNumber);
    Task SubmitPOAsync(int poId);
    Task ReceivePOAsync(int poId, ReceivePORequest details);
    Task<IEnumerable<PurchaseOrder>> GetPendingPOsAsync();
    Task<decimal> GetSupplierPerformanceAsync(int supplierId);
    Task<IEnumerable<PurchaseOrder>> GetPOsBySupplierAsync(int supplierId);
}

public class PurchaseOrderService : IPurchaseOrderService
{
    private readonly IPurchaseOrderRepository _poRepository;
    private readonly IInventoryService _inventoryService;
    private readonly ISupplierRepository _supplierRepository;

    public async Task ReceivePOAsync(int poId, ReceivePORequest details)
    {
        var po = await _poRepository.GetByIdAsync(poId);

        foreach (var item in details.ReceivedItems)
        {
            var poItem = po.Items.FirstOrDefault(i => i.PurchaseOrderItemId == item.POItemId);
            poItem.QuantityReceived += item.Quantity;

            // Add to inventory
            await _inventoryService.IncreaseStockAsync(
                poItem.InventoryItemId,
                item.Quantity,
                InventoryTransactionType.Purchase,
                $"PO: {po.PONumber}"
            );

            poItem.Status = poItem.QuantityReceived >= poItem.QuantityOrdered 
                ? PurchaseOrderItemStatus.Received 
                : PurchaseOrderItemStatus.Partial;
        }

        po.ActualDeliveryDate = DateTime.UtcNow;
        po.Status = po.Items.All(i => i.Status == PurchaseOrderItemStatus.Received)
            ? PurchaseOrderStatus.Received
            : PurchaseOrderStatus.PartiallyReceived;

        await _poRepository.UpdateAsync(po);
    }
}
```

---

## Week 5-6: Stock Management & Audits (45-50 hours)

### Stock Audit Models

**StockAudit.cs** (Physical inventory counts):
```csharp
namespace HotelloSys.Core.Models
{
    public class StockAudit
    {
        public int StockAuditId { get; set; }
        public DateTime AuditDate { get; set; }

        public int ConductedByEmployeeId { get; set; }
        public Employee ConductedBy { get; set; } = null!;

        public StockAuditStatus Status { get; set; }

        public string? Notes { get; set; }

        public ICollection<StockAuditItem> Items { get; set; } = new List<StockAuditItem>();

        public decimal TotalVariance { get; set; } // Monetary difference

        public DateTime CreatedAt { get; set; }
    }

    public class StockAuditItem
    {
        public int StockAuditItemId { get; set; }
        public int StockAuditId { get; set; }
        public StockAudit StockAudit { get; set; } = null!;

        public int InventoryItemId { get; set; }
        public InventoryItem InventoryItem { get; set; } = null!;

        public int SystemStock { get; set; }
        public int PhysicalStock { get; set; }

        public int Variance { get; set; } // Physical - System
        public decimal VarianceValue { get; set; }

        public string? Comments { get; set; }
    }

    public enum StockAuditStatus
    {
        InProgress = 1,
        Completed = 2,
        Reconciled = 3
    }
}
```

### Stock Audit Service

**StockAuditService**:
```csharp
public interface IStockAuditService
{
    Task<StockAudit> StartAuditAsync(int employeeId);
    Task<StockAudit> CountItemAsync(int auditId, int itemId, int physicalCount);
    Task CompleteAuditAsync(int auditId);
    Task ReconcileVariancesAsync(int auditId);
    Task<StockAudit?> GetAuditByIdAsync(int auditId);
    Task<IEnumerable<StockAudit>> GetAuditHistoryAsync(int days = 90);
}
```

---

## Week 7: Inventory Reporting & UI (40-45 hours)

### Reports

**InventoryReportService**:
```csharp
public class InventoryReportService
{
    public async Task<InventoryValueReport> GenerateInventoryValueReportAsync()
    {
        // Total inventory value
        // Value by category
        // High-value items
    }

    public async Task<MovementReport> GenerateMovementReportAsync(DateTime startDate, DateTime endDate)
    {
        // Turnover rates
        // Slow-moving items
        // Fast-moving items
    }

    public async Task<CostAnalysisReport> GenerateCostAnalysisAsync(DateTime month)
    {
        // Food cost percentage
        // Waste analysis
        // Supplier performance
    }

    public async Task<StockAgeReport> GenerateStockAgeReportAsync()
    {
        // Items by acquisition date
        // Aging inventory
        // Expiring soon
    }
}
```

### UI Components

1. **InventoryDashboard.xaml** - Overview:
   - Total inventory value
   - Low stock items
   - Recent transactions
   - Quick actions

2. **InventoryItemWindow.xaml** - Item management:
   - Create/edit items
   - View stock levels
   - See transaction history
   - Adjust stock

3. **PurchaseOrderWindow.xaml** - PO management:
   - Create purchase orders
   - Track deliveries
   - Receive goods
   - View history

4. **StockAuditWindow.xaml** - Physical counts:
   - Start audit
   - Count items
   - Record variances
   - Reconcile

5. **InventoryReportsWindow.xaml** - Analytics:
   - Inventory value
   - Movement analysis
   - Supplier performance
   - Cost analysis

---

## Phase 5 Key Deliverables

| Component | Details | Status |
|-----------|---------|--------|
| Beverage Management | Menu, orders, bar POS | ✅ |
| Inventory Tracking | Items, stock levels, history | ✅ |
| Purchasing | POs, suppliers, receiving | ✅ |
| Stock Audits | Physical counts, reconciliation | ✅ |
| Reporting | Value, movement, cost analysis | ✅ |

---

## Phase 5 Testing

- Unit tests for inventory calculations
- Integration tests for stock transactions
- PO workflow tests
- UI tests for all windows
- Performance with 10,000+ items

---

## Phase 5 Completion Checklist

- [ ] All beverage models created
- [ ] Bar order system implemented
- [ ] Inventory system complete
- [ ] PO system working
- [ ] Stock audit system operational
- [ ] All UI windows created
- [ ] Reports generating correctly
- [ ] Tests passing (>70% coverage)
- [ ] No double-counting of stock
- [ ] All suppliers configured

**Ready for Phase 6 when all items complete** ✅
