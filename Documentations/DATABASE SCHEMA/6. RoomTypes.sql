CREATE TABLE RoomTypes (
    RoomTypeID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    TypeName VARCHAR(100) NOT NULL,
    TypeDescription TEXT,
    BasePrice DECIMAL(10,2) NOT NULL,
    Capacity INT,
    Amenities TEXT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);