<?php

    include ('DBConnection.php');

    $saleId = isset($_POST['sale-id']) ? $_POST['sale-id'] : null;
    $date = isset($_POST['date']) ? $_POST['date'] : null;
    $customer = isset($_POST['customer']) ? $_POST['customer'] : null;
    $totalAmount = isset($_POST['total-amount']) ? $_POST['total-amount'] : null;

    $cardId = isset($_POST['card-id']) ? $_POST['card-id'] : null;
    $loyaltyProgram = isset($_POST['loyalty-program']) ? $_POST['loyalty-program'] : null;
    $pointQty = isset($_POST['point-qty']) ? $_POST['point-qty'] : null;
    $prize = isset($_POST['prize']) ? $_POST['prize'] : null;

    $itemIds = isset($_POST['cardId']) ? $_POST['cardId'] : array();
    $quantities = isset($_POST['qty']) ? $_POST['qty'] : array();
    $prices = isset($_POST['price']) ? $_POST['price'] : array();
    $products = isset($_POST['product']) ? $_POST['product'] : array();

    $saleId = isset($_GET['sale_id']) ? $_GET['sale_id'] : null;
    $action = isset($_GET['action']) ? $_GET['action'] : null;
    $lpId = isset($_GET['lp_id']) ? $_GET['lp_id'] : null;
    $prevPointQty = isset($_GET['prev_point_qty']) ? $_GET['prev_point_qty'] : null;

    function setError()
    {
        session_start();
        $_SESSION["isError"] = true;
        header('location:operatorSalePage.html');
    }

    if($action === 'create') {
        $consultation = "INSERT INTO Sale (Date, CustomerID, TotalAmount) VALUES
                        ('".$date."', ".$customer.", ".$totalAmount.");";

        if (!empty($connection)) {
            if($connection->query($consultation) === TRUE) {
                $sale_id = $connection->insert_id;
                if(!empty($quantities)) {
                    for($i = 0; $i < count($quantities); $i++) {
                        $consultation = "INSERT INTO Item (SaleID, ProductID, Price, Qty) VALUES
                                            (".$sale_id.", ".$products[$i].", ".$prices[$i].", ".$quantities[$i].");";
                        if($connection->query($consultation) === FALSE) {
                            setError();
                        }
                    }
                }
                if(!empty($cardId)) {
                    $consultation = "INSERT INTO Movement_Card (Date, PointsQnt, CustomerID, 
                                                LoyaltyCardID, PrizeProductID, LoyaltyProgramID, SaleID) VALUES
                                                ('".$date."',".$pointQty.", ".$customer.", ".$cardId.", " .(!empty($prize) ? $prize : "NULL"). ", 
                                                ".$lpId.", ".$sale_id.");  ";
                    if($connection->query($consultation) === TRUE) {
                        $consultation = "UPDATE Loyalty_Card
                                    SET Points = Points + ".(int)$pointQty."
                                    WHERE LoyaltyCardID = ".$cardId.";";
                        if($connection->query($consultation) === TRUE) {
                            header('location:operatorSalePage.html');
                        } else {
                            setError();
                        }
                    } else {
                        setError();
                    }
                } else {
                    header('location:operatorSalePage.html');
                }
            } else {
                setError();
            }
        }
    } elseif($action === 'update') {
        $consultation = "UPDATE Sale 
            SET Date = '".$date."', CustomerID = ".$customer.", TotalAmount = ".$totalAmount." 
            WHERE SaleID = ".$saleId.";";

        if (!empty($connection)) {
            if($connection->query($consultation) === TRUE) {
                $consultation = "DELETE FROM Item WHERE SaleID = ".$saleId.";";

                if($connection->query($consultation) === TRUE) {
                    if(!empty($quantities)) {
                        for($i = 0; $i < count($quantities); $i++) {
                            $consultation = "INSERT INTO Item (SaleID, ProductID, Price, Qty) VALUES
                                            (".$saleId.", ".$products[$i].", ".$prices[$i].", ".$quantities[$i].");";
                            if($connection->query($consultation) === FALSE) {
                                setError();
                            }
                        }
                    }
                    if(!empty($cardId)) {
                        echo $lpId;
                        $consultation = "UPDATE Movement_Card 
                        SET Date = '".$date."', PointsQnt = ".$pointQty.", CustomerID = ".$customer.", 
                        LoyaltyCardID = ".$cardId.", PrizeProductID = " .(!empty($prize) ? $prize : "NULL"). ", 
                        LoyaltyProgramID = ".$lpId."
                        WHERE SaleID = ".$saleId.";";

                        if($connection->query($consultation) === TRUE) {
                            $consultation = "UPDATE Loyalty_Card
                                    SET Points = Points + ".(int)$pointQty." - ".$prevPointQty."
                                    WHERE LoyaltyCardID = ".$cardId.";";
                            if($connection->query($consultation) === TRUE) {
                                header('location:operatorSalePage.html');
                            } else {
                                setError();
                            }
                        } else {
                            setError();
                        }
                    } else {
                        header('location:operatorSalePage.html');
                    }
                }
            } else {
                setError();
            }
        }
    } elseif ($action === 'delete') {
        $consultation = "DELETE FROM Item WHERE SaleID = ".$saleId.";";
        if (!empty($connection)) {
            if($connection->query($consultation) === TRUE) {
                $consultation = "DELETE FROM Movement_Card WHERE SaleID = ".$saleId.";";
                if($connection->query($consultation) === TRUE) {
                    $consultation = "DELETE FROM Sale WHERE SaleID = ".$saleId.";";
                    if($connection->query($consultation) === TRUE) {
                        header('location:operatorSalePage.html');
                    } else {
                        setError();
                    }
                } else {
                    setError();
                }
            } else {
                setError();
            }
        }
    }



