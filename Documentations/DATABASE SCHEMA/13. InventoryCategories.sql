CREATE TABLE InventoryCategories (
    InventoryCategoryID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    CategoryName VARCHAR(100) NOT NULL,
    CategoryDescription TEXT
);