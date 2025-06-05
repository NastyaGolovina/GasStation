<?php
global $connection;
include('DBConnection.php');
session_start();

header('Content-Type: application/json');

$user_id = isset($_SESSION['UserID']) ? (int)$_SESSION['UserID'] : 0;

if (!$connection) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$query = "
    SELECT c.CustomerID, u.Name
    FROM Customer c
    JOIN User u ON c.UserID = u.UserID
    WHERE u.UserID = $user_id AND u.PermissionID = 'CUSTOMER'
";

$result = mysqli_query($connection, $query);

$customers = [];
if ($result && mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $customers[] = $row;
    }
}

echo json_encode(['customers' => $customers]);
exit;
