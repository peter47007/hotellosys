# Phase 7: Customer Loyalty & CRM - DETAILED GUIDE

**Phase Duration**: 4 weeks (Weeks 33-36)  
**Estimated Hours**: 110-130 hours  
**Weekly Target**: 27-32 hours/week  
**Complexity**: Medium  
**Dependencies**: Phases 1-6 (All systems)

---

## Phase Overview

Phase 7 implements customer relationship management and loyalty program to drive repeat business and increase customer lifetime value.

### Key Objectives:
- Create loyalty program
- Implement customer segmentation
- Build customer communication
- Create preference tracking
- Implement points/rewards system
- Build customer analytics
- Create marketing automation framework
- Track customer lifetime value

### Business Value:
- Increased repeat business
- Higher customer spending
- Better guest experience
- Targeted marketing
- Reduced churn

---

## Week 1: Loyalty Program Models (27-30 hours)

### Loyalty Models

**LoyaltyProgram.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class LoyaltyProgram
    {
        public int LoyaltyProgramId { get; set; }
        public string ProgramName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public int PointsPerDollarSpent { get; set; } // e.g., 1 point per $1
        public int MinimumPointsForReward { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public ICollection<LoyaltyMember> Members { get; set; } = new List<LoyaltyMember>();
        public ICollection<LoyaltyTier> Tiers { get; set; } = new List<LoyaltyTier>();
        public ICollection<LoyaltyReward> Rewards { get; set; } = new List<LoyaltyReward>();

        public DateTime CreatedAt { get; set; }
    }
}
```

**LoyaltyMember.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class LoyaltyMember
    {
        public int LoyaltyMemberId { get; set; }
        public string MemberNumber { get; set; } = string.Empty; // "LM-2026-001234"

        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;

        public int LoyaltyProgramId { get; set; }
        public LoyaltyProgram LoyaltyProgram { get; set; } = null!;

        public int CurrentTierId { get; set; }
        public LoyaltyTier CurrentTier { get; set; } = null!;

        public decimal CurrentPoints { get; set; }
        public decimal LifetimePoints { get; set; }

        public DateTime EnrollmentDate { get; set; }
        public DateTime? LastActivityDate { get; set; }

        public LoyaltyMemberStatus Status { get; set; }

        public ICollection<LoyaltyPointTransaction> PointTransactions { get; set; } = new List<LoyaltyPointTransaction>();
        public ICollection<LoyaltyRedemption> Redemptions { get; set; } = new List<LoyaltyRedemption>();

        public DateTime CreatedAt { get; set; }
    }

    public enum LoyaltyMemberStatus
    {
        Active = 1,
        Inactive = 2,
        Suspended = 3,
        Expired = 4
    }
}
```

**LoyaltyTier.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class LoyaltyTier
    {
        public int LoyaltyTierId { get; set; }
        public string TierName { get; set; } = string.Empty; // "Bronze", "Silver", "Gold", "Platinum"

        public int LoyaltyProgramId { get; set; }
        public LoyaltyProgram LoyaltyProgram { get; set; } = null!;

        public decimal MinimumPointsRequired { get; set; }
        public decimal MinimumSpendRequired { get; set; }

        public int BenefitLevel { get; set; } // 1-5 for benefits

        public decimal PointsMultiplier { get; set; } // e.g., 1.5x points
        public decimal DiscountPercentage { get; set; }

        public bool FreeUpgradeEligible { get; set; }
        public int FreeUpgradesPerYear { get; set; }

        public bool FreeBreakfastEligible { get; set; }
        public bool LateCheckoutEligible { get; set; }

        public string? Description { get; set; }

        public ICollection<LoyaltyMember> Members { get; set; } = new List<LoyaltyMember>();

        public DateTime CreatedAt { get; set; }
    }
}
```

### Points & Rewards

**LoyaltyPointTransaction.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class LoyaltyPointTransaction
    {
        public int LoyaltyPointTransactionId { get; set; }
        public int LoyaltyMemberId { get; set; }
        public LoyaltyMember Member { get; set; } = null!;

        public PointTransactionType TransactionType { get; set; }
        public decimal PointsAmount { get; set; }

        public string? Reference { get; set; } // InvoiceID, ReservationID
        public string? Description { get; set; }

        public DateTime TransactionDate { get; set; }
        public DateTime ExpirationDate { get; set; } // Points expire after 2-3 years

        public DateTime CreatedAt { get; set; }
    }

    public enum PointTransactionType
    {
        Earned = 1,
        Redeemed = 2,
        Expired = 3,
        Adjusted = 4,
        Bonus = 5
    }
}
```

**LoyaltyReward.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class LoyaltyReward
    {
        public int LoyaltyRewardId { get; set; }
        public int LoyaltyProgramId { get; set; }
        public LoyaltyProgram LoyaltyProgram { get; set; } = null!;

        public string RewardName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public decimal PointsRequired { get; set; }
        public decimal CashValue { get; set; }

        public RewardType RewardType { get; set; }

        public bool IsActive { get; set; } = true;
        public int AvailableQuantity { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public ICollection<LoyaltyRedemption> Redemptions { get; set; } = new List<LoyaltyRedemption>();

        public DateTime CreatedAt { get; set; }
    }

    public enum RewardType
    {
        DiscountAmount = 1,
        PercentageDiscount = 2,
        FreeNight = 3,
        FreeUpgrade = 4,
        FreeBreakfast = 5,
        FreeService = 6,
        GiftCard = 7,
        Partnership = 8
    }
}
```

**LoyaltyRedemption.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class LoyaltyRedemption
    {
        public int LoyaltyRedemptionId { get; set; }
        public string RedemptionNumber { get; set; } = string.Empty;

        public int LoyaltyMemberId { get; set; }
        public LoyaltyMember Member { get; set; } = null!;

        public int LoyaltyRewardId { get; set; }
        public LoyaltyReward Reward { get; set; } = null!;

        public decimal PointsRedeemed { get; set; }
        public decimal CashValue { get; set; }

        public RedemptionStatus Status { get; set; }

        public DateTime RedemptionDate { get; set; }
        public DateTime? FulfilledDate { get; set; }

        public int? FulfilledByEmployeeId { get; set; }
        public Employee? FulfilledBy { get; set; }

        public DateTime CreatedAt { get; set; }
    }

    public enum RedemptionStatus
    {
        Pending = 1,
        Approved = 2,
        Fulfilled = 3,
        Cancelled = 4,
        Expired = 5
    }
}
```

### Loyalty Service

**LoyaltyService**:
```csharp
public interface ILoyaltyService
{
    Task<LoyaltyMember> EnrollMemberAsync(int customerId, int loyaltyProgramId);
    Task<LoyaltyMember?> GetMemberByNumberAsync(string memberNumber);
    
    Task EarnPointsAsync(int memberId, decimal amount, string reference);
    Task BonusPointsAsync(int memberId, decimal bonusPoints, string reason);
    Task<decimal> GetMemberPointsAsync(int memberId);
    Task<decimal> GetPointsExpiringInDaysAsync(int memberId, int days = 90);
    
    Task<LoyaltyRedemption> RedeemPointsAsync(int memberId, int rewardId);
    Task<IEnumerable<LoyaltyReward>> GetAvailableRewardsAsync(int memberId);
    
    Task UpdateMemberTierAsync(int memberId);
    Task<LoyaltyTier> GetMemberTierAsync(int memberId);
    
    Task<decimal> CalculateLifetimeValueAsync(int customerId);
    Task<IEnumerable<LoyaltyMember>> GetAtRiskMembersAsync(int inactiveDays = 180);
}

public class LoyaltyService : ILoyaltyService
{
    private readonly ILoyaltyMemberRepository _memberRepository;
    private readonly ILoyaltyRewardRepository _rewardRepository;
    private readonly ILoyaltyTierRepository _tierRepository;

    public async Task EarnPointsAsync(int memberId, decimal amount, string reference)
    {
        var member = await _memberRepository.GetByIdAsync(memberId);
        var pointsEarned = (int)(amount * member.LoyaltyProgram.PointsPerDollarSpent);

        // Apply tier multiplier
        pointsEarned = (int)(pointsEarned * member.CurrentTier.PointsMultiplier);

        var transaction = new LoyaltyPointTransaction
        {
            LoyaltyMemberId = memberId,
            TransactionType = PointTransactionType.Earned,
            PointsAmount = pointsEarned,
            Reference = reference,
            TransactionDate = DateTime.UtcNow,
            ExpirationDate = DateTime.UtcNow.AddYears(2), // Points expire in 2 years
            CreatedAt = DateTime.UtcNow
        };

        await _memberRepository.AddPointTransactionAsync(transaction);

        member.CurrentPoints += pointsEarned;
        member.LifetimePoints += pointsEarned;
        member.LastActivityDate = DateTime.UtcNow;

        await _memberRepository.UpdateAsync(member);
    }

    public async Task UpdateMemberTierAsync(int memberId)
    {
        var member = await _memberRepository.GetByIdAsync(memberId);
        var tiers = await _tierRepository.GetByProgramAsync(member.LoyaltyProgramId);

        var qualifiedTier = tiers
            .Where(t => member.LifetimePoints >= t.MinimumPointsRequired)
            .OrderByDescending(t => t.BenefitLevel)
            .FirstOrDefault();

        if (qualifiedTier != null && member.CurrentTierId != qualifiedTier.LoyaltyTierId)
        {
            member.CurrentTierId = qualifiedTier.LoyaltyTierId;
            await _memberRepository.UpdateAsync(member);
        }
    }
}
```

---

## Week 2: Customer Preferences & Communication (28-31 hours)

### Preference Models

**CustomerPreference.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class CustomerPreference
    {
        public int CustomerPreferenceId { get; set; }
        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;

        // Room Preferences
        public string? PreferredRoomType { get; set; }
        public string? PreferredFloor { get; set; }
        public string? PreferredLocation { get; set; } // "Near elevator", "Away from elevator"

        // Service Preferences
        public bool PreferWakupCall { get; set; }
        public TimeSpan? WakeupTime { get; set; }

        public bool PreferTurndownService { get; set; }
        public TimeSpan? TurndownTime { get; set; }

        // Dining Preferences
        public string? DietaryRestrictions { get; set; }
        public string? FavoriteCuisine { get; set; }
        public ICollection<string> FavoriteMenuItems { get; set; } = new List<string>();

        // Communication Preferences
        public bool OptInEmail { get; set; } = true;
        public bool OptInSMS { get; set; } = true;
        public bool OptInPhone { get; set; } = true;

        public string? PreferredContactMethod { get; set; } // Email, SMS, Phone
        public string? PreferredLanguage { get; set; }

        // Special Needs
        public string? AccessibilityNeeds { get; set; }
        public string? SpecialAnniversaryDates { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
```

**CommunicationLog.cs**:
```csharp
namespace HotelloSys.Core.Models
{
    public class CommunicationLog
    {
        public int CommunicationLogId { get; set; }
        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;

        public CommunicationType CommunicationType { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;

        public DateTime SentDate { get; set; }
        public bool Delivered { get; set; }
        public bool Opened { get; set; }
        public bool Clicked { get; set; }

        public int? SentByEmployeeId { get; set; }
        public Employee? SentBy { get; set; }

        public DateTime CreatedAt { get; set; }
    }

    public enum CommunicationType
    {
        Email = 1,
        SMS = 2,
        Phone = 3,
        InApp = 4,
        Marketing = 5,
        Transactional = 6
    }
}
```

---

## Week 3: Customer Analytics (27-30 hours)

### Analytics Models & Service

**CustomerSegmentation**:
```csharp
public class CustomerSegmentation
{
    public int SegmentId { get; set; }
    public string SegmentName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    // Criteria
    public decimal? MinLifetimeValue { get; set; }
    public decimal? MaxLifetimeValue { get; set; }
    public int? MinStayCount { get; set; }
    public int? MaxDaysSinceLastStay { get; set; }

    public ICollection<int> CustomerIds { get; set; } = new List<int>();
}
```

**CustomerAnalyticsService**:
```csharp
public interface ICustomerAnalyticsService
{
    Task<decimal> CalculateCustomerLifetimeValueAsync(int customerId);
    Task<CustomerMetrics> GetCustomerMetricsAsync(int customerId);
    Task<IEnumerable<int>> GetCustomerSegmentAsync(string segmentName);
    Task<ChurnRiskAnalysis> IdentifyChurnRiskAsync();
    Task<UpSellOpportunities> IdentifyUpSellOpportunitiesAsync(int customerId);
}

public class CustomerAnalyticsService : ICustomerAnalyticsService
{
    public async Task<decimal> CalculateCustomerLifetimeValueAsync(int customerId)
    {
        var invoices = await _invoiceRepository.GetCustomerInvoicesAsync(customerId);
        var totalSpent = invoices.Sum(i => i.TotalAmount);

        var reservations = await _reservationRepository.GetCustomerReservationsAsync(customerId);
        var nightsStayed = reservations.Sum(r => (r.CheckOutDate - r.CheckInDate).Days);

        var avgNightValue = nightsStayed > 0 ? totalSpent / nightsStayed : 0;

        return totalSpent + (avgNightValue * 10); // Project next 10 nights
    }

    public async Task<ChurnRiskAnalysis> IdentifyChurnRiskAsync()
    {
        var customers = await _customerRepository.GetAllAsync();

        var atRisk = customers.Where(c =>
            c.LastStayDate < DateTime.UtcNow.AddMonths(-6) ||
            c.TotalStays == 1
        ).ToList();

        return new ChurnRiskAnalysis
        {
            HighRiskCount = atRisk.Count,
            HighRiskCustomers = atRisk,
            RecommendedActions = GenerateRetentionActions(atRisk)
        };
    }
}
```

---

## Week 4: UI & Reporting (28-30 hours)

### UI Components

1. **LoyaltyMemberWindow.xaml** - Enroll/manage members
2. **LoyaltyPointsWindow.xaml** - View/redeem points
3. **CustomerPreferenceWindow.xaml** - Set preferences
4. **CRMDashboard.xaml** - Customer metrics
5. **SegmentationWindow.xaml** - Create/manage segments
6. **CampaignWindow.xaml** - Marketing campaigns

### Reports

**CustomerAnalyticsReports**:
```csharp
public class CustomerAnalyticsReportService
{
    public async Task<LoyaltyAnalysisReport> GenerateLoyaltyAnalysisAsync()
    {
        // Program enrollment
        // Points issued/redeemed
        // Tier distribution
    }

    public async Task<CustomerSegmentationReport> GenerateSegmentationAsync()
    {
        // Customers by segment
        // Segment characteristics
        // Segment value
    }

    public async Task<RetentionAnalysisReport> GenerateRetentionAnalysisAsync()
    {
        // Repeat rate
        // Churn rate
        // At-risk customers
    }
}
```

---

## Phase 7 Key Deliverables

| Component | Details | Status |
|-----------|---------|--------|
| Loyalty Program | Points, tiers, rewards | ✅ |
| Customer Preferences | Room, dining, communication | ✅ |
| Customer Analytics | LTV, segmentation, churn | ✅ |
| Communication Tracking | Email, SMS, phone logs | ✅ |
| Reports | Loyalty, retention, churn | ✅ |

---

## Phase 7 Completion Checklist

- [ ] All loyalty models created
- [ ] Loyalty program operational
- [ ] Preference tracking working
- [ ] Analytics service calculating correctly
- [ ] Communication logging complete
- [ ] All UI windows created
- [ ] Reports generating correctly
- [ ] Tests passing (>70% coverage)
- [ ] No logic errors in LTV calculation

**Ready for Phase 8 when complete** ✅
