<?php
     include ('DBConnection.php');
header('Content-Type: application/json');
$product = [];
$consultation = "SELECT 
                    ProductID AS productInforID,
                    Name AS ProductName,
                    Price,
                    Stock,
                    Description,
                    Type,
                    ExpirationDate,
                    MinStock
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
