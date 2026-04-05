CREATE TABLE Suppliers (
    SupplierID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    SupplierName VARCHAR(200) NOT NULL,
    ContactPerson VARCHAR(100),
    PhoneNumber VARCHAR(20),
    Email VARCHAR(255),
    Address TEXT,
    City VARCHAR(100),
    Country VARCHAR(100),
    PaymentTerms VARCHAR(100),
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);