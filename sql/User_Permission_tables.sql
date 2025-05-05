CREATE TABLE Permission (
    PermissionID VARCHAR(50)  PRIMARY KEY, 
    Description VARCHAR(255)
);

CREATE TABLE User (
    UserID INT PRIMARY KEY AUTO_INCREMENT, 
    Name VARCHAR(100),
    Address VARCHAR(255),
	NIF VARCHAR(10),
	Email VARCHAR(100),
	Login VARCHAR(30),
	Password VARCHAR(30),
	Status bool,
	PermissionID VARCHAR(50),
    FOREIGN KEY (PermissionID) REFERENCES Permission(PermissionID)
);

CREATE TABLE LoyaltyProgram (
    LoyaltyProgramID INT PRIMARY KEY AUTO_INCREMENT, 
    Name VARCHAR(100)
);

ALTER TABLE LoyaltyProgram
    ADD Description TEXT;

ALTER TABLE LoyaltyProgram
    MODIFY Description VARCHAR(255);


CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY AUTO_INCREMENT, 
    UserID INT, 
    LoyaltyProgramID INT,
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (LoyaltyProgramID) REFERENCES LoyaltyProgram(LoyaltyProgramID)
);

INSERT INTO Permission (PermissionID, Description)
VALUES ('CUSTOMER', 'CUSTOMER'),
		('ADMINISTRATOR', 'ADMINISTRATOR'),
        ('EMPLOYEE_SERVICES','EMPLOYEE_SERVICES'),
        ('OPERATOR','OPERATOR'),
        ('STATION_MANAGER','STATION_MANAGER'),
        ('EMPLOYEE_ADMIN', 'EMPLOYEE_ADMIN');
        
INSERT INTO User (Name, Address , NIF,Email,Login,Password,Status,PermissionID)
VALUES ('Gandalf the Grey', '123 Middle-Earth Lane, Shire, ME 00001','123456789','gandalf.grey@istari.org', 'gandalf_grey',
'YouShallNotPass!123', true , 'ADMINISTRATOR');

INSERT INTO LoyaltyProgram (Name)
VALUES ('Member Program');

UPDATE LoyaltyProgram
SET Description = 'This is a basic loyalty program for members.'
WHERE Name = 'Member Program';



        
        