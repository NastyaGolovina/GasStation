<?php
include('DBConnection.php');
header('Content-Type: application/json');

$loyaltyCards = [];
$customers = [];

$consultation = "SELECT 
    lc.LoyaltyCardID AS loyaltyCardId,
    lc.CustomerID AS customerId,
    lc.Points AS point,
    u.Name AS Name
FROM Loyalty_Card lc
INNER JOIN Customer c ON lc.CustomerID = c.CustomerID
INNER JOIN User u ON c.UserID = u.UserID";


if (!empty($connection)) {
    $result = mysqli_query($connection, $consultation);
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $loyaltyCards[] = $row;
        }
    } else {
        $loyaltyCards = [];
    }
}

// Customers (for dropdown)
$consultation = "SELECT c.CustomerID AS CustomerID, u.Name AS Name 
                 FROM Customer c 
                 INNER JOIN User u ON c.UserID = u.UserID";

if (!empty($connection)) {
    $result = mysqli_query($connection, $consultation);

    if ($result && $result->num_rows > 0)
    while ($row = $result->fetch_assoc()) {
        $customers[] = $row;
    }
}

$tablesToJson['loyaltyCardTable'] = $loyaltyCards;
$tablesToJson['Customer'] = $customers;
echo json_encode($tablesToJson);
