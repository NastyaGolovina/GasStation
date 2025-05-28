<?php
    include ('DBConnection.php');
    session_start();
    $user_id = isset($_SESSION['UserID']) ? (int)$_SESSION['UserID'] : 0;
    $tablesToJson =[];

    $consultation = "SELECT mc.* , lp.Name as LoyaltyProgramName, p.Name as PrizeProduct, u.Name as CustomerName
                        FROM movement_card mc
                        LEFT JOIN  loyaltyprogram lp on lp.LoyaltyProgramID = mc.LoyaltyProgramID
                        LEFT JOIN  product p on p.ProductID = mc.PrizeProductID
                        INNER JOIN customer c on c.CustomerID = mc.CustomerID
                        INNER JOIN  user u on u.UserID = c.UserID
                        where mc.CustomerID = (SELECT CustomerID FROM gasstation.customer where UserID = ".$user_id.");";
    if (!empty($connection)) {
        $result = mysqli_query($connection,$consultation);
    }
    if($result->num_rows > 0){
        $movement_card = [];
        while ($row = $result->fetch_assoc()) {
            $movement_card[] = $row;
        }
    } else {
        $movement_card[] = [];
    }
    $tablesToJson['movement_card'] = $movement_card;
    echo json_encode($tablesToJson);
