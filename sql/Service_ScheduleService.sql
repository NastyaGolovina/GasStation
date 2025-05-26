CREATE TABLE service (
   ServiceID INT PRIMARY KEY AUTO_INCREMENT,
   Name VARCHAR(100),
   Description VARCHAR(255),
   Status BOOLEAN
);

CREATE TABLE ScheduleService (
  ServiceScheduleID INT PRIMARY KEY AUTO_INCREMENT,
  ServiceID INT,
  Date DATE,
  Service VARCHAR(255),
  Description VARCHAR(255),
  CustomerID INT,
  Status VARCHAR(100),
  EmployeeService VARCHAR(100),
  Material VARCHAR(100),
  FOREIGN KEY (ServiceID) REFERENCES service(ServiceID),
  FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);


INSERT INTO service (Name, Description, Status)
VALUES (
        'Fuel Refill',
        'Standard fuel refilling service for vehicles.',
        TRUE
       );


INSERT INTO ScheduleService (
    ServiceID,
    Date,
    Service,
    Description,
    CustomerID,
    Status,
    EmployeeService,
    Material
)
VALUES (
        1,
        '2025-05-06',
        'Fuel Refill',
        'Standard fuel refilling service for vehicles.',
        1,
        'Scheduled',
        'John Doe',
        'Fuel'
       );

ALTER TABLE service
    ADD COLUMN Duration VARCHAR(10),
ADD COLUMN Priority ENUM('Low', 'Medium', 'High');

ALTER TABLE ScheduleService
DROP COLUMN Service;

ALTER TABLE ScheduleService
    MODIFY COLUMN EmployeeService INT;

DELETE FROM ScheduleService
WHERE EmployeeService = 0;

ALTER TABLE ScheduleService
    ADD CONSTRAINT fk_EmployeeService FOREIGN KEY (EmployeeService) REFERENCES User(UserID);
