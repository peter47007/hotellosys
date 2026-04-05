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