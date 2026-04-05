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