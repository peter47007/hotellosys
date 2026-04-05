CREATE TABLE Hotels (
    HotelID SERIAL PRIMARY KEY,
    HotelName VARCHAR(255) NOT NULL UNIQUE,
    Address TEXT,
    City VARCHAR(100),
    Country VARCHAR(100),
    PostalCode VARCHAR(20),
    PhoneNumber VARCHAR(20),
    Email VARCHAR(255),
    Website VARCHAR(255),
    RegistrationNumber VARCHAR(100),
    TaxID VARCHAR(50),
    SubscriptionType VARCHAR(50), -- 'Basic', 'Premium'
    SubscriptionStartDate DATE,
    SubscriptionEndDate DATE,
    DefaultCurrency VARCHAR(3) DEFAULT 'USD',
    DefaultLanguage VARCHAR(10) DEFAULT 'en',
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);