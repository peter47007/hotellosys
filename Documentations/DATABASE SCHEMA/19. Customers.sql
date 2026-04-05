CREATE TABLE Customers (
    CustomerID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Email VARCHAR(255),
    PhoneNumber VARCHAR(20),
    Country VARCHAR(100),
    City VARCHAR(100),
    Address TEXT,
    DateOfBirth DATE,
    Gender VARCHAR(10),
    PreferredLanguage VARCHAR(50),
    CustomerTier VARCHAR(20) DEFAULT 'Regular', -- VIP, Regular, Occasional
    TotalSpent DECIMAL(15,2) DEFAULT 0,
    LoyaltyPoints INT DEFAULT 0,
    LastVisitDate DATE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
CREATE INDEX idx_customers_hotel ON Customers(HotelID);
CREATE INDEX idx_customers_email ON Customers(Email);

CREATE TABLE CustomerPreferences (
    CustomerPreferenceID SERIAL PRIMARY KEY,
    CustomerID INT NOT NULL REFERENCES Customers(CustomerID) ON DELETE CASCADE,
    PreferenceType VARCHAR(50),
    PreferenceValue VARCHAR(255)
);