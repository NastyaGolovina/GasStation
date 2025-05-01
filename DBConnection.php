<?php
    $server = "localhost";
    $user = "root";
    $password = "yfcnz212006";
    $dbname = "gasstation";
    $connection = mysqli_connect($server,$user,$password) or die("No connection");
    mysqli_select_db($connection, $dbname) or die("No DB");


