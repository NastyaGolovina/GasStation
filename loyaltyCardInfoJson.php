<?php
include('DBConnection.php');
header('Content-Type: application/json');

$loyaltyCards = [];

$consultation = "SELECT 
    LoyaltyCardID AS loyaltyCardId,
    CustomerID AS customerId,
    Points AS point
FROM Loyalty_Card
";

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

$tablesToJson['loyaltyCardTable'] = $loyaltyCards;
echo json_encode($tablesToJson);

