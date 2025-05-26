<?php
global $connection;
include('DBConnection.php');
header('Content-Type: application/json');

$query = "
    SELECT u.UserID, u.Name
    FROM User u
    WHERE u.PermissionID = 'EMPLOYEE_SERVICES'
";

$result = mysqli_query($connection, $query);

$employees = [];
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $employees[] = $row;
    }
}

echo json_encode(['employees' => $employees]);
