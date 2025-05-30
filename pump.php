<?php
try {
    include('DBConnection.php');
    header('Content-Type: application/json');

    // Optional: Remove if not using sessions
    // session_start();

    if (!isset($connection) || !$connection) {
        echo json_encode(['success' => false, 'error' => 'Database connection not available']);
        exit();
    }

    // Intentionally no operations
    echo json_encode(['success' => false, 'error' => 'No action specified.']);
    exit();

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Server exception: ' . $e->getMessage()]);
    exit();
}
