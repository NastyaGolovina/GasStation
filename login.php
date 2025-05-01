<?php
    include ('DBConnection.php');

    $login = $_POST['login'];
    $password = $_POST['password'];
    if(isset($login) && isset($password)){
        $consultation = "Select UserID,PermissionID from User where Login='".$login."' and Password ='".$password."'";
        if (!empty($connection)) {
            $result = mysqli_query($connection,$consultation);
        }
        if($result->num_rows > 0){
            $row = $result->fetch_assoc();
            session_start();
            $_SESSION["UserID"] = $row['UserID'];
            if($row['PermissionID'] == 'ADMINISTRATOR'){
                header('location:adminHomePage.html');
            } elseif ($row['PermissionID'] == 'CUSTOMER') {
                //header('location:adminHomePage.html');
            } elseif ($row['PermissionID'] == 'EMPLOYEE_ADMIN') {
                //header('location:adminHomePage.html');
            } elseif ($row['PermissionID'] == 'EMPLOYEE_SERVICES') {
                //header('location:adminHomePage.html');
            } elseif ($row['PermissionID'] == 'OPERATOR') {
                //header('location:adminHomePage.html');
            } elseif ($row['PermissionID'] == 'STATION_MANAGER') {
                //header('location:adminHomePage.html');
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
            header('location:login.html');
        }
    }