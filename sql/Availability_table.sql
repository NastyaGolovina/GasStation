-- availability

CREATE TABLE availability (
  AvalailabilityID int PRIMARY KEY AUTO_INCREMENT,
  SDate date,
  EDate date,
  STime time,
  ETime time,
  Reason varchar(255),
  IsAvailable tinyint(1),
  UserID int,
  DaysOfWeek varchar(255),
  FOREIGN KEY (UserID) REFERENCES useravailability (UserID)
) 