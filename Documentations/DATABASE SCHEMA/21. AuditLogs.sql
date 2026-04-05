CREATE TABLE AuditLogs (
    AuditLogID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL REFERENCES Hotels(HotelID) ON DELETE CASCADE,
    TableName VARCHAR(100) NOT NULL,
    RecordID INT,
    ActionType VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    ActionByEmployeeID INT NOT NULL REFERENCES Employees(EmployeeID),
    ActionDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ColumnName VARCHAR(100),
    OldValue TEXT,
    NewValue TEXT,
    ChangeReason TEXT, -- Optional explanation for manual edits
    IPAddress VARCHAR(50),
    ApplicationVersion VARCHAR(20)
);
CREATE INDEX idx_audit_logs_hotel_date ON AuditLogs(HotelID, ActionDate);
CREATE INDEX idx_audit_logs_employee ON AuditLogs(ActionByEmployeeID);