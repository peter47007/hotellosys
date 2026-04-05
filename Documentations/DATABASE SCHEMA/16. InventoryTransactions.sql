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