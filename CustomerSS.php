<?php
// Start output buffering (optional, only if needed to catch stray output)
ob_start();

header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

// Include DB connection
include('DBConnection.php');

// Check DB connection
if (empty($connection) || !$connection) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';
$serviceSchedule_id = isset($_GET['serviceSchedule_id']) ? $_GET['serviceSchedule_id'] : null;

if (!in_array($action, ['create', 'update', 'delete'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid action']);
    exit;
}

function safeInput($conn, $value) {
    return mysqli_real_escape_string($conn, trim($value));
}

if ($action === 'create' || $action === 'update') {
    $service_id = isset($_POST["service_id"]) ? safeInput($connection, $_POST["service_id"]) : '';
    $date = isset($_POST["date"]) ? safeInput($connection, $_POST["date"]) : '';
    $description = isset($_POST["description"]) ? safeInput($connection, $_POST["description"]) : '';
    $customer_id = isset($_POST["customer_id"]) ? safeInput($connection, $_POST["customer_id"]) : '';
    $status = isset($_POST["status"]) ? safeInput($connection, $_POST["status"]) : '';
    $material = isset($_POST["material"]) ? safeInput($connection, $_POST["material"]) : '';

    // Handle employee_service correctly: convert empty to NULL
    if (isset($_POST["employee_service"]) && $_POST["employee_service"] !== '') {
        $employee_service = safeInput($connection, $_POST["employee_service"]);
        $employee_service_sql = "'$employee_service'";
    } else {
        $employee_service_sql = "NULL";
    }

    // Validate required fields
    if ($service_id === '' || $date === '' || $customer_id === '' || $status === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }

    if ($action === 'create') {
        $query = "INSERT INTO ScheduleService 
                  (ServiceID, Date, Description, CustomerID, Status, EmployeeService, Material)
                  VALUES 
                  ('$service_id', '$date', '$description', '$customer_id', '$status', $employee_service_sql, '$material')";
        if ($connection->query($query)) {
            echo json_encode(['success' => true, 'id' => $connection->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode([
                'error' => 'Failed to create service schedule',
                'sql_error' => $connection->error,
                'query' => $query
            ]);
        }
        exit;
    }

    if ($action === 'update') {
        if (!$serviceSchedule_id) {
            http_response_code(400);
            echo json_encode(['error' => 'ServiceSchedule ID is required for update']);
            exit;
        }
        $serviceSchedule_id = safeInput($connection, $serviceSchedule_id);

        $query = "UPDATE ScheduleService
                  SET ServiceID = '$service_id', Date = '$date', Description = '$description',
                      CustomerID = '$customer_id', Status = '$status',
                      EmployeeService = $employee_service_sql, Material = '$material'
                  WHERE ServiceScheduleID = '$serviceSchedule_id'";
        if ($connection->query($query)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode([
                'error' => 'Failed to update service schedule',
                'sql_error' => $connection->error,
                'query' => $query
            ]);
        }
        exit;
    }
}

if ($action === 'delete') {
    $serviceSchedule_id = isset($_POST['serviceSchedule_id']) ? $_POST['serviceSchedule_id'] : null;

    if (!$serviceSchedule_id) {
        http_response_code(400);
        echo json_encode(['error' => 'ServiceSchedule ID is required for delete']);
        exit;
    }

    $serviceSchedule_id = safeInput($connection, $serviceSchedule_id);
    $query = "DELETE FROM ScheduleService WHERE ServiceScheduleID = '$serviceSchedule_id'";
    if ($connection->query($query)) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode([
            'error' => 'Failed to delete service schedule',
            'sql_error' => $connection->error,
            'query' => $query
        ]);
    }
    exit;
}

error_log("POST Data: " . print_r($_POST, true));
error_log("GET Data: " . print_r($_GET, true));

ob_end_flush();
?>
