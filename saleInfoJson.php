<?php
    include ('DBConnection.php');


    $consultation = "SELECT c.* , u.Name , lp.Name as lpName , lc.LoyaltyCardID , lc.Points
                    FROM customer c
                    inner join User u on c.UserID = u.UserId
                    Left join LoyaltyProgram lp on c.LoyaltyProgramID = lp.LoyaltyProgramID
                    Left join Loyalty_Card lc on c.CustomerID = lc.CustomerID";
    if (!empty($connection)) {
        $result = mysqli_query($connection,$consultation);
    }
    if($result->num_rows > 0){
        $customer = [];
        while ($row = $result->fetch_assoc()) {
            $customer[] = $row;
        }
    } else {
        $customer[] = [];
    }
    $tablesToJson['Customer'] = $customer;

    $consultation = "
                        SELECT s.* , mc.MovementCardID,
                            mc.Date AS MovementDate,
                            mc.PointsQnt,
                            mc.LoyaltyCardID,
                            mc.PrizeProductID,
                            mc.LoyaltyProgramID
                        FROM sale s
                        Left join Movement_Card mc on s.SaleID = mc.SaleID";
    if (!empty($connection)) {
        $result = mysqli_query($connection,$consultation);
    }
    if($result->num_rows > 0){
        $sale = [];
        while ($row = $result->fetch_assoc()) {
            $sale[] = $row;
        }
    } else {
        $sale[] = [];
    }

    $tablesToJson['Sale'] = $sale;

    $consultation = "SELECT * FROM Product";
    if (!empty($connection)) {
        $result = mysqli_query($connection, $consultation);
        $product = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $product[] = $row;
            }
        } else {
            $product[] = [];
        }
        $tablesToJson['Product'] = $product;
    }

    $consultation = "SELECT * FROM Item";
    if (!empty($connection)) {
        $result = mysqli_query($connection, $consultation);
        $item = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $item[] = $row;
            }
        } else {
            $item[] = [];
        }
        $tablesToJson['Item'] = $item;
    }


    echo json_encode($tablesToJson);
