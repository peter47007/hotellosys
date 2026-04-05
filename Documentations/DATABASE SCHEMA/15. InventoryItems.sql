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