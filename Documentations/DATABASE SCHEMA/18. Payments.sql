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