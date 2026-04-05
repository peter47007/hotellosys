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