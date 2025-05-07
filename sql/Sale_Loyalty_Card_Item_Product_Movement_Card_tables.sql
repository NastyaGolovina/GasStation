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
    TotalAmount float,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);


CREATE TABLE Product (
    ProductID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100),
    Price float,
    Stock INT,
    Description TEXT,
    Type VARCHAR(100),
    MinStock float,
    ExpirationDate DATE
);


CREATE TABLE Item (
    ItemID INT PRIMARY KEY AUTO_INCREMENT,
    SaleID INT,
    ProductID INT,
    Price float,
    Qty INT,
    FOREIGN KEY (SaleID) REFERENCES Sale(SaleID),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
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




INSERT INTO Loyalty_Card (Points, CustomerID) VALUES (1000, 1);


INSERT INTO Product (Name, Price, Stock, Description, Type, ExpirationDate, MinStock) VALUES
('Chocolate Bar', 2.50, 100, 'Milk chocolate bar', 'PRODUCT_STORE', '2025-12-01', null),
('Ground Coffee', 5.00, 50, '250g pack of ground coffee', 'PRODUCT_STORE', '2026-01-15', null),
('Oat Cookies', 3.00, 200, 'Pack of oatmeal cookies', 'PRODUCT_STORE', '2025-09-30', null);


INSERT INTO Sale (Date, CustomerID, TotalAmount) VALUES
('2025-05-01', 1, 10.50);


INSERT INTO Sale (Date, CustomerID, TotalAmount) VALUES
('2025-05-01', 1, 0);



INSERT INTO Item (SaleID, ProductID, Price, Qty) VALUES
(1, 1, 2.50, 2),  
(1, 2, 5.50, 1);  


INSERT INTO Movement_Card (Date, PointsQnt, CustomerID, LoyaltyCardID, PrizeProductID, LoyaltyProgramID, SaleID) VALUES
('2025-05-02', -50, 1, 1, 3, 1, 1);  

