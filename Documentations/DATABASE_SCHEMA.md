# HotelloSys - Database Schema Documentation

## Schema Overview

The HotelloSys database is designed for a multi-tenant hotel management system with 15+ main tables supporting room reservations, restaurant/bar operations, inventory management, billing, and comprehensive reporting.

---

## Table of Contents

1. [Core Tables](#core-tables)
2. [Hotel Operations](#hotel-operations)
3. [Food & Beverage](#food--beverage)
4. [Inventory Management](#inventory-management)
5. [Billing & Payments](#billing--payments)
6. [Customer Management](#customer-management)
7. [Audit & Compliance](#audit--compliance)
8. [System Configuration](#system-configuration)

---

## CORE TABLES

### Hotels Table
**Purpose**: Store hotel information for multi-tenancy support

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
    SubscriptionType VARCHAR(50),  -- 'Basic' or 'Premium'
    SubscriptionStartDate DATE,
    SubscriptionEndDate DATE,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
```

| Column | Type | Description |
|--------|------|-------------|
| HotelID | SERIAL | Primary key |
| HotelName | VARCHAR(255) | Unique hotel name |
| SubscriptionType | VARCHAR(50) | 'Basic' (single location) or 'Premium' (multi-hotel) |
| IsActive | BOOLEAN | Soft delete flag |

---

### Employees Table
**Purpose**: Manage all hotel staff members

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

CREATE INDEX idx_employees_hotel ON Employees(HotelID);
CREATE INDEX idx_employees_username ON Employees(Username);
CREATE INDEX idx_employees_department ON Employees(DepartmentID);
```

| Column | Type | Description |
|--------|------|-------------|
| EmployeeID | SERIAL | Primary key |
| HotelID | INT | Foreign key to Hotels |
| Username | VARCHAR(100) | Unique login username |
| PasswordHash | VARCHAR(255) | PBKDF2 hashed password |
| DepartmentID | INT | Which department employee belongs to |
| RoleID | INT | Job role (Admin, Manager, Waiter, etc.) |
| PhotoPath | VARCHAR(500) | File path to employee photo |

**Important**: Password is hashed using PBKDF2 with salt. Never store plain text passwords.

---

### Departments Table
**Purpose**: Organize hotel staff into departments

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

**Example Departments**:
- Front Desk
- Housekeeping
- Restaurant
- Bar
- Kitchen
- Maintenance
- Accounting
- Administration

---

### Roles Table
**Purpose**: Define user roles and permissions

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

**Example Roles**:
- Admin (all permissions)
- Manager (read/update most tables)
- Front Desk Staff (reservations, customers)
- Waiter (orders only)
- Bartender (bar orders only)
- Chef (orders, inventory)
- Housekeeping (room status)
- Accountant (invoices, payments, reports)

---

## HOTEL OPERATIONS

### RoomTypes Table
**Purpose**: Define room categories (Single, Double, Suite, etc.)

```sql
CREATE TABLE RoomTypes (
    RoomTypeID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    TypeName VARCHAR(100) NOT NULL,
    RoomDescription VARCHAR(500),
    BasePrice DECIMAL(10, 2) NOT NULL,
    Capacity INT,
    Amenities VARCHAR(500),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
```

| Column | Type | Example |
|--------|------|---------|
| TypeName | VARCHAR(100) | "Single Room", "Double Suite", "Presidential Suite" |
| BasePrice | DECIMAL(10, 2) | 100.00, 150.00, 500.00 |
| Capacity | INT | 1, 2, 4 |
| Amenities | VARCHAR(500) | "WiFi, TV, Mini Bar, Air Conditioning" |

---

### Rooms Table
**Purpose**: Manage individual room inventory

```sql
CREATE TABLE Rooms (
    RoomID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    RoomTypeID INT NOT NULL REFERENCES RoomTypes(RoomTypeID),
    RoomNumber VARCHAR(20) NOT NULL UNIQUE,
    Floor INT,
    RoomStatus VARCHAR(20) DEFAULT 'Available',
    LastMaintenanceDate DATE,
    NextMaintenanceDate DATE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);

CREATE INDEX idx_rooms_hotel ON Rooms(HotelID);
CREATE INDEX idx_rooms_status ON Rooms(RoomStatus);
```

| Column | Type | Valid Values |
|--------|------|---------------|
| RoomNumber | VARCHAR(20) | "101", "205", "3001" |
| Status | VARCHAR(20) | Available, Occupied, Maintenance, Cleaning, DoNotDisturb |
| Floor | INT | 1, 2, 3, etc. |

---

### Reservations Table
**Purpose**: Track room bookings

```sql
CREATE TABLE Reservations (
    ReservationID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    CustomerID INT REFERENCES Customers(CustomerID),
    RoomID INT NOT NULL REFERENCES Rooms(RoomID),
    CheckInDate DATE NOT NULL,
    CheckOutDate DATE NOT NULL,
    NumberOfGuests INT,
    ReservationStatus VARCHAR(20) DEFAULT 'Confirmed',
    SpecialRequests VARCHAR(500),
    BookingDate DATE NOT NULL,
    BookedByEmployeeID INT REFERENCES Employees(EmployeeID),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);

CREATE INDEX idx_reservations_hotel_dates ON Reservations(HotelID, CheckInDate, CheckOutDate);
CREATE INDEX idx_reservations_customer ON Reservations(CustomerID);
CREATE INDEX idx_reservations_room ON Reservations(RoomID);
```

| Column | Type | Description |
|--------|------|-------------|
| CheckInDate | DATE | Guest arrival date |
| CheckOutDate | DATE | Guest departure date |
| ReservationStatus | VARCHAR(20) | Confirmed, CheckedIn, CheckedOut, Cancelled |
| SpecialRequests | VARCHAR(500) | "High floor", "Near elevator", etc. |

**Business Rules**:
- CheckOutDate must be > CheckInDate
- Cannot book past dates
- Prevent overbooking of same room on same dates

---

## FOOD & BEVERAGE

### MenuCategories Table
**Purpose**: Organize menu items by category

```sql
CREATE TABLE MenuCategories (
    MenuCategoryID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    ServiceType VARCHAR(20) NOT NULL,  -- 'Restaurant' or 'Bar'
    CategoryName VARCHAR(100) NOT NULL,
    CategoryDescription VARCHAR(500),
    DisplayOrder INT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
```

**Restaurant Categories**: Appetizers, Main Courses, Desserts, Beverages
**Bar Categories**: Spirits, Wine, Beer, Cocktails, Non-Alcoholic

---

### MenuItems Table
**Purpose**: Define items available for ordering

```sql
CREATE TABLE MenuItems (
    MenuItemID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    MenuCategoryID INT NOT NULL REFERENCES MenuCategories(MenuCategoryID),
    ItemName VARCHAR(200) NOT NULL,
    ItemDescription VARCHAR(500),
    Price DECIMAL(10, 2) NOT NULL,
    PrepTime INT,  -- in minutes
    IsAvailable BOOLEAN DEFAULT TRUE,
    IsVegetarian BOOLEAN DEFAULT FALSE,
    Allergens VARCHAR(255),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
```

| Column | Type | Example |
|--------|------|---------|
| ItemName | VARCHAR(200) | "Caesar Salad", "Grilled Salmon" |
| Price | DECIMAL(10, 2) | 12.50, 28.99 |
| PrepTime | INT | 15, 30, 45 (minutes) |
| Allergens | VARCHAR(255) | "Nuts, Dairy, Shellfish" |

---

### Orders Table
**Purpose**: Track restaurant and bar orders

```sql
CREATE TABLE Orders (
    OrderID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    RoomID INT REFERENCES Rooms(RoomID),
    ServiceType VARCHAR(20) NOT NULL,  -- 'Restaurant' or 'Bar'
    OrderStatus VARCHAR(20) DEFAULT 'Pending',
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

CREATE INDEX idx_orders_hotel_status ON Orders(HotelID, OrderStatus);
CREATE INDEX idx_orders_room ON Orders(RoomID);

CREATE TABLE OrderItems (
    OrderItemID SERIAL PRIMARY KEY,
    OrderID INT NOT NULL REFERENCES Orders(OrderID),
    MenuItemID INT NOT NULL REFERENCES MenuItems(MenuItemID),
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10, 2) NOT NULL,
    SpecialInstructions VARCHAR(255),
    ItemStatus VARCHAR(20) DEFAULT 'Pending',
    ServedTime TIMESTAMP,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| Column | Type | Valid Values |
|--------|------|---------------|
| ServiceType | VARCHAR(20) | 'Restaurant' or 'Bar' |
| OrderStatus | VARCHAR(20) | Pending, Preparing, Ready, Served, Cancelled |
| ItemStatus | VARCHAR(20) | Pending, Preparing, Ready, Served |

---

## INVENTORY MANAGEMENT

### InventoryCategories Table
**Purpose**: Organize inventory items

```sql
CREATE TABLE InventoryCategories (
    InventoryCategoryID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    InventoryCategoryName VARCHAR(100) NOT NULL,
    InventoryCategoryDescription VARCHAR(500)
);
```

**Categories**: 
- Food Items (fresh, frozen, dry goods)
- Beverages (alcoholic, non-alcoholic)
- Supplies (cleaning, linens, toiletries)

---

### InventoryItems Table
**Purpose**: Track individual inventory items and stock levels

```sql
CREATE TABLE InventoryItems (
    InventoryItemID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    InventoryCategoryID INT NOT NULL REFERENCES InventoryCategories(InventoryCategoryID),
    ItemName VARCHAR(200) NOT NULL,
    SKU VARCHAR(100) UNIQUE,
    Barcode VARCHAR(100),
    InventoryItemDescription VARCHAR(500),
    Unit VARCHAR(20),  -- 'Piece', 'Kg', 'Liter', 'Box', etc.
    CurrentStock DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ReorderLevel DECIMAL(10, 2),
    MaxStock DECIMAL(10, 2),
    UnitCost DECIMAL(10, 2),
    SupplierID INT REFERENCES Suppliers(SupplierID),
    ExpiryDate DATE,
    StorageLocation VARCHAR(100),
    IsBarcodeEnabled BOOLEAN DEFAULT FALSE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);

CREATE INDEX idx_inventory_hotel ON InventoryItems(HotelID);
CREATE INDEX idx_inventory_barcode ON InventoryItems(Barcode);
```

| Column | Type | Description |
|--------|------|-------------|
| SKU | VARCHAR(100) | Stock Keeping Unit - unique identifier |
| Barcode | VARCHAR(100) | For barcode scanning (optional) |
| Unit | VARCHAR(20) | 'Piece', 'Kg', 'Liter', 'Box', 'Bottle' |
| CurrentStock | DECIMAL(10, 2) | Real-time inventory level |
| ReorderLevel | DECIMAL(10, 2) | Minimum level before reordering |
| IsBarcodeEnabled | BOOLEAN | Enable/disable barcode tracking per hotel |

---

### InventoryTransactions Table
**Purpose**: Track all inventory changes

```sql
CREATE TABLE InventoryTransactions (
    InventoryTransactionID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    InventoryItemID INT NOT NULL REFERENCES InventoryItems(InventoryItemID),
    TransactionType VARCHAR(20) NOT NULL,
    Quantity DECIMAL(10, 2) NOT NULL,
    Reference VARCHAR(100),
    Notes VARCHAR(255),
    CreatedByEmployeeID INT NOT NULL REFERENCES Employees(EmployeeID),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_transactions_date ON InventoryTransactions(CreatedDate);
```

| Column | Type | Example |
|--------|------|---------|
| TransactionType | VARCHAR(20) | 'In', 'Out', 'Adjustment', 'Wastage' |
| Quantity | DECIMAL(10, 2) | 10.5 (Kg), 24 (Bottles) |
| Reference | VARCHAR(100) | OrderID, PurchaseOrderID |

**Transaction Types**:
- **In**: Stock received from supplier
- **Out**: Stock used (from menu item orders)
- **Adjustment**: Manual correction (inventory count discrepancy)
- **Wastage**: Items discarded (expired, damaged)

---

### Suppliers Table
**Purpose**: Manage suppliers and ordering

```sql
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

## BILLING & PAYMENTS

### Invoices Table
**Purpose**: Track all billing transactions

```sql
CREATE TABLE Invoices (
    InvoiceID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    InvoiceNumber VARCHAR(50) NOT NULL UNIQUE,
    CustomerID INT REFERENCES Customers(CustomerID),
    ReservationID INT REFERENCES Reservations(ReservationID),
    InvoiceDate DATE NOT NULL,
    DueDate DATE,
    SubTotal DECIMAL(15, 2),
    TaxAmount DECIMAL(15, 2),
    DiscountAmount DECIMAL(15, 2),
    ServiceCharge DECIMAL(15, 2),
    TotalAmount DECIMAL(15, 2),
    PaidAmount DECIMAL(15, 2) DEFAULT 0,
    PaymentStatus VARCHAR(20) DEFAULT 'Pending',
    Notes VARCHAR(500),
    CreatedByEmployeeID INT NOT NULL REFERENCES Employees(EmployeeID),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);

CREATE INDEX idx_invoices_hotel_status ON Invoices(HotelID, PaymentStatus);
CREATE INDEX idx_invoices_number ON Invoices(InvoiceNumber);
```

| Column | Type | Description |
|--------|------|-------------|
| InvoiceNumber | VARCHAR(50) | Auto-generated (e.g., INV-2026-001234) |
| PaymentStatus | VARCHAR(20) | Pending, Partial, Paid, Overdue |
| SubTotal | DECIMAL(15, 2) | Sum of line items before tax/discount |
| TaxAmount | DECIMAL(15, 2) | Calculated tax |
| DiscountAmount | DECIMAL(15, 2) | Applied discounts |
| ServiceCharge | DECIMAL(15, 2) | Service tax/charge |
| TotalAmount | DECIMAL(15, 2) | SubTotal + Tax - Discount + ServiceCharge |

**Invoice Formula**:
```
SubTotal = Sum of all line items
TotalAmount = (SubTotal - DiscountAmount) + TaxAmount + ServiceCharge
OutstandingAmount = TotalAmount - PaidAmount
```

---

### InvoiceLineItems Table
**Purpose**: Individual line items on invoices

```sql
CREATE TABLE InvoiceLineItems (
    InvoiceLineItemID SERIAL PRIMARY KEY,
    InvoiceID INT NOT NULL REFERENCES Invoices(InvoiceID),
    InvoiceLineItemDescription VARCHAR(255) NOT NULL,
    Quantity DECIMAL(10, 2),
    UnitPrice DECIMAL(10, 2) NOT NULL,
    LineTotal DECIMAL(15, 2) NOT NULL,
    LineType VARCHAR(20),  -- 'Room', 'Food', 'Drink', 'Service', 'Tax', 'Discount'
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Example Line Items**:
```
Room Charge - 3 nights x $150 = $450
Caesar Salad - 2 x $12.50 = $25.00
Grilled Salmon - 1 x $28.99 = $28.99
Martini - 3 x $15.00 = $45.00
---
SubTotal = $548.99
Service Tax (10%) = $54.90
Total = $603.89
```

---

### Payments Table
**Purpose**: Record all payments received

```sql
CREATE TABLE Payments (
    PaymentID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    InvoiceID INT NOT NULL REFERENCES Invoices(InvoiceID),
    PaymentDate DATE NOT NULL,
    PaymentMethod VARCHAR(50),
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

| Column | Type | Example |
|--------|------|---------|
| PaymentMethod | VARCHAR(50) | 'Cash', 'Credit Card', 'Debit Card', 'Cheque', 'Bank Transfer' |
| Amount | DECIMAL(15, 2) | 150.00, 603.89 |
| ReferenceNumber | VARCHAR(100) | Check number, transaction ID |

---

## CUSTOMER MANAGEMENT

### Customers Table
**Purpose**: Manage guest information and track spending

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
    CustomerTier VARCHAR(20) DEFAULT 'Regular',
    TotalSpent DECIMAL(15, 2) DEFAULT 0,
    LoyaltyPoints INT DEFAULT 0,
    LastVisitDate DATE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);

CREATE INDEX idx_customers_hotel ON Customers(HotelID);
CREATE INDEX idx_customers_email ON Customers(Email);
```

| Column | Type | Description |
|--------|------|-------------|
| CustomerTier | VARCHAR(20) | VIP, Regular, Occasional (auto-calculated) |
| TotalSpent | DECIMAL(15, 2) | Cumulative spending (auto-updated) |
| LoyaltyPoints | INT | Current points balance |
| PreferredLanguage | VARCHAR(50) | 'en', 'es', 'fr', 'de', 'zh', etc. |

**Customer Tier Calculation**:
- **VIP**: TotalSpent > $10,000 OR 5+ visits in last year
- **Regular**: TotalSpent $1,000-$10,000 OR 2-4 visits last year
- **Occasional**: TotalSpent < $1,000 OR 1 visit last year

---

### LoyaltyPoints Table
**Purpose**: Track loyalty point transactions

```sql
CREATE TABLE LoyaltyPoints (
    LoyaltyPointID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    CustomerID INT NOT NULL REFERENCES Customers(CustomerID),
    PointsEarned INT,
    PointsRedeemed INT DEFAULT 0,
    TransactionDate DATE NOT NULL,
    ExpiryDate DATE,
    Source VARCHAR(50),  -- 'Purchase', 'Bonus', 'Referral'
    RelatedInvoiceID INT REFERENCES Invoices(InvoiceID),
    Notes VARCHAR(255),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT
);
```

**Points Calculation**:
- 1 Point per $1 spent
- Bonus points: 100 points on sign-up, 50 points on birthday
- Points expire after 1 year of inactivity
- 100 Points = $5 discount

---

## AUDIT & COMPLIANCE

### AuditLogs Table
**Purpose**: Immutable record of all system changes

```sql
CREATE TABLE AuditLogs (
    AuditLogID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    TableName VARCHAR(100) NOT NULL,
    RecordID INT,
    ActionType VARCHAR(20) NOT NULL,  -- 'Insert', 'Update', 'Delete'
    ActionByEmployeeID INT NOT NULL REFERENCES Employees(EmployeeID),
    ActionDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ColumnName VARCHAR(100),
    OldValue TEXT,
    NewValue TEXT,
    IPAddress VARCHAR(50),
    ApplicationVersion VARCHAR(20)
);

CREATE INDEX idx_audit_logs_hotel_date ON AuditLogs(HotelID, ActionDate);
CREATE INDEX idx_audit_logs_employee ON AuditLogs(ActionByEmployeeID);
```

**Examples**:
```
AuditLog: Invoice INV-2026-001 paid
- TableName: Invoices
- RecordID: 12345
- ActionType: Update
- ColumnName: PaymentStatus
- OldValue: 'Pending'
- NewValue: 'Paid'

AuditLog: Employee John deleted
- TableName: Employees
- RecordID: 567
- ActionType: Delete
- OldValue: {entire employee record}
- NewValue: NULL
```

---

## SYSTEM CONFIGURATION

### HotelSettings Table
**Purpose**: Store hotel-specific configuration

```sql
CREATE TABLE HotelSettings (
    HotelSettingID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    SettingKey VARCHAR(100) NOT NULL UNIQUE,
    SettingValue VARCHAR(500),
    SettingType VARCHAR(50),
    SettingDescription VARCHAR(255),
    IsSystemSetting BOOLEAN DEFAULT FALSE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP
);
```

**Common Settings**:
```
TimeZone = "Tanzania/Arusha"
DefaultCurrency = "USD"
DefaultLanguage = "en-US"
DefaultTaxRate = "0.10"
ServiceChargeRate = "0.15"
MaxRoomReservationDays = "365"
PointsExpiryDays = "365"
BackupTime = "02:00:00"
SessionTimeoutMinutes = "30"
```

---

### PrinterConfiguration Table
**Purpose**: Configure printers for different outputs

```sql
CREATE TABLE PrinterConfiguration (
    PrinterConfigID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    PrinterName VARCHAR(100) NOT NULL,
    PrinterType VARCHAR(20),  -- 'Thermal' or 'Regular'
    PrinterModel VARCHAR(100),
    NetworkAddress VARCHAR(100),
    Port INT,
    IsDefault BOOLEAN DEFAULT FALSE,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP
);
```

**Example Configurations**:
```
1. Thermal Printer (Restaurant receipts)
   - Name: "Kitchen Printer"
   - Type: Thermal
   - Model: "Zebra ZP 450"
   - Network Address: "192.168.1.100"

2. Regular Printer (Reports, invoices)
   - Name: "Office Printer"
   - Type: Regular
   - Model: "HP LaserJet M402"
   - Network Address: "192.168.1.101"
```

---

### LanguageSettings Table
**Purpose**: Manage supported languages

```sql
CREATE TABLE LanguageSettings (
    LanguageSettingID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID),
    LanguageCode VARCHAR(10),
    LanguageName VARCHAR(50),
    IsDefault BOOLEAN DEFAULT FALSE,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Supported Languages**:
- en-US (English - United States)
- es-ES (Spanish - Spain)
- fr-FR (French)
- de-DE (German)
- pt-BR (Portuguese - Brazil)
- zh-CN (Simplified Chinese)
- ja-JP (Japanese)

---

## QUERY EXAMPLES

### Get Available Rooms for Date Range
```sql
SELECT r.RoomID, r.RoomNumber, rt.TypeName, rt.BasePrice
FROM Rooms r
JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
WHERE r.HotelID = 1
  AND r.Status = 'Available'
  AND r.RoomID NOT IN (
      SELECT RoomID FROM Reservations
      WHERE HotelID = 1
        AND CheckInDate < '2026-02-15'
        AND CheckOutDate > '2026-02-10'
  )
ORDER BY rt.TypeName, r.RoomNumber;
```

### Get Pending Orders for Kitchen
```sql
SELECT o.OrderID, o.OrderDate, r.RoomNumber, oi.MenuItemID, mi.ItemName, oi.Quantity
FROM Orders o
JOIN OrderItems oi ON o.OrderID = oi.OrderID
JOIN MenuItems mi ON oi.MenuItemID = mi.MenuItemID
LEFT JOIN Rooms r ON o.RoomID = r.RoomID
WHERE o.HotelID = 1
  AND o.ServiceType = 'Restaurant'
  AND o.OrderStatus IN ('Pending', 'Preparing')
ORDER BY o.OrderDate;
```

### Get Customer Spending Summary
```sql
SELECT c.CustomerID, c.FirstName, c.LastName, c.CustomerTier,
       COUNT(DISTINCT i.InvoiceID) as TotalInvoices,
       SUM(i.TotalAmount) as TotalSpent,
       c.LoyaltyPoints
FROM Customers c
LEFT JOIN Invoices i ON c.CustomerID = i.CustomerID
WHERE c.HotelID = 1
GROUP BY c.CustomerID, c.FirstName, c.LastName, c.CustomerTier, c.LoyaltyPoints
ORDER BY TotalSpent DESC;
```

### Get Inventory Items Below Reorder Level
```sql
SELECT ii.InventoryItemID, ii.ItemName, ii.CurrentStock, ii.ReorderLevel, s.SupplierName
FROM InventoryItems ii
LEFT JOIN Suppliers s ON ii.SupplierID = s.SupplierID
WHERE ii.HotelID = 1
  AND ii.CurrentStock < ii.ReorderLevel
  AND ii.CurrentStock > 0
ORDER BY ii.ItemName;
```

### Get Daily Revenue Report
```sql
SELECT i.InvoiceDate,
       COUNT(i.InvoiceID) as TotalInvoices,
       SUM(i.SubTotal) as TotalRevenue,
       SUM(CASE WHEN i.PaymentStatus = 'Paid' THEN i.TotalAmount ELSE 0 END) as PaidAmount,
       SUM(CASE WHEN i.PaymentStatus != 'Paid' THEN i.TotalAmount ELSE 0 END) as OutstandingAmount
FROM Invoices i
WHERE i.HotelID = 1
  AND i.InvoiceDate >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY i.InvoiceDate
ORDER BY i.InvoiceDate DESC;
```

---

**Database Documentation Version**: 1.0  
**Last Updated**: January 24, 2026  
**PostgreSQL Version**: 15+
