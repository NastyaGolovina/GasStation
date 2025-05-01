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
        