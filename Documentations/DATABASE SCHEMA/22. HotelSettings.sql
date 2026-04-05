CREATE TABLE HotelSettings (
    HotelSettingID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    SettingKey VARCHAR(100) NOT NULL,
    SettingValue TEXT,
    SettingType VARCHAR(50), -- 'string', 'int', 'boolean', 'decimal'
    Description TEXT,
    IsSystemSetting BOOLEAN DEFAULT FALSE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP
);