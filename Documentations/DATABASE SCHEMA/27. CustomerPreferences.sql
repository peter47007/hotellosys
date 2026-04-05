CREATE TABLE CustomerPreferences (
    CustomerPreferenceID SERIAL PRIMARY KEY,
    CustomerID INT NOT NULL REFERENCES Customers(CustomerID) ON DELETE CASCADE,
    PreferenceType VARCHAR(50),
    PreferenceValue VARCHAR(255)
);