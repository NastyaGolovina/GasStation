-- availability

CREATE TABLE Availability (
	AvalailabilityID INT PRIMARY KEY AUTO_INCREMENT, 
    SDate VARCHAR(255),
    EDate VARCHAR(255),
	Hours VARCHAR(255),
	Reason VARCHAR(255),
    IsAvailable boolean,
	UserID Int,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);