<?php
include('DBConnection.php');
session_start();
header('Content-Type: application/json');

$action = isset($_GET['action']) ? $_GET['action'] : '';
$service_id = isset($_GET['service_id']) ? $_GET['service_id'] : null;

if (!in_array($action, ['create', 'update', 'delete'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid action']);
    exit;
}

function safeInput($conn, $value) {
    return mysqli_real_escape_string($conn, trim($value));
}

// Check DB connection
if (empty($connection)) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

if ($action === 'create' || $action === 'update') {
    // Sanitize and validate input
    $name = isset($_POST["name"]) ? safeInput($connection, $_POST["name"]) : '';
    $description = isset($_POST["description"]) ? safeInput($connection, $_POST["description"]) : '';
    $status = isset($_POST["status"]) ? (($_POST["status"] === "1") ? 1 : 0) : 0;

    if ($name === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Name is required']);
        exit;
    }

    if ($description === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Description is required']);
        exit;
    }

    if ($action === 'create') {
        $query = "INSERT INTO Service (Name, Description, Status) VALUES ('$name', '$description', '$status')";
        if ($connection->query($query)) {
            echo json_encode(['success' => true, 'id' => $connection->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create service']);
        }
        exit;
    }

    if ($action === 'update') {
        if (!$service_id) {
            http_response_code(400);
            echo json_encode(['error' => 'Service ID is required for update']);
            exit;
        }

        $query = "UPDATE Service SET Name = '$name', Description = '$description', Status = '$status' WHERE ServiceID = '$service_id'";
        if ($connection->query($query)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update service']);
        }
        exit;
    }
}

if ($action === 'delete') {
    if (!$service_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Service ID is required for delete']);
        exit;
    }

    $query = "DELETE FROM Service WHERE ServiceID = '$service_id'";
    if ($connection->query($query)) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete service']);
    }
    exit;
}
?>
