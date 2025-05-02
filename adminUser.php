<?php
    include ('DBConnection.php');
    if($_GET['action'] == 'create' || $_GET['action'] == 'update' ){
        $name = $_POST["name"];
        $address = $_POST["address"];
        $nif = $_POST["nif"];
        $email = $_POST["email"];
        $login = $_POST["login"];
        $password = $_POST["password"];
        $status = isset($_POST["status"]) ? 1 : 0;
        $permission = $_POST["permission"];
        $loyalty_program = isset($_POST["loyalty-program"]) ? $_POST["loyalty-program"] : '';
        if($_GET['action'] == 'create'){
                $consultation = "INSERT INTO User (Name, Address , NIF,Email,Login,Password,Status,PermissionID)
                VALUES ('".$name."', '".$address."','".$nif."',
                '".$email."', '".$login."',
                '".$password."', ".$status." , '".$permission."');";

            if (!empty($connection)) {
                if($connection->query($consultation) === TRUE){
                    $user_id = $connection->insert_id;
                    echo $user_id;
                    if($permission == "CUSTOMER") {
                        $consultation = "INSERT INTO Customer (UserID,LoyaltyProgramID)
                        VALUES ('".$user_id."','".$loyalty_program."');";
                        if($connection->query($consultation) === TRUE){
                            header('location:adminUsersPage.html');
                        } else {
                            session_start();
                            $_SESSION["isError"] = true;
                            header('location:login.html');
                        }
                    }
                    header('location:adminUsersPage.html');
                } else {
                    session_start();
                    $_SESSION["isError"] = true;
                    header('location:login.html');
                }
            }
        } elseif ($_GET['action'] == 'update') {
            $user_id = $_GET["user_id"];
            $consultation = "UPDATE User
            SET Name = '".$name."', Address = '".$address."', NIF = '".$nif."', Email = '".$email."',
             Login = '".$login."', Password = '".$password."', Status = ".$status." , PermissionID = '".$permission."'
            WHERE UserID = '".$user_id."';";

            if (!empty($connection)) {
                if ($connection->query($consultation) === TRUE) {
                    if($permission != "CUSTOMER") {
                        $consultation = "Delete from Customer where UserID = '".$user_id."';";
                        if($connection->query($consultation) === TRUE){
                            header('location:adminUsersPage.html');
                        } else {
                            session_start();
                            $_SESSION["isError"] = true;
                            header('location:login.html');
                        }
                    } else {
                        $consultation = "Select * from Customer where UserID = '".$user_id."';";
                        if (!empty($connection)) {
                            $result = mysqli_query($connection,$consultation);
                        }
                        if($result->num_rows > 0){
                            while($row = $result->fetch_assoc()) {
                                $consultation = "UPDATE Customer
                                SET LoyaltyProgramID ='".$loyalty_program."'
                                WHERE UserID = '".$user_id."';";
                                if($connection->query($consultation) === TRUE){
                                    header('location:adminUsersPage.html');
                                } else {
                                    session_start();
                                    $_SESSION["isError"] = true;
                                    header('location:login.html');
                                }
                            }
                        } else {
                           $consultation = "INSERT INTO Customer (UserID,LoyaltyProgramID)
                                VALUES ('".$user_id."','".$loyalty_program."');";
                           if($connection->query($consultation) === TRUE){
                                header('location:adminUsersPage.html');
                           } else {
                               session_start();
                               $_SESSION["isError"] = true;
                               header('location:login.html');
                            }
                        }
                    }

                    header('location:adminUsersPage.html');
                }
            }


        }
    } elseif ($_GET['action'] == 'delete') {
        $user_id = $_GET["user_id"];
        if (!empty($connection)) {
            $consultation = "Delete from Customer where UserID = '" . $user_id . "';";
            if ($connection->query($consultation) === TRUE) {
                $consultation = "Delete from User where UserID = '" . $user_id . "';";

                if ($connection->query($consultation) === TRUE) {

                    header('location:adminUsersPage.html');
                } else {
                    session_start();
                    $_SESSION["isError"] = true;
                    header('location:login.html');
                }

                header('location:adminUsersPage.html');
            } else {
                session_start();
                $_SESSION["isError"] = true;
                header('location:login.html');
            }
        }
    }


