CREATE TABLE MenuCategories (
    MenuCategoryID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    ServiceType VARCHAR(20) NOT NULL, -- 'Restaurant' or 'Bar'
    CategoryName VARCHAR(100) NOT NULL,
    CategoryDescription TEXT,
    DisplayOrder INT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);