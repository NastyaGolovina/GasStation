<?php
global $connection;
session_start();
header('Content-Type: application/json');
include('DBConnection.php');

$action = isset($_GET['action']) ? $_GET['action'] : '';
$serviceSchedule_id = isset($_GET['serviceSchedule_id']) ? $_GET['serviceSchedule_id'] : null;

function safeInput($conn, $value) {
    return mysqli_real_escape_string($conn, trim($value));
}

if (!$connection) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === '') {
    $query = "SELECT * FROM ScheduleService";
    $result = mysqli_query($connection, $query);

    if ($result) {
        $scheduleService = [];
        while ($row = $result->fetch_assoc()) {
            $scheduleService[] = $row;
        }
        echo json_encode(['ScheduleServiceTable' => $scheduleService]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch schedule data']);
    }
    exit;
}

if ($action !== 'update') {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid action, only update is allowed']);
    exit;
}

$employee_service = isset($_POST["employee_service"]) ? safeInput($connection, $_POST["employee_service"]) : '';
$material = isset($_POST["material"]) ? safeInput($connection, $_POST["material"]) : '';

if ($employee_service === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Employee service is required']);
    exit;
}

if ($material === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Material is required']);
    exit;
}

if (!$serviceSchedule_id) {
    http_response_code(400);
    echo json_encode(['error' => 'ServiceSchedule ID is required for update']);
    exit;
}

// Check if record exists
$resultCheck = $connection->query("SELECT * FROM ScheduleService WHERE ServiceScheduleID = '$serviceSchedule_id'");
if (!$resultCheck || $resultCheck->num_rows === 0) {
    echo json_encode(['error' => 'No record found with the provided ID']);
    exit;
}

$query = "UPDATE ScheduleService SET EmployeeService = '$employee_service', Material = '$material' WHERE ServiceScheduleID = '$serviceSchedule_id'";

if ($connection->query($query)) {
    if ($connection->affected_rows > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'No rows updated. Maybe data is unchanged or ID does not exist.']);
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update service']);
}
?>
