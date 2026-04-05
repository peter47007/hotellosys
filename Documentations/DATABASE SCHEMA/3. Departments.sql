CREATE TABLE Departments (
    DepartmentID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    DepartmentName VARCHAR(100) NOT NULL,
    DepartmentDescription VARCHAR(500),
    ManagerID INT REFERENCES Employees(EmployeeID),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);