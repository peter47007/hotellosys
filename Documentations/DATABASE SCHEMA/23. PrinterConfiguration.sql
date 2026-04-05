CREATE TABLE PrinterConfiguration (
    PrinterConfigID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    PrinterName VARCHAR(100) NOT NULL,
    PrinterType VARCHAR(20), -- 'Thermal', 'Regular'
    PrinterModel VARCHAR(100),
    NetworkAddress VARCHAR(100),
    Port INT,
    IsDefault BOOLEAN DEFAULT FALSE,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP
);