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