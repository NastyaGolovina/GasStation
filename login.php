<?php
    include ('DBConnection.php');

    $login = $_POST['login'];
    $password = $_POST['password'];
    if(isset($login) && isset($password)){
        $consultation = "Select * from User where Login='".$login."' and Password ='".$password."'";
        if (!empty($connection)) {
            $result = mysqli_query($connection,$consultation);
        }
        if($result->num_rows > 0){
            $row = $result->fetch_assoc();
            if($row['Status'] == 1){
                session_start();
                $_SESSION["UserID"] = $row['UserID'];
                $_SESSION["Name"] = $row['Name'];
                $_SESSION["Address"] = $row['Address'];
                $_SESSION["NIF"] = $row['NIF'];
                $_SESSION["Email"] = $row['Email'];
                $_SESSION["login"] = $row['Login'];
                $_SESSION["password"] = $row['Password'];
                $_SESSION["Status"] = $row['Status'];
                $_SESSION["PermissionID"] = $row['PermissionID'];

                if($row['PermissionID'] == 'ADMINISTRATOR'){
                    header('location:adminHomePage.html');
                } elseif ($row['PermissionID'] == 'CUSTOMER') {
                    header('location:customerHome.html');
                } elseif ($row['PermissionID'] == 'EMPLOYEE_ADMIN') {
                    header('location:employeeAdminHome.html');
                } elseif ($row['PermissionID'] == 'EMPLOYEE_SERVICES') {
                    header('location:employeeServicesHomePage.html');
                } elseif ($row['PermissionID'] == 'OPERATOR') {
                    header('location:operatorHomePage.html');
                } elseif ($row['PermissionID'] == 'STATION_MANAGER') {
//                    header('location:customerHome.html');
                } else {
                    header('location:login.html');
                    $_SESSION["UserID"] = "";
                }
            } else {
                session_start();
                $_SESSION["UserID"] = "";
                $_SESSION["isError"] = true;
                $_SESSION["login"] = $login;
                $_SESSION["password"] = $password;
                $_SESSION["ErrorMessage"] = "User is blocked";
                header('location:login.html');
            }

        } else {

            session_start();
            $_SESSION["UserID"] = "";
            $_SESSION["isError"] = true;
            $_SESSION["login"] = $login;
            $_SESSION["password"] = $password;
            $_SESSION["ErrorMessage"] = "Login or Password is invalid";
            header('location:login.html');
        }
    }