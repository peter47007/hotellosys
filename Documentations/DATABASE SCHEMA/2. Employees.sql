CREATE TABLE Employees (
    EmployeeID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Email VARCHAR(255),
    PhoneNumber VARCHAR(20),
    DepartmentID INT NOT NULL REFERENCES Departments(DepartmentID),
    RoleID INT NOT NULL REFERENCES Roles(RoleID),
    Title VARCHAR(100),
    Gender VARCHAR(10),
    DateOfBirth DATE,
    NationalIDNumber VARCHAR(50),
    JoinDate DATE NOT NULL,
    EndDate DATE,
    PhotoPath VARCHAR(500),
    Username VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    IsActive BOOLEAN DEFAULT TRUE,
    LastLoginDate TIMESTAMP,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    ModifiedDate TIMESTAMP,
    ModifiedBy INT
);
CREATE INDEX idx_employees_hotel ON Employees(HotelID);
CREATE INDEX idx_employees_username ON Employees(Username);
CREATE INDEX idx_employees_department ON Employees(DepartmentID);