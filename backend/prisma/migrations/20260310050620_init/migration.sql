-- CreateTable
CREATE TABLE "Hotels" (
    "hotelId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelName" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "website" TEXT,
    "registrationNumber" TEXT,
    "taxId" TEXT,
    "subscriptionType" TEXT,
    "subscriptionStartDate" DATETIME,
    "subscriptionEndDate" DATETIME,
    "defaultCurrency" TEXT DEFAULT 'USD',
    "defaultLanguage" TEXT DEFAULT 'en',
    "isActive" BOOLEAN DEFAULT true,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "modifiedDate" DATETIME,
    "modifiedBy" INTEGER
);

-- CreateTable
CREATE TABLE "Employees" (
    "employeeId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "departmentId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "title" TEXT,
    "gender" TEXT,
    "dateOfBirth" DATETIME,
    "nationalIdNumber" TEXT,
    "joinDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "photoPath" TEXT,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "lastLoginDate" DATETIME,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "modifiedDate" DATETIME,
    "modifiedBy" INTEGER,
    CONSTRAINT "Employees_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Departments" ("departmentId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Employees_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles" ("roleId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Departments" (
    "departmentId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "departmentName" TEXT NOT NULL,
    "departmentDescription" TEXT,
    "managerId" INTEGER,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "modifiedDate" DATETIME,
    "modifiedBy" INTEGER,
    CONSTRAINT "Departments_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Departments_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Employees" ("employeeId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Roles" (
    "roleId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "roleName" TEXT NOT NULL,
    "roleDescription" TEXT,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "modifiedDate" DATETIME,
    "modifiedBy" INTEGER,
    CONSTRAINT "Roles_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RolePermissions" (
    "rolePermissionId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roleId" INTEGER NOT NULL,
    "permissionCode" TEXT NOT NULL,
    "permissionName" TEXT,
    "canCreate" BOOLEAN DEFAULT false,
    "canRead" BOOLEAN DEFAULT false,
    "canUpdate" BOOLEAN DEFAULT false,
    "canDelete" BOOLEAN DEFAULT false,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RolePermissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles" ("roleId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RoomTypes" (
    "roomTypeId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "typeName" TEXT NOT NULL,
    "typeDescription" TEXT,
    "basePrice" DECIMAL NOT NULL,
    "capacity" INTEGER,
    "amenities" TEXT,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "modifiedDate" DATETIME,
    "modifiedBy" INTEGER,
    CONSTRAINT "RoomTypes_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rooms" (
    "roomId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "roomTypeId" INTEGER NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "floor" INTEGER,
    "roomStatus" TEXT DEFAULT 'Available',
    "lastMaintenanceDate" DATETIME,
    "nextMaintenanceDate" DATETIME,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "modifiedDate" DATETIME,
    "modifiedBy" INTEGER,
    CONSTRAINT "Rooms_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Rooms_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomTypes" ("roomTypeId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reservations" (
    "reservationId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "customerId" INTEGER,
    "roomId" INTEGER NOT NULL,
    "checkInDate" DATETIME NOT NULL,
    "checkOutDate" DATETIME NOT NULL,
    "numberOfGuests" INTEGER,
    "reservationStatus" TEXT DEFAULT 'Confirmed',
    "specialRequests" TEXT,
    "bookingDate" DATETIME NOT NULL,
    "bookedByEmployeeId" INTEGER,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "modifiedDate" DATETIME,
    "modifiedBy" INTEGER,
    CONSTRAINT "Reservations_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reservations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("customerId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Reservations_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms" ("roomId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservations_bookedByEmployeeId_fkey" FOREIGN KEY ("bookedByEmployeeId") REFERENCES "Employees" ("employeeId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DownPayments" (
    "downPaymentId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reservationId" INTEGER NOT NULL,
    "amount" DECIMAL NOT NULL,
    "paymentMethod" TEXT,
    "transactionId" TEXT,
    "paymentDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "isRefunded" BOOLEAN DEFAULT false,
    "refundDate" DATETIME,
    "refundReason" TEXT,
    CONSTRAINT "DownPayments_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservations" ("reservationId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MenuCategories" (
    "menuCategoryId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "serviceType" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "categoryDescription" TEXT,
    "displayOrder" INTEGER,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "modifiedDate" DATETIME,
    "modifiedBy" INTEGER,
    CONSTRAINT "MenuCategories_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MenuItems" (
    "menuItemId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "menuCategoryId" INTEGER NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemDescription" TEXT,
    "price" DECIMAL NOT NULL,
    "prepTime" INTEGER,
    "isAvailable" BOOLEAN DEFAULT true,
    "isVegetarian" BOOLEAN DEFAULT false,
    "allergens" TEXT,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "modifiedDate" DATETIME,
    "modifiedBy" INTEGER,
    CONSTRAINT "MenuItems_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MenuItems_menuCategoryId_fkey" FOREIGN KEY ("menuCategoryId") REFERENCES "MenuCategories" ("menuCategoryId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Orders" (
    "orderId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "roomId" INTEGER,
    "serviceType" TEXT NOT NULL,
    "orderStatus" TEXT DEFAULT 'Pending',
    "createdByEmployeeId" INTEGER NOT NULL,
    "customerId" INTEGER,
    "specialInstructions" TEXT,
    "orderDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completionDate" DATETIME,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "modifiedDate" DATETIME,
    "modifiedBy" INTEGER,
    CONSTRAINT "Orders_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Orders_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms" ("roomId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Orders_createdByEmployeeId_fkey" FOREIGN KEY ("createdByEmployeeId") REFERENCES "Employees" ("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("customerId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderItems" (
    "orderItemId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "menuItemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL NOT NULL,
    "specialInstructions" TEXT,
    "itemStatus" TEXT DEFAULT 'Pending',
    "servedTime" DATETIME,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders" ("orderId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItems_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItems" ("menuItemId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InventoryCategories" (
    "inventoryCategoryId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "categoryName" TEXT NOT NULL,
    "categoryDescription" TEXT,
    CONSTRAINT "InventoryCategories_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Suppliers" (
    "supplierId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "supplierName" TEXT NOT NULL,
    "contactPerson" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "paymentTerms" TEXT,
    "isActive" BOOLEAN DEFAULT true,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "modifiedDate" DATETIME,
    "modifiedBy" INTEGER,
    CONSTRAINT "Suppliers_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InventoryItems" (
    "inventoryItemId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "inventoryCategoryId" INTEGER NOT NULL,
    "itemName" TEXT NOT NULL,
    "sku" TEXT,
    "barcode" TEXT,
    "description" TEXT,
    "unit" TEXT,
    "currentStock" DECIMAL NOT NULL DEFAULT 0,
    "reorderLevel" DECIMAL,
    "maxStock" DECIMAL,
    "unitCost" DECIMAL,
    "supplierId" INTEGER,
    "expiryDate" DATETIME,
    "storageLocation" TEXT,
    "isBarcodeEnabled" BOOLEAN DEFAULT false,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "modifiedDate" DATETIME,
    "modifiedBy" INTEGER,
    CONSTRAINT "InventoryItems_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InventoryItems_inventoryCategoryId_fkey" FOREIGN KEY ("inventoryCategoryId") REFERENCES "InventoryCategories" ("inventoryCategoryId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InventoryItems_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Suppliers" ("supplierId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InventoryTransactions" (
    "inventoryTransactionId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "inventoryItemId" INTEGER NOT NULL,
    "transactionType" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "reference" TEXT,
    "notes" TEXT,
    "createdByEmployeeId" INTEGER NOT NULL,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InventoryTransactions_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InventoryTransactions_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItems" ("inventoryItemId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InventoryTransactions_createdByEmployeeId_fkey" FOREIGN KEY ("createdByEmployeeId") REFERENCES "Employees" ("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Invoices" (
    "invoiceId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "customerId" INTEGER,
    "reservationId" INTEGER,
    "invoiceDate" DATETIME NOT NULL,
    "dueDate" DATETIME,
    "subTotal" DECIMAL,
    "taxAmount" DECIMAL,
    "discountAmount" DECIMAL DEFAULT 0,
    "serviceCharge" DECIMAL DEFAULT 0,
    "totalAmount" DECIMAL,
    "paidAmount" DECIMAL DEFAULT 0,
    "paymentStatus" TEXT DEFAULT 'Pending',
    "currency" TEXT DEFAULT 'USD',
    "notes" TEXT,
    "createdByEmployeeId" INTEGER NOT NULL,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "modifiedDate" DATETIME,
    "modifiedBy" INTEGER,
    CONSTRAINT "Invoices_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Invoices_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("customerId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Invoices_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservations" ("reservationId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Invoices_createdByEmployeeId_fkey" FOREIGN KEY ("createdByEmployeeId") REFERENCES "Employees" ("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InvoiceLineItems" (
    "invoiceLineItemId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "invoiceId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL,
    "unitPrice" DECIMAL NOT NULL,
    "lineTotal" DECIMAL NOT NULL,
    "lineType" TEXT,
    CONSTRAINT "InvoiceLineItems_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoices" ("invoiceId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payments" (
    "paymentId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "paymentDate" DATETIME NOT NULL,
    "paymentMethod" TEXT,
    "amount" DECIMAL NOT NULL,
    "currency" TEXT DEFAULT 'USD',
    "referenceNumber" TEXT,
    "receivedByEmployeeId" INTEGER NOT NULL,
    "notes" TEXT,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "modifiedDate" DATETIME,
    "modifiedBy" INTEGER,
    CONSTRAINT "Payments_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoices" ("invoiceId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payments_receivedByEmployeeId_fkey" FOREIGN KEY ("receivedByEmployeeId") REFERENCES "Employees" ("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Customers" (
    "customerId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "country" TEXT,
    "city" TEXT,
    "address" TEXT,
    "dateOfBirth" DATETIME,
    "gender" TEXT,
    "preferredLanguage" TEXT,
    "customerTier" TEXT DEFAULT 'Regular',
    "totalSpent" DECIMAL DEFAULT 0,
    "loyaltyPoints" INTEGER DEFAULT 0,
    "lastVisitDate" DATETIME,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "modifiedDate" DATETIME,
    "modifiedBy" INTEGER,
    CONSTRAINT "Customers_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomerPreferences" (
    "customerPreferenceId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" INTEGER NOT NULL,
    "preferenceType" TEXT,
    "preferenceValue" TEXT,
    CONSTRAINT "CustomerPreferences_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("customerId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LoyaltyPoints" (
    "loyaltyPointId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "pointsEarned" INTEGER,
    "pointsRedeemed" INTEGER DEFAULT 0,
    "transactionDate" DATETIME NOT NULL,
    "expiryDate" DATETIME,
    "source" TEXT,
    "relatedInvoiceId" INTEGER,
    "notes" TEXT,
    CONSTRAINT "LoyaltyPoints_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LoyaltyPoints_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("customerId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LoyaltyPoints_relatedInvoiceId_fkey" FOREIGN KEY ("relatedInvoiceId") REFERENCES "Invoices" ("invoiceId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLogs" (
    "auditLogId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "tableName" TEXT NOT NULL,
    "recordId" INTEGER,
    "actionType" TEXT NOT NULL,
    "actionByEmployeeId" INTEGER NOT NULL,
    "actionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "columnName" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "changeReason" TEXT,
    "ipAddress" TEXT,
    "applicationVersion" TEXT,
    CONSTRAINT "AuditLogs_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AuditLogs_actionByEmployeeId_fkey" FOREIGN KEY ("actionByEmployeeId") REFERENCES "Employees" ("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HotelSettings" (
    "hotelSettingId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "settingKey" TEXT NOT NULL,
    "settingValue" TEXT,
    "settingType" TEXT,
    "description" TEXT,
    "isSystemSetting" BOOLEAN DEFAULT false,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" DATETIME,
    CONSTRAINT "HotelSettings_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PrinterConfiguration" (
    "printerConfigId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "printerName" TEXT NOT NULL,
    "printerType" TEXT,
    "printerModel" TEXT,
    "networkAddress" TEXT,
    "port" INTEGER,
    "isDefault" BOOLEAN DEFAULT false,
    "isActive" BOOLEAN DEFAULT true,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" DATETIME,
    CONSTRAINT "PrinterConfiguration_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LanguageSettings" (
    "languageSettingId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "languageCode" TEXT NOT NULL,
    "languageName" TEXT,
    "isDefault" BOOLEAN DEFAULT false,
    "isActive" BOOLEAN DEFAULT true,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LanguageSettings_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("hotelId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Hotels_hotelName_key" ON "Hotels"("hotelName");

-- CreateIndex
CREATE UNIQUE INDEX "Employees_username_key" ON "Employees"("username");

-- CreateIndex
CREATE INDEX "Employees_hotelId_idx" ON "Employees"("hotelId");

-- CreateIndex
CREATE INDEX "Employees_username_idx" ON "Employees"("username");

-- CreateIndex
CREATE INDEX "Employees_departmentId_idx" ON "Employees"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Rooms_roomNumber_key" ON "Rooms"("roomNumber");

-- CreateIndex
CREATE INDEX "Rooms_hotelId_idx" ON "Rooms"("hotelId");

-- CreateIndex
CREATE INDEX "Rooms_roomStatus_idx" ON "Rooms"("roomStatus");

-- CreateIndex
CREATE INDEX "Reservations_hotelId_checkInDate_checkOutDate_idx" ON "Reservations"("hotelId", "checkInDate", "checkOutDate");

-- CreateIndex
CREATE INDEX "Reservations_customerId_idx" ON "Reservations"("customerId");

-- CreateIndex
CREATE INDEX "Reservations_roomId_idx" ON "Reservations"("roomId");

-- CreateIndex
CREATE INDEX "Orders_hotelId_orderStatus_idx" ON "Orders"("hotelId", "orderStatus");

-- CreateIndex
CREATE INDEX "Orders_orderDate_serviceType_idx" ON "Orders"("orderDate", "serviceType");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItems_sku_key" ON "InventoryItems"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItems_barcode_key" ON "InventoryItems"("barcode");

-- CreateIndex
CREATE INDEX "InventoryItems_hotelId_idx" ON "InventoryItems"("hotelId");

-- CreateIndex
CREATE INDEX "InventoryItems_sku_idx" ON "InventoryItems"("sku");

-- CreateIndex
CREATE INDEX "InventoryItems_barcode_idx" ON "InventoryItems"("barcode");

-- CreateIndex
CREATE INDEX "InventoryItems_hotelId_currentStock_idx" ON "InventoryItems"("hotelId", "currentStock");

-- CreateIndex
CREATE INDEX "InventoryTransactions_createdDate_idx" ON "InventoryTransactions"("createdDate");

-- CreateIndex
CREATE UNIQUE INDEX "Invoices_invoiceNumber_key" ON "Invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Invoices_hotelId_paymentStatus_idx" ON "Invoices"("hotelId", "paymentStatus");

-- CreateIndex
CREATE INDEX "Invoices_invoiceNumber_idx" ON "Invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Invoices_customerId_paymentStatus_idx" ON "Invoices"("customerId", "paymentStatus");

-- CreateIndex
CREATE INDEX "Payments_paymentDate_idx" ON "Payments"("paymentDate");

-- CreateIndex
CREATE INDEX "Customers_hotelId_idx" ON "Customers"("hotelId");

-- CreateIndex
CREATE INDEX "Customers_email_idx" ON "Customers"("email");

-- CreateIndex
CREATE INDEX "AuditLogs_hotelId_actionDate_idx" ON "AuditLogs"("hotelId", "actionDate");

-- CreateIndex
CREATE INDEX "AuditLogs_actionByEmployeeId_idx" ON "AuditLogs"("actionByEmployeeId");
