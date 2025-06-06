<?php
global $connection;
include('DBConnection.php');
session_start();

header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$user_id = isset($_SESSION['UserID']) ? (int)$_SESSION['UserID'] : 0;

if (!$connection) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$query = "
   SELECT 
    ss.*,
    s.Name AS ServiceName,
    u.Name AS EmployeeServiceName,
    cu.Name AS CustomerName
FROM ScheduleService ss
LEFT JOIN service s ON ss.ServiceID = s.ServiceID
LEFT JOIN User u ON ss.EmployeeService = u.UserID
LEFT JOIN Customer c ON ss.CustomerID = c.CustomerID
LEFT JOIN User cu ON c.UserID = cu.UserID
WHERE ss.CustomerID = (SELECT CustomerID FROM Customer WHERE UserID = $user_id)
";

$result = mysqli_query($connection, $query);

if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed: ' . mysqli_error($connection)]);
    exit;
}

$scheduleService = [];
while ($row = mysqli_fetch_assoc($result)) {
    $scheduleService[] = $row;
}

echo json_encode(['ScheduleServiceTable' => $scheduleService]);
exit;
