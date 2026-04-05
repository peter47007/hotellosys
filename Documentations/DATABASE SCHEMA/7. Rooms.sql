CREATE TABLE Rooms (
    RoomID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    RoomTypeID INT NOT NULL REFERENCES RoomTypes(RoomTypeID),
    RoomNumber VARCHAR(20) NOT NULL UNIQUE,
    Floor INT,
    RoomStatus VARCHAR(20) DEFAULT 'Available', -- Available, Occupied, Maintenance, Cleaning
    LastMaintenanceDate DATE,
    NextMaintenanceDate DATE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
CREATE INDEX idx_rooms_hotel ON Rooms(HotelID);
CREATE INDEX idx_rooms_status ON Rooms(RoomStatus);