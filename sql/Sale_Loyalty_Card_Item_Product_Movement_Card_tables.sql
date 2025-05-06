CREATE TABLE Loyalty_Card (
    LoyaltyCardID INT PRIMARY KEY AUTO_INCREMENT,
    Points INT,
    CustomerID INT,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);

CREATE TABLE Sale (
    SaleID INT PRIMARY KEY AUTO_INCREMENT,
    Date DATE,
    CustomerID INT,
    TotalPrice float,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);

CREATE TABLE Item (
    ItemID INT PRIMARY KEY AUTO_INCREMENT,
    SaleID INT,
    ProductID INT,
    Price float,
    Qty INT,
    FOREIGN KEY (SaleID) REFERENCES Sale(SaleID),
    FOREIGN KEY (ProductID) REFERENCES Product(ID)
);

CREATE TABLE Product (
    ProductID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100),
    Price float,
    Stock INT,
    Description TEXT,
    Type VARCHAR(100)
);

CREATE TABLE Movement_Card (
    MovementCardID INT PRIMARY KEY AUTO_INCREMENT,
    Date DATE,
    PointsQnt INT,
    CustomerID INT,
    LoyaltyCardID INT,
    PrizeProductID INT,
    LoyaltyProgramID INT,
    SaleID INT,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (LoyaltyCardID) REFERENCES Loyalty_Card(LoyaltyCardID),
    FOREIGN KEY (PrizeProductID) REFERENCES Product(ProductID),
    FOREIGN KEY (SaleID) REFERENCES Sale(SaleID)
);
