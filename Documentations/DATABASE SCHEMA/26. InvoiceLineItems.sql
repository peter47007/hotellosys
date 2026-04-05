CREATE TABLE InvoiceLineItems (
    InvoiceLineItemID SERIAL PRIMARY KEY,
    InvoiceID INT NOT NULL REFERENCES Invoices(InvoiceID) ON DELETE CASCADE,
    Description VARCHAR(255) NOT NULL,
    Quantity DECIMAL(10,2),
    UnitPrice DECIMAL(10,2) NOT NULL,
    LineTotal DECIMAL(15,2) NOT NULL,
    LineType VARCHAR(20) -- 'Room', 'Food', 'Drink', 'Service', 'Tax', 'Discount'
);