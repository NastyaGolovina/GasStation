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
          //$_SESSION["isError"] = true;
         // $_SESSION["errorMsg"] = $message;
          //echo json_encode(['success' => true]);
         // exit();
          echo json_encode(['success' => false, 'error' => $message]);
          exit();

      }

    // If action is 'create'
    if ($action === 'create') {
        $consultation = "INSERT INTO Product (Name, Price, Stock, Description, Type, ExpirationDate, MinStock) 
                     VALUES ('$productName', '$price', '$stock', '$description', '$type', '$expirationDate', '$minStock')";

        if (!empty($connection)) {
            if ($connection->query($consultation) === TRUE) {
                $product_id = $connection->insert_id;
                echo json_encode(['success' => true, 'product_id' => $product_id]);
                exit();
            } else {
                setError('Failed to create product');
            }
        } else {
            setError('Database connection not available');
        }

    } elseif ($action === 'update') {
        $consultation = "UPDATE Product 
                     SET Name = '$productName', Price = '$price', Stock = '$stock', Description = '$description', 
                         Type = '$type', ExpirationDate = '$expirationDate', MinStock = '$minStock' 
                     WHERE ProductID = '$productId'";

        if (!empty($connection)) {
            if ($connection->query($consultation) === TRUE) {
                echo json_encode(['success' => true]);
                exit();
            } else {
                setError('Failed to update product');
            }
        } else {
            setError('Database connection not available');
        }

    } elseif ($action === 'delete' && $productId) {
        $consultation = "DELETE FROM Product WHERE ProductID = '$productId'";

        if (!empty($connection)) {
            if ($connection->query($consultation) === TRUE) {
                echo json_encode(['success' => true]);
                exit();
            } else {
                setError('Failed to delete product');
            }
        } else {
            setError('Database connection not available');
        }

    } else {
        setError('Invalid action');
    }
    }
