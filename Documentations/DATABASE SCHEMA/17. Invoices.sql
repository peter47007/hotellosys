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

CREATE TABLE InvoiceLineItems (
    InvoiceLineItemID SERIAL PRIMARY KEY,
    InvoiceID INT NOT NULL REFERENCES Invoices(InvoiceID) ON DELETE CASCADE,
    Description VARCHAR(255) NOT NULL,
    Quantity DECIMAL(10,2),
    UnitPrice DECIMAL(10,2) NOT NULL,
    LineTotal DECIMAL(15,2) NOT NULL,
    LineType VARCHAR(20) -- 'Room', 'Food', 'Drink', 'Service', 'Tax', 'Discount'
);