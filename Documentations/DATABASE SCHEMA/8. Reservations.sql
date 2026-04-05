CREATE TABLE Reservations (
    ReservationID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    CustomerID INT REFERENCES Customers(CustomerID),
    RoomID INT NOT NULL REFERENCES Rooms(RoomID),
    CheckInDate DATE NOT NULL,
    CheckOutDate DATE NOT NULL,
    NumberOfGuests INT,
    ReservationStatus VARCHAR(20) DEFAULT 'Confirmed', -- Confirmed, CheckedIn, CheckedOut, Cancelled
    SpecialRequests TEXT,
    BookingDate DATE NOT NULL,
    BookedByEmployeeID INT REFERENCES Employees(EmployeeID),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
CREATE INDEX idx_reservations_hotel_dates ON Reservations(HotelID, CheckInDate, CheckOutDate);
CREATE INDEX idx_reservations_customer ON Reservations(CustomerID);
CREATE INDEX idx_reservations_room ON Reservations(RoomID);