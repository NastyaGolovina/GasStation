<?php
global $connection;
include('DBConnection.php');
header('Content-Type: application/json');

$query = "
    SELECT u.UserID, u.Name
    FROM User u
    WHERE u.PermissionID = 'CUSTOMER'
";

$result = mysqli_query($connection, $query);

$customers = [];
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $customers[] = $row;
    }
}

echo json_encode(['customers' => $customers]);
