<?php
global $connection;
session_start();
header('Content-Type: application/json');
include('DBConnection.php'); // Should set $connection

$action = $_GET['action'] ?? '';
$serviceSchedule_id = $_GET['serviceSchedule_id'] ?? null;

function safeInput($conn, $value) {
    return mysqli_real_escape_string($conn, trim($value));
}

// 1. Connection check
if (!$connection) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// 2. Handle GET (if action is blank)
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

// 3. Handle update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'update') {
    $employee_service = safeInput($connection, $_POST['employee_service'] ?? '');
    $material = safeInput($connection, $_POST['material'] ?? '');

    if (!$employee_service || !$material || !$serviceSchedule_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }

    // Optional: check if record exists (nice to have)
    $check = $connection->prepare("SELECT 1 FROM ScheduleService WHERE ServiceScheduleID = ?");
    $check->bind_param("i", $serviceSchedule_id);
    $check->execute();
    $checkResult = $check->get_result();

    if ($checkResult->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Record not found']);
        exit;
    }

    // Update using prepared statement
    $stmt = $connection->prepare("UPDATE ScheduleService SET EmployeeService = ?, Material = ? WHERE ServiceScheduleID = ?");
    $stmt->bind_param("ssi", $employee_service, $material, $serviceSchedule_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update service']);
    }

    exit;
}

// 4. Fallback for invalid actions
http_response_code(400);
echo json_encode(['error' => 'Invalid request or unsupported action']);
exit;
?>
