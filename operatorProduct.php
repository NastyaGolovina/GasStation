<?php
try {
      include('DBConnection.php');
      session_start();
      header('Content-Type: application/json');

      // Get product-related data from POST
      $name = isset($_POST['name']) ? $_POST['name'] : '';
      $price = isset($_POST['price']) ? $_POST['price'] : '';
      $stock = isset($_POST['stock']) ? $_POST['stock'] : '';
      $description = isset($_POST['description']) ? $_POST['description'] : '';
      $type = isset($_POST['type']) ? $_POST['type'] : '';
      $expirationDate = isset($_POST['expirationDate']) ? $_POST['expirationDate'] : null;
      $minStock = isset($_POST['minStock']) ? $_POST['minStock'] : null;

      $action = isset($_GET['action']) ? $_GET['action'] : '';
      $productId = isset($_GET['product_id']) ? $_GET['product_id'] : null;

      // Define a function to handle errors and redirect
      function setError($message)
      {
          $_SESSION["isError"] = true;
          $_SESSION["errorMsg"] = $message;
          header('Location: operatorProductPage.html');  // Redirect back to product page
          exit();
      }

    // If action is 'create'
    if ($action === 'create') {
        // Sanitize and insert the new product
        $consultation = "INSERT INTO Product (Name, Price, Stock, Description, Type, ExpirationDate, MinStock) 
                         VALUES ('$name', '$price', '$stock', '$description', '$type', '$expirationDate', '$minStock')";
        if (!empty($connection)) {
        if ($connection->query($consultation) === TRUE) {
            $product_id = $connection->insert_id;
            //$_SESSION["successMsg"] = 'Product created successfully';
            header('Location: operatorProductPage.html');  // Redirect after successful creation
        } else {
            setError('Failed to create product');
        }

        }  // If action is 'update'
    } else if ($action === 'update') {
        // Sanitize and update the product
        $consultation = "UPDATE Product 
                         SET Name = '$name', Price = '$price', Stock = '$stock', Description = '$description', 
                             Type = '$type', ExpirationDate = '$expirationDate', MinStock = '$minStock' 
                         WHERE ProductID = '$productId'";
        if (!empty($connection)) {
        if ($connection->query($consultation) === TRUE) {
            //$_SESSION["successMsg"] = 'Product updated successfully';
            header('Location: operatorProductPage.html');  // Redirect after successful update
        } else {
            setError('Failed to update product');
        }

        }  // If action is 'delete'
    } elseif ($action === 'delete' && $productId) {
        // Sanitize and delete the product
        $consultation = "DELETE FROM Product WHERE ProductID = '$productId'";
        if (!empty($connection)) {
        if ($connection->query($consultation) === TRUE) {
            //$_SESSION["successMsg"] = 'Product deleted successfully';
            header('Location: operatorProductPage.html');  // Redirect after successful deletion
        } else {
            setError('Failed to delete product');
        }

        }  // If the action is invalid
    } else {
        setError('Invalid action');
    }
} catch(Exception $e){
    setError();
    $_SESSION["errorMsg"] = $e->getMessage();
  }
