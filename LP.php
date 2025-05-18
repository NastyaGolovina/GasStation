<?php
include('DBConnection.php');
session_start();
header('Content-Type: application/json');

$action = isset($_GET['action']) ? $_GET['action'] : '';
$lp_id = isset($_GET['lp_id']) ? $_GET['lp_id'] : null;

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
    // Validate and sanitize input
    $name = isset($_POST["name"]) ? safeInput($connection, $_POST["name"]) : '';
    $description = isset($_POST["description"]) ? safeInput($connection, $_POST["description"]) : '';

    if ($name === '') {
        echo json_encode(['error' => 'Name is required']);
        exit;
    }

    if ($action === 'create') {
        $query = "INSERT INTO LoyaltyProgram (Name, Description) VALUES ('$name', '$description')";
        if ($connection->query($query)) {
            echo json_encode(['success' => true, 'id' => $connection->insert_id]);
        } else {
            echo json_encode(['error' => 'Failed to create loyalty program']);
        }
        exit;
    }

    if ($action === 'update') {
        if (!$lp_id) {
            echo json_encode(['error' => 'LoyaltyProgram ID is required for update']);
            exit;
        }

        $query = "UPDATE LoyaltyProgram SET Name = '$name', Description = '$description' WHERE LoyaltyProgramID = '$lp_id'";
        if ($connection->query($query)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'Failed to update loyalty program']);
        }
        exit;
    }
}

if ($action === 'delete') {
    if (!$lp_id) {
        echo json_encode(['error' => 'LoyaltyProgram ID is required for delete']);
        exit;
    }

$query = "DELETE FROM LoyaltyProgram WHERE LoyaltyProgramID = '$lp_id'";
    if ($connection->query($query)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Failed to delete loyalty program']);
    }
    exit;
}
?>
