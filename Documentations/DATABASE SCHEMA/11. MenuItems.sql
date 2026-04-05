CREATE TABLE MenuItems (
    MenuItemID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    MenuCategoryID INT NOT NULL REFERENCES MenuCategories(MenuCategoryID),
    ItemName VARCHAR(200) NOT NULL,
    ItemDescription TEXT,
    Price DECIMAL(10,2) NOT NULL,
    PrepTime INT, -- minutes
    IsAvailable BOOLEAN DEFAULT TRUE,
    IsVegetarian BOOLEAN DEFAULT FALSE,
    Allergens VARCHAR(255),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);