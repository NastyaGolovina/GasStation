<?php
    session_start();
    echo json_encode([
        'UserID' => isset($_SESSION['UserID']) ? $_SESSION['UserID'] : '',
        'Name' => isset($_SESSION['Name']) ? $_SESSION['Name'] : '',
        'Address' => isset($_SESSION['Address']) ? $_SESSION['Address'] : '',
        'NIF' => isset($_SESSION['NIF']) ? $_SESSION['NIF'] : '',
        'login' => isset($_SESSION['login']) ? $_SESSION['login'] : '',
        'password' => isset($_SESSION['password']) ? $_SESSION['password'] : '',
        'Status' => isset($_SESSION['Status']) ? $_SESSION['Status'] : '',
        'PermissionID' => isset($_SESSION['PermissionID']) ? $_SESSION['PermissionID'] : ''
    ]);
