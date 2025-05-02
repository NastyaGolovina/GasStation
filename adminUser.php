<?php
    include ('DBConnection.php');
    $name = $_POST["name"];
    $address = $_POST["address"];
    $nif = $_POST["nif"];
    $email = $_POST["email"];
    $login = $_POST["login"];
    $password = $_POST["password"];
    $status = isset($_POST["status"]);  // Checkbox
    $permission = $_POST["permission"];
    $loyalty_program = $_POST["loyalty-program"];
