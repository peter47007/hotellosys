# HotelloSys - Database Schema Documentation (Updated)

**Last Updated:** March 10, 2026  
**Database:** PostgreSQL 15+ (development: SQLite)

## Schema Overview

This schema supports a multi-tenant hotel management system with modules for rooms, restaurant, bar, inventory, billing, loyalty, and auditing.

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

1. ## Core Tables

### Hotels
```sql
CREATE TABLE Hotels (
    HotelID SERIAL PRIMARY KEY,
    HotelName VARCHAR(255) NOT NULL UNIQUE,
    Address TEXT,
    City VARCHAR(100),
    Country VARCHAR(100),
    PostalCode VARCHAR(20),
    PhoneNumber VARCHAR(20),
    Email VARCHAR(255),
    Website VARCHAR(255),
    RegistrationNumber VARCHAR(100),
    TaxID VARCHAR(50),
    SubscriptionType VARCHAR(50), -- 'Basic', 'Premium'
    SubscriptionStartDate DATE,
    SubscriptionEndDate DATE,
    DefaultCurrency VARCHAR(3) DEFAULT 'USD',
    DefaultLanguage VARCHAR(10) DEFAULT 'en',
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
```
### EMPLOYEES
```
CREATE TABLE Employees (
    EmployeeID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
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
### Departments
```
CREATE TABLE Departments (
    DepartmentID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    DepartmentName VARCHAR(100) NOT NULL,
    DepartmentDescription VARCHAR(500),
    ManagerID INT REFERENCES Employees(EmployeeID),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
```
### Roles
```
CREATE TABLE Roles (
    RoleID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    RoleName VARCHAR(100) NOT NULL,
    RoleDescription VARCHAR(500),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
```
### RolePermissions
```
CREATE TABLE RolePermissions (
    RolePermissionID SERIAL PRIMARY KEY,
    RoleID INT NOT NULL REFERENCES Roles(RoleID) ON DELETE CASCADE,
    PermissionCode VARCHAR(100) NOT NULL,
    PermissionName VARCHAR(200),
    CanCreate BOOLEAN DEFAULT FALSE,
    CanRead BOOLEAN DEFAULT FALSE,
    CanUpdate BOOLEAN DEFAULT FALSE,
    CanDelete BOOLEAN DEFAULT FALSE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
2. ## Hotel Operations

### RoomTypes
```
CREATE TABLE RoomTypes (
    RoomTypeID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    TypeName VARCHAR(100) NOT NULL,
    TypeDescription TEXT,
    BasePrice DECIMAL(10,2) NOT NULL,
    Capacity INT,
    Amenities TEXT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
```
### Rooms
```
CREATE TABLE Rooms (
    RoomID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    RoomTypeID INT NOT NULL REFERENCES RoomTypes(RoomTypeID),
    RoomNumber VARCHAR(20) NOT NULL UNIQUE,
    Floor INT,
    RoomStatus VARCHAR(20) DEFAULT 'Available', -- Available, Occupied, Maintenance, Cleaning
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
### Reservations
```
CREATE TABLE Reservations (
    ReservationID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    CustomerID INT REFERENCES Customers(CustomerID),
    RoomID INT NOT NULL REFERENCES Rooms(RoomID),
    CheckInDate DATE NOT NULL,
    CheckOutDate DATE NOT NULL,
    NumberOfGuests INT,
    ReservationStatus VARCHAR(20) DEFAULT 'Confirmed', -- Confirmed, CheckedIn, CheckedOut, Cancelled
    SpecialRequests TEXT,
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
### DownPayments
```
CREATE TABLE DownPayments (
    DownPaymentID SERIAL PRIMARY KEY,
    ReservationID INT NOT NULL REFERENCES Reservations(ReservationID) ON DELETE CASCADE,
    Amount DECIMAL(10,2) NOT NULL,
    PaymentMethod VARCHAR(50),
    TransactionID VARCHAR(100),
    PaymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsRefunded BOOLEAN DEFAULT FALSE,
    RefundDate TIMESTAMP,
    RefundReason TEXT
);
```
3. ## Food & Beverage

### MenuCategories
```
CREATE TABLE MenuCategories (
    MenuCategoryID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    ServiceType VARCHAR(20) NOT NULL, -- 'Restaurant' or 'Bar'
    CategoryName VARCHAR(100) NOT NULL,
    CategoryDescription TEXT,
    DisplayOrder INT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
```
### MenuItems
```
CREATE TABLE MenuItems (
    MenuItemID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    MenuCategoryID INT NOT NULL REFERENCES MenuCategories(MenuCategoryID),
    ItemName VARCHAR(200) NOT NULL,
    ItemDescription TEXT,
    Price DECIMAL(10,2) NOT NULL,
    PrepTime INT, -- minutes
    IsAvailable BOOLEAN DEFAULT TRUE,
    IsVegetarian BOOLEAN DEFAULT FALSE,
    Allergens VARCHAR(255),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
```
### Orders
```
CREATE TABLE Orders (
    OrderID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    RoomID INT REFERENCES Rooms(RoomID),
    ServiceType VARCHAR(20) NOT NULL, -- 'Restaurant' or 'Bar'
    OrderStatus VARCHAR(20) DEFAULT 'Pending', -- Pending, Preparing, Ready, Served, Cancelled
    CreatedByEmployeeID INT NOT NULL REFERENCES Employees(EmployeeID),
    CustomerID INT REFERENCES Customers(CustomerID),
    SpecialInstructions TEXT,
    OrderDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CompletionDate TIMESTAMP,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
CREATE INDEX idx_orders_hotel_status ON Orders(HotelID, OrderStatus);
CREATE INDEX idx_orders_date_service ON Orders(OrderDate, ServiceType);
```
### OrderItems
```
CREATE TABLE OrderItems (
    OrderItemID SERIAL PRIMARY KEY,
    OrderID INT NOT NULL REFERENCES Orders(OrderID) ON DELETE CASCADE,
    MenuItemID INT NOT NULL REFERENCES MenuItems(MenuItemID),
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    SpecialInstructions TEXT,
    ItemStatus VARCHAR(20) DEFAULT 'Pending', -- Pending, Preparing, Ready, Served
    ServedTime TIMESTAMP,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
4. ## Inventory Management

### InventoryCategories
```
CREATE TABLE InventoryCategories (
    InventoryCategoryID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    CategoryName VARCHAR(100) NOT NULL,
    CategoryDescription TEXT
);
```
### Suppliers
```
CREATE TABLE Suppliers (
    SupplierID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    SupplierName VARCHAR(200) NOT NULL,
    ContactPerson VARCHAR(100),
    PhoneNumber VARCHAR(20),
    Email VARCHAR(255),
    Address TEXT,
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
### InventoryItems
```
CREATE TABLE InventoryItems (
    InventoryItemID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    InventoryCategoryID INT NOT NULL REFERENCES InventoryCategories(InventoryCategoryID),
    ItemName VARCHAR(200) NOT NULL,
    SKU VARCHAR(100) UNIQUE,
    Barcode VARCHAR(100),
    Description TEXT,
    Unit VARCHAR(20), -- 'Piece', 'Kg', 'Liter', 'Box', etc.
    CurrentStock DECIMAL(10,2) NOT NULL DEFAULT 0,
    ReorderLevel DECIMAL(10,2),
    MaxStock DECIMAL(10,2),
    UnitCost DECIMAL(10,2),
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
CREATE INDEX idx_inventory_sku ON InventoryItems(SKU);
CREATE INDEX idx_inventory_barcode ON InventoryItems(Barcode);
```
### InventoryTransactions
```
CREATE TABLE InventoryTransactions (
    InventoryTransactionID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    InventoryItemID INT NOT NULL REFERENCES InventoryItems(InventoryItemID),
    TransactionType VARCHAR(20) NOT NULL, -- 'In', 'Out', 'Adjustment', 'Wastage'
    Quantity DECIMAL(10,2) NOT NULL,
    Reference VARCHAR(100), -- OrderID, PurchaseOrderID, etc.
    Notes TEXT,
    CreatedByEmployeeID INT NOT NULL REFERENCES Employees(EmployeeID),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_inventory_transactions_date ON InventoryTransactions(CreatedDate);
```
5. ## Billing & Payments

### Invoices
```
CREATE TABLE Invoices (
    InvoiceID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    InvoiceNumber VARCHAR(50) NOT NULL UNIQUE,
    CustomerID INT REFERENCES Customers(CustomerID),
    ReservationID INT REFERENCES Reservations(ReservationID),
    InvoiceDate DATE NOT NULL,
    DueDate DATE,
    SubTotal DECIMAL(15,2),
    TaxAmount DECIMAL(15,2),
    DiscountAmount DECIMAL(15,2) DEFAULT 0,
    ServiceCharge DECIMAL(15,2) DEFAULT 0,
    TotalAmount DECIMAL(15,2),
    PaidAmount DECIMAL(15,2) DEFAULT 0,
    PaymentStatus VARCHAR(20) DEFAULT 'Pending', -- Pending, Partial, Paid, Overdue
    Currency VARCHAR(3) DEFAULT 'USD',
    Notes TEXT,
    CreatedByEmployeeID INT NOT NULL REFERENCES Employees(EmployeeID),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
CREATE INDEX idx_invoices_hotel_status ON Invoices(HotelID, PaymentStatus);
CREATE INDEX idx_invoices_number ON Invoices(InvoiceNumber);
```
### InvoiceLineItems
```
CREATE TABLE InvoiceLineItems (
    InvoiceLineItemID SERIAL PRIMARY KEY,
    InvoiceID INT NOT NULL REFERENCES Invoices(InvoiceID) ON DELETE CASCADE,
    Description VARCHAR(255) NOT NULL,
    Quantity DECIMAL(10,2),
    UnitPrice DECIMAL(10,2) NOT NULL,
    LineTotal DECIMAL(15,2) NOT NULL,
    LineType VARCHAR(20) -- 'Room', 'Food', 'Drink', 'Service', 'Tax', 'Discount'
);
```
### Payments
```
CREATE TABLE Payments (
    PaymentID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    InvoiceID INT NOT NULL REFERENCES Invoices(InvoiceID),
    PaymentDate DATE NOT NULL,
    PaymentMethod VARCHAR(50), -- 'Cash', 'Credit Card', 'Bank Transfer', 'Mobile Money'
    Amount DECIMAL(15,2) NOT NULL,
    Currency VARCHAR(3) DEFAULT 'USD',
    ReferenceNumber VARCHAR(100),
    ReceivedByEmployeeID INT NOT NULL REFERENCES Employees(EmployeeID),
    Notes TEXT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
CREATE INDEX idx_payments_date ON Payments(PaymentDate);
```
6. ## Customer Management

### Customers
```
CREATE TABLE Customers (
    CustomerID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Email VARCHAR(255),
    PhoneNumber VARCHAR(20),
    Country VARCHAR(100),
    City VARCHAR(100),
    Address TEXT,
    DateOfBirth DATE,
    Gender VARCHAR(10),
    PreferredLanguage VARCHAR(50),
    CustomerTier VARCHAR(20) DEFAULT 'Regular', -- VIP, Regular, Occasional
    TotalSpent DECIMAL(15,2) DEFAULT 0,
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
### CustomerPreferences
```
CREATE TABLE CustomerPreferences (
    CustomerPreferenceID SERIAL PRIMARY KEY,
    CustomerID INT NOT NULL REFERENCES Customers(CustomerID) ON DELETE CASCADE,
    PreferenceType VARCHAR(50),
    PreferenceValue VARCHAR(255)
);
```
### LoyaltyPoints
```
CREATE TABLE LoyaltyPoints (
    LoyaltyPointID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    CustomerID INT NOT NULL REFERENCES Customers(CustomerID) ON DELETE CASCADE,
    PointsEarned INT,
    PointsRedeemed INT DEFAULT 0,
    TransactionDate DATE NOT NULL,
    ExpiryDate DATE,
    Source VARCHAR(50), -- 'Purchase', 'Bonus', 'Referral'
    RelatedInvoiceID INT REFERENCES Invoices(InvoiceID),
    Notes TEXT
);
```
7. ## Audit & Compliance

### AuditLogs
```
CREATE TABLE AuditLogs (
    AuditLogID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    TableName VARCHAR(100) NOT NULL,
    RecordID INT,
    ActionType VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    ActionByEmployeeID INT NOT NULL REFERENCES Employees(EmployeeID),
    ActionDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ColumnName VARCHAR(100),
    OldValue TEXT,
    NewValue TEXT,
    ChangeReason TEXT, -- Optional explanation for manual edits
    IPAddress VARCHAR(50),
    ApplicationVersion VARCHAR(20)
);
CREATE INDEX idx_audit_logs_hotel_date ON AuditLogs(HotelID, ActionDate);
CREATE INDEX idx_audit_logs_employee ON AuditLogs(ActionByEmployeeID);
```
8. ## System Configuration

### HotelSettings
```
CREATE TABLE HotelSettings (
    HotelSettingID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    SettingKey VARCHAR(100) NOT NULL,
    SettingValue TEXT,
    SettingType VARCHAR(50), -- 'string', 'int', 'boolean', 'decimal'
    Description TEXT,
    IsSystemSetting BOOLEAN DEFAULT FALSE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP
);
```
### PrinterConfiguration
```
CREATE TABLE PrinterConfiguration (
    PrinterConfigID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    PrinterName VARCHAR(100) NOT NULL,
    PrinterType VARCHAR(20), -- 'Thermal', 'Regular'
    PrinterModel VARCHAR(100),
    NetworkAddress VARCHAR(100),
    Port INT,
    IsDefault BOOLEAN DEFAULT FALSE,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP
);
```
### LanguageSettings
```
CREATE TABLE LanguageSettings (
    LanguageSettingID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    LanguageCode VARCHAR(10) NOT NULL,
    LanguageName VARCHAR(50),
    IsDefault BOOLEAN DEFAULT FALSE,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
9. ## Indexes Summary
```
-- Already listed per table. Additional composite indexes for performance:
CREATE INDEX idx_invoices_customer_paid ON Invoices(CustomerID, PaymentStatus);
CREATE INDEX idx_orders_customer_status ON Orders(CustomerID, OrderStatus);
CREATE INDEX idx_inventory_items_lowstock ON InventoryItems(HotelID, CurrentStock) WHERE CurrentStock <= ReorderLevel;