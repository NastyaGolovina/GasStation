<?php
try {
    include('DBConnection.php');
    session_start();
    header('Content-Type: application/json');

    // Get product-related data from POST
    //$cardID = isset($_POST['cardID']) ? $_POST['cardID'] : null;
    //$cardID = isset($_GET['card_ID']) ? $_GET['card_ID'] : null;
    $cardID = isset($_POST['cardID']) ? $_POST['cardID'] :
        (isset($_GET['cardID']) ? $_GET['cardID'] :
            (isset($_GET['card_ID']) ? $_GET['card_ID'] : null));

    $CustomerID = isset($_POST['CustomerID']) ? $_POST['CustomerID'] : '';
    $points = isset($_POST['points']) ? $_POST['points'] : '';

    $action = isset($_GET['action']) ? $_GET['action'] : '';

    // Define a function to handle errors
    function setError($message)
    {
        echo json_encode(['success' => false, 'error' => $message]);
        exit();

    }

    // If action is 'create'
    if ($action === 'create') {
        $consultation = "INSERT INTO Loyalty_Card (CustomerID, Points) 
                     VALUES ('$CustomerID', '$points')";

        if (!empty($connection)) {
            if ($connection->query($consultation) === TRUE) {
                $cardID = $connection->insert_id;
                echo json_encode(['success' => true, 'card_id' => $cardID]);
                exit();
            } else {
                setError('Failed to create loyalty card.');
            }
        } else {
            setError('Database connection not available');
        }

    } elseif ($action === 'update') {
        $consultation = "UPDATE Loyalty_Card 
                     SET CustomerID = '$CustomerID', Points = '$points' 
                     WHERE LoyaltyCardID = '$cardID'";

        if (!empty($connection)) {
            if ($connection->query($consultation) === TRUE) {
                echo json_encode(['success' => true]);
                exit();
            } else {
                setError('Failed to update loyalty card.');
            }
        } else {
            setError('Database connection not available');
        }

    } elseif ($action === 'delete' && $cardID) {
        $consultation = "DELETE FROM Loyalty_Card WHERE LoyaltyCardID = '$cardID'";

        if (!empty($connection)) {
            if ($connection->query($consultation) === TRUE) {
                echo json_encode(['success' => true]);
                exit();
            } else {
                setError('Failed to delete loyalty card.');
            }
        } else {
            setError('Database connection not available');
        }

    } else {
        setError('Invalid action');
    }
}catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Server exception: ' . $e->getMessage()]);
    exit();
}

