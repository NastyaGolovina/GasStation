<?php
    include ('DBConnection.php');

    $tablesToJson =[];

    $consultation = "select * from user";
    if (!empty($connection)) {
        $result = mysqli_query($connection,$consultation);
    }
    if($result->num_rows > 0){
        $user = [];
        while ($row = $result->fetch_assoc()) {
            $user[] = $row;
        }
    } else {
        $user[] = [];
    }
    $tablesToJson['userTable'] = $user;

    $consultation = "select * from permission";
    if (!empty($connection)) {
        $result = mysqli_query($connection,$consultation);
    }
    if($result->num_rows > 0){
        $permission = [];
        while ($row = $result->fetch_assoc()) {
            $permission[] = $row;
        }
    } else {
        $permission[] = [];
    }
    $tablesToJson['permissionTable'] = $permission;

    $consultation = "select * from customer";
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

    $tablesToJson['customerTable'] = $customer;

$consultation = "SELECT * FROM loyaltyprogram";
if (!empty($connection)) {
    $result = mysqli_query($connection, $consultation);
    $loyaltyProgram = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $loyaltyProgram[] = $row;
        }
    } else {
        $loyaltyProgram[] = [];
    }
    $tablesToJson['LoyaltyProgramTable'] = $loyaltyProgram;
}

$consultation = "SELECT * FROM service";
if (!empty($connection)) {
    $result = mysqli_query($connection, $consultation);
    $Service = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $Service[] = $row;
        }
    } else {
        $Service[] = [];
    }
    $tablesToJson['ServiceTable'] = $Service;
}

echo json_encode($tablesToJson);
