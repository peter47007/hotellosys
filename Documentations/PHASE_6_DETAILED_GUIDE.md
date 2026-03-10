# Phase 6: Billing, Payments & Invoicing - DETAILED GUIDE

**Phase Duration**: 5 weeks (Weeks 28-32)  
**Estimated Hours**: 145-170 hours  
**Weekly Target**: 29-34 hours/week  
**Complexity**: High (Payment Processing)  
**Dependencies**: Phases 1-5 (All systems)

---

## Phase Overview

Phase 6 implements comprehensive billing and payment processing for hotel operations, handling room charges, restaurant orders, and multiple payment methods.

### Key Objectives:
- Create invoice management system
- Implement payment processing
- Handle multiple payment methods
- Create billing reconciliation
- Implement charges and extras
- Build billing reports
- Create guest statements
- Implement refunds and adjustments

### Business Value:
- Automated billing
- Multiple payment options
- Real-time balance tracking
- Accurate financial reporting
- Guest account management

---

## Week 1: Invoice & Charges Models (28-32 hours)

### Core Models

**Invoice.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class Invoice
    {
        public int InvoiceId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty; // "INV-2026-001234"

        public int? CustomerId { get; set; }
        public Customer? Customer { get; set; }

        public int? ReservationId { get; set; }
        public Reservation? Reservation { get; set; }

        public InvoiceType InvoiceType { get; set; }
        public InvoiceStatus Status { get; set; }

        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }

        public decimal Subtotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal ServiceChargeAmount { get; set; }
        public decimal TotalAmount { get; set; }

        public decimal AmountPaid { get; set; }
        public decimal BalanceDue { get; set; }

        public string? Notes { get; set; }
        public bool IsPaid => AmountPaid >= TotalAmount;

        public ICollection<InvoiceLineItem> LineItems { get; set; } = new List<InvoiceLineItem>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public ICollection<InvoiceAdjustment> Adjustments { get; set; } = new List<InvoiceAdjustment>();

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }
        public string UpdatedBy { get; set; } = string.Empty;
    }

    public enum InvoiceType
    {
        RoomCharge = 1,
        FoodBeverage = 2,
        Combined = 3,
        Service = 4,
        Other = 5
    }

    public enum InvoiceStatus
    {
        Draft = 1,
        Issued = 2,
        PartiallyPaid = 3,
        Paid = 4,
        Overdue = 5,
        Cancelled = 6,
        Written_Off = 7
    }
}
```

**InvoiceLineItem.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class InvoiceLineItem
    {
        public int InvoiceLineItemId { get; set; }
        public int InvoiceId { get; set; }
        public Invoice Invoice { get; set; } = null!;

        public string Description { get; set; } = string.Empty;
        public string ItemType { get; set; } = string.Empty; // "Room", "Meal", "Beverage", "Extra Charge"

        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal LineAmount { get; set; }

        public string? Reference { get; set; } // Order#, Reservation#

        public DateTime CreatedAt { get; set; }
    }
}
```

**Charge.cs** (Incidental charges):
```csharp
namespace HotelloSys.Core.Models
{
    public class Charge
    {
        public int ChargeId { get; set; }
        public int InvoiceId { get; set; }
        public Invoice Invoice { get; set; } = null!;

        public string ChargeName { get; set; } = string.Empty; // "Room Service", "Laundry", "Late Checkout"
        public string? Description { get; set; }

        public decimal Amount { get; set; }

        public ChargeStatus Status { get; set; }

        public int? AuthorizedByEmployeeId { get; set; }
        public Employee? AuthorizedBy { get; set; }

        public DateTime ChargeDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }

    public enum ChargeStatus
    {
        Pending = 1,
        Applied = 2,
        Waived = 3,
        Disputed = 4
    }
}
```

**InvoiceAdjustment.cs** (Discounts, write-offs):
```csharp
namespace HotelloSys.Core.Models
{
    public class InvoiceAdjustment
    {
        public int InvoiceAdjustmentId { get; set; }
        public int InvoiceId { get; set; }
        public Invoice Invoice { get; set; } = null!;

        public AdjustmentType AdjustmentType { get; set; }

        public decimal Amount { get; set; }
        public decimal PercentageOfTotal { get; set; }

        public string Reason { get; set; } = string.Empty;

        public int? ApprovedByEmployeeId { get; set; }
        public Employee? ApprovedBy { get; set; }

        public DateTime AdjustmentDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public enum AdjustmentType
    {
        Discount = 1,
        Loyalty_Reward = 2,
        Damage_Claim = 3,
        Complimentary = 4,
        Write_Off = 5,
        Correction = 6
    }
}
```

### Services

**InvoiceService**:
```csharp
public interface IInvoiceService
{
    Task<Invoice> CreateInvoiceAsync(CreateInvoiceRequest request);
    Task<Invoice?> GetInvoiceByNumberAsync(string invoiceNumber);
    Task<Invoice?> GetInvoiceByIdAsync(int id);
    Task<IEnumerable<Invoice>> GetCustomerInvoicesAsync(int customerId);
    Task<IEnumerable<Invoice>> GetOverdueInvoicesAsync();
    
    Task AddLineItemAsync(int invoiceId, InvoiceLineItemRequest item);
    Task RemoveLineItemAsync(int lineItemId);
    
    Task AddChargeAsync(int invoiceId, AddChargeRequest request);
    Task ApplyAdjustmentAsync(int invoiceId, ApplyAdjustmentRequest request);
    
    Task<decimal> CalculateInvoiceTotalAsync(int invoiceId);
    Task<decimal> CalculateTaxAsync(int invoiceId);
    
    Task IssueInvoiceAsync(int invoiceId);
    Task SendInvoiceAsync(int invoiceId, string email);
    Task CancelInvoiceAsync(int invoiceId, string reason);
}

public class InvoiceService : IInvoiceService
{
    private readonly IInvoiceRepository _invoiceRepository;
    private readonly ITaxService _taxService;
    private readonly IAuditService _auditService;

    public async Task<Invoice> CreateInvoiceAsync(CreateInvoiceRequest request)
    {
        var invoice = new Invoice
        {
            InvoiceNumber = GenerateInvoiceNumber(),
            CustomerId = request.CustomerId,
            ReservationId = request.ReservationId,
            InvoiceType = request.InvoiceType,
            Status = InvoiceStatus.Draft,
            InvoiceDate = DateTime.UtcNow,
            DueDate = DateTime.UtcNow.AddDays(30), // Net 30
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System"
        };

        return await _invoiceRepository.AddAsync(invoice);
    }

    public async Task<decimal> CalculateInvoiceTotalAsync(int invoiceId)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(invoiceId);

        var subtotal = invoice.LineItems.Sum(li => li.LineAmount);
        var chargeTotal = invoice.LineItems.Sum(c => c.LineAmount);
        var adjustmentTotal = invoice.Adjustments.Sum(a => a.Amount);

        invoice.Subtotal = subtotal + chargeTotal;
        invoice.TaxAmount = await _taxService.CalculateTaxAsync(invoice.Subtotal);
        invoice.ServiceChargeAmount = CalculateServiceCharge(invoice.Subtotal);

        invoice.TotalAmount = invoice.Subtotal + invoice.TaxAmount + invoice.ServiceChargeAmount - adjustmentTotal;
        invoice.BalanceDue = invoice.TotalAmount - invoice.AmountPaid;

        return invoice.TotalAmount;
    }

    public async Task IssueInvoiceAsync(int invoiceId)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(invoiceId);

        if (invoice.Status != InvoiceStatus.Draft)
            throw new InvalidOperationException("Only draft invoices can be issued");

        invoice.Status = InvoiceStatus.Issued;
        invoice.InvoiceDate = DateTime.UtcNow;

        await _invoiceRepository.UpdateAsync(invoice);
        await _auditService.LogActionAsync("INVOICE_ISSUED", $"Invoice {invoice.InvoiceNumber} issued");
    }
}
```

---

## Week 2-3: Payment Processing (45-50 hours)

### Payment Models

**Payment.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class Payment
    {
        public int PaymentId { get; set; }
        public string PaymentReference { get; set; } = string.Empty;

        public int InvoiceId { get; set; }
        public Invoice Invoice { get; set; } = null!;

        public PaymentMethod PaymentMethod { get; set; }
        public PaymentStatus Status { get; set; }

        public decimal Amount { get; set; }

        public DateTime PaymentDate { get; set; }

        // Card Payment Details
        public string? CardLast4Digits { get; set; }
        public string? CardType { get; set; }
        public string? TransactionId { get; set; }

        // Bank Transfer Details
        public string? BankName { get; set; }
        public string? AccountNumber { get; set; }
        public string? ReferenceNumber { get; set; }

        // Check Details
        public string? CheckNumber { get; set; }
        public string? BankName_Check { get; set; }

        public string? Notes { get; set; }

        public int? ProcessedByEmployeeId { get; set; }
        public Employee? ProcessedBy { get; set; }

        public ICollection<PaymentAllocation> Allocations { get; set; } = new List<PaymentAllocation>();

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }

    public enum PaymentMethod
    {
        Cash = 1,
        CreditCard = 2,
        DebitCard = 3,
        BankTransfer = 4,
        Check = 5,
        OnlinePayment = 6,
        MobileWallet = 7,
        CorporateAccount = 8
    }

    public enum PaymentStatus
    {
        Pending = 1,
        Processed = 2,
        Successful = 3,
        Failed = 4,
        Refunded = 5,
        Disputed = 6
    }
}
```

**PaymentAllocation.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class PaymentAllocation
    {
        public int PaymentAllocationId { get; set; }
        public int PaymentId { get; set; }
        public Payment Payment { get; set; } = null!;

        public int InvoiceId { get; set; }
        public Invoice Invoice { get; set; } = null!;

        public decimal AllocationAmount { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
```

**Refund.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class Refund
    {
        public int RefundId { get; set; }
        public string RefundNumber { get; set; } = string.Empty;

        public int PaymentId { get; set; }
        public Payment Payment { get; set; } = null!;

        public decimal RefundAmount { get; set; }
        public RefundReason Reason { get; set; }
        public string? Description { get; set; }

        public RefundStatus Status { get; set; }

        public DateTime RefundDate { get; set; }
        public DateTime? ProcessedDate { get; set; }

        public int? ApprovedByEmployeeId { get; set; }
        public Employee? ApprovedBy { get; set; }

        public int? ProcessedByEmployeeId { get; set; }
        public Employee? ProcessedBy { get; set; }

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }

    public enum RefundReason
    {
        GuestRequest = 1,
        OverPayment = 2,
        DamageResolution = 3,
        CancellationPolicy = 4,
        Error = 5,
        Dispute = 6
    }

    public enum RefundStatus
    {
        Pending = 1,
        Approved = 2,
        Processing = 3,
        Completed = 4,
        Failed = 5,
        Declined = 6
    }
}
```

### Payment Service

**PaymentService**:
```csharp
public interface IPaymentService
{
    Task<Payment> ProcessPaymentAsync(ProcessPaymentRequest request);
    Task<Payment?> GetPaymentByReferenceAsync(string reference);
    Task<IEnumerable<Payment>> GetInvoicePaymentsAsync(int invoiceId);
    
    Task AllocatePaymentAsync(int paymentId, List<PaymentAllocationRequest> allocations);
    Task<decimal> GetUnallocatedAmount(int paymentId);
    
    Task<Refund> ProcessRefundAsync(ProcessRefundRequest request);
    Task<Refund?> GetRefundByNumberAsync(string refundNumber);
    
    Task<decimal> GetDailyRevenueAsync(DateTime date);
    Task<PaymentMethodAnalysis> GetPaymentMethodAnalysisAsync(DateTime startDate, DateTime endDate);
}

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IInvoiceRepository _invoiceRepository;
    private readonly IPaymentGateway _paymentGateway;

    public async Task<Payment> ProcessPaymentAsync(ProcessPaymentRequest request)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(request.InvoiceId);
        if (invoice == null)
            throw new InvalidOperationException("Invoice not found");

        // Validate amount
        if (request.Amount <= 0)
            throw new InvalidOperationException("Payment amount must be greater than zero");

        if (request.Amount > invoice.BalanceDue)
            throw new InvalidOperationException($"Payment exceeds balance due ({invoice.BalanceDue})");

        // Process payment based on method
        var transactionId = await ProcessPaymentMethod(request);

        var payment = new Payment
        {
            PaymentReference = GeneratePaymentReference(),
            InvoiceId = request.InvoiceId,
            PaymentMethod = request.PaymentMethod,
            Amount = request.Amount,
            Status = PaymentStatus.Successful,
            PaymentDate = DateTime.UtcNow,
            TransactionId = transactionId,
            ProcessedByEmployeeId = request.ProcessedByEmployeeId,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System"
        };

        await _paymentRepository.AddAsync(payment);

        // Update invoice
        invoice.AmountPaid += request.Amount;
        invoice.BalanceDue -= request.Amount;

        if (invoice.BalanceDue <= 0)
            invoice.Status = InvoiceStatus.Paid;
        else
            invoice.Status = InvoiceStatus.PartiallyPaid;

        await _invoiceRepository.UpdateAsync(invoice);

        return payment;
    }

    private async Task<string> ProcessPaymentMethod(ProcessPaymentRequest request)
    {
        switch (request.PaymentMethod)
        {
            case PaymentMethod.CreditCard:
            case PaymentMethod.DebitCard:
                var cardResult = await _paymentGateway.ProcessCardPaymentAsync(
                    request.CardToken,
                    request.Amount
                );
                return cardResult.TransactionId;

            case PaymentMethod.Cash:
                return GenerateCashTransactionId();

            case PaymentMethod.Check:
                return request.CheckNumber;

            default:
                throw new InvalidOperationException("Unsupported payment method");
        }
    }
}
```

---

## Week 4: Billing Reconciliation (30-35 hours)

### Reconciliation Models

**BillingReconciliation.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class BillingReconciliation
    {
        public int BillingReconciliationId { get; set; }
        public DateTime ReconciliationDate { get; set; }

        public decimal TotalInvoiced { get; set; }
        public decimal TotalCollected { get; set; }
        public decimal TotalOutstanding { get; set; }

        public decimal CashReceived { get; set; }
        public decimal CardReceived { get; set; }
        public decimal CheckReceived { get; set; }
        public decimal TransferReceived { get; set; }

        public decimal CashExpected { get; set; }
        public decimal CardExpected { get; set; }
        public decimal CheckExpected { get; set; }
        public decimal TransferExpected { get; set; }

        public decimal CashVariance { get; set; }
        public decimal CardVariance { get; set; }

        public string? Notes { get; set; }
        public bool IsReconciled { get; set; }

        public int ReconciliedByEmployeeId { get; set; }
        public Employee ReconciliedBy { get; set; } = null!;

        public DateTime CreatedAt { get; set; }
    }
}
```

### Reconciliation Service

**BillingReconciliationService**:
```csharp
public interface IBillingReconciliationService
{
    Task<BillingReconciliation> GenerateDailyReconciliationAsync(DateTime date);
    Task<BillingReconciliation> GetReconciliationByDateAsync(DateTime date);
    Task ApproveReconciliationAsync(int reconciliationId, int employeeId);
    Task<IEnumerable<BillingReconciliation>> GetReconciliationHistoryAsync(DateTime startDate, DateTime endDate);
}
```

---

## Week 5: Billing Reports & UI (30-35 hours)

### Reports

**BillingReportService**:
```csharp
public class BillingReportService
{
    public async Task<RevenueReport> GenerateRevenueReportAsync(DateTime startDate, DateTime endDate)
    {
        // Total revenue
        // Revenue by source (rooms, food, beverages)
        // Daily revenue trend
        // Payment method breakdown
    }

    public async Task<AccountsReceivableReport> GenerateARReportAsync()
    {
        // Outstanding invoices
        // Overdue breakdown
        // Customer balances
        // Collections forecast
    }

    public async Task<CustomerStatementReport> GenerateCustomerStatementAsync(int customerId)
    {
        // Invoice history
        // Payment history
        // Current balance
        // Aging analysis
    }
}
```

### UI Components

1. **BillingDashboard.xaml** - Overview
2. **InvoiceWindow.xaml** - Create/manage invoices
3. **PaymentWindow.xaml** - Record payments
4. **RefundWindow.xaml** - Process refunds
5. **BillingReportsWindow.xaml** - Analytics

---

## Phase 6 Key Deliverables

| Component | Details | Status |
|-----------|---------|--------|
| Invoicing | Creation, line items, adjustments | ✅ |
| Payment Processing | Multiple methods, reconciliation | ✅ |
| Refunds | Request, approval, processing | ✅ |
| Billing Reconciliation | Daily, monthly reconciliation | ✅ |
| Reports | Revenue, AR, statements | ✅ |

---

## Phase 6 Completion Checklist

- [ ] All billing models created
- [ ] Invoice system implemented
- [ ] Payment processing working
- [ ] Refund system operational
- [ ] Reconciliation system complete
- [ ] All UI windows created
- [ ] Payment gateway integrated (if live)
- [ ] Reports generating correctly
- [ ] Tests passing (>70% coverage)
- [ ] No accounting errors

**Ready for Phase 7 when complete** ✅
