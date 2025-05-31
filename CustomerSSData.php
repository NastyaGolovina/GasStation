<?php
global $connection;
include('DBConnection.php');

header('Content-Type: application/json');

error_reporting(0);

// Check connection
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
        c.Name AS CustomerName
    FROM ScheduleService ss
    LEFT JOIN service s ON ss.ServiceID = s.ServiceID
    LEFT JOIN User u ON ss.EmployeeService = u.UserID
    LEFT JOIN User c ON ss.CustomerID = c.UserID
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

// Return JSON response
echo json_encode(['ScheduleServiceTable' => $scheduleService]);
exit;
