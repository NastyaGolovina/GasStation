<?php
global $connection;
include('DBConnection.php');
header('Content-Type: application/json');

$query = "
    SELECT 
        ss.*,
        s.Name as ServiceName,
        u.Name as EmployeeServiceName,
        c.Name as CustomerName, 
        ss.CustomerID
    FROM ScheduleService ss
    LEFT JOIN service s ON ss.ServiceID = s.ServiceID
    LEFT JOIN User u ON ss.EmployeeService = u.UserID
    LEFT JOIN User c ON ss.CustomerID = c.UserID
";

$result = mysqli_query($connection, $query);

$scheduleService = [];
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $scheduleService[] = $row;
    }
    echo json_encode(['ScheduleServiceTable' => $scheduleService]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed: ' . mysqli_error($connection)]);
}
exit;
?>
