<?php
    $server = "localhost";
    $user = "root";
    $dbname = "gasstation";
    $connection = mysqli_connect($server,$user) or die("No connection");
    mysqli_select_db($connection, $dbname) or die("No DB");
    unset($_SESSION['isError']);

