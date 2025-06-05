<?php
include ('DBConnection.php');
header('Content-Type: application/json');
$product = [];
$consultation = "SELECT 
                    ProductID AS productInforID,
                    Name AS productName,
                    Price AS price, 
                    Stock AS stock,
                    Description AS description,
                    Type AS type,
                    ExpirationDate AS expirationDate,
                    MinStock AS minStock
                 FROM Product";

if (!empty($connection)) {
    $result = mysqli_query($connection, $consultation);
    $product = [];

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $product[] = $row;
        }
    } else{
        $product[] = [];
    }
}
$tablesToJson['productInforTable'] = $product;
echo json_encode($tablesToJson);
