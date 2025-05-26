<?php
try {
      include('DBConnection.php');
      session_start();
      header('Content-Type: application/json');

      // Get product-related data from POST
      $productName = isset($_POST['productName']) ? $_POST['productName'] : '';
      $price = isset($_POST['price']) ? $_POST['price'] : '';
      $stock = isset($_POST['stock']) ? $_POST['stock'] : '';
      $description = isset($_POST['description']) ? $_POST['description'] : '';
      $type = isset($_POST['type']) ? $_POST['type'] : '';
      $expirationDate = isset($_POST['expirationDate']) ? $_POST['expirationDate'] : null;
      $minStock = isset($_POST['minStock']) ? $_POST['minStock'] : null;

      $action = isset($_GET['action']) ? $_GET['action'] : '';
      $productId = isset($_GET['product_id']) ? $_GET['product_id'] : null;

      // Define a function to handle errors
      function setError($message)
      {
          echo json_encode(['success' => false, 'error' => $message]);
          exit();
      }

// Basic validation
    if (empty($connection)) {
        setError('Database connection failed');
    }

    if ($action == 'create') {
        $query = "INSERT INTO Product (Name, Price, Stock, Description, Type, ExpirationDate, MinStock)
                  VALUES ('$productName', '$price', '$stock', '$description', '$type',
                  " . ($expirationDate ? "'$expirationDate'" : "NULL") . ",
                  " . ($minStock !== '' && $minStock !== null ? "'$minStock'" : "NULL") . ")";

        if ($connection->query($query) === TRUE) {
            echo json_encode(['success' => true, 'product_id' => $connection->insert_id]);
        } else {
            setError('Failed to create product: ' . $connection->error);
        }

    } elseif ($action == 'update') {
        if (!$productId) {
            setError('Product ID is required for update');
        }

        $query = "UPDATE Product SET
                    Name = '$productName',
                    Price = '$price',
                    Stock = '$stock',
                    Description = '$description',
                    Type = '$type',
                    ExpirationDate = " . ($expirationDate ? "'$expirationDate'" : "NULL") . ",
                    MinStock = " . ($minStock !== '' && $minStock !== null ? "'$minStock'" : "NULL") . "
                  WHERE ProductID = '$productId'";

        if ($connection->query($query) === TRUE) {
            echo json_encode(['success' => true]);
        } else {
            setError('Failed to update product: ' . $connection->error);
        }

    } elseif ($action == 'delete') {
        if (!$productId) {
            setError('Product ID is required for delete');
        }

        $query = "DELETE FROM Product WHERE ProductID = '$productId'";
        if ($connection->query($query) === TRUE) {
            echo json_encode(['success' => true]);
        } else {
            setError('Failed to delete product: ' . $connection->error);
        }

    } else {
        setError('Invalid action');
    }
}
catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Server exception: ' . $e->getMessage()]);
}
