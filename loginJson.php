<?php
session_start();
echo json_encode([
    'isError' => isset($_SESSION['isError']) ? $_SESSION['isError'] : false,
    'login' => isset($_SESSION['login']) ? $_SESSION['login'] : '',
    'password' => isset($_SESSION['password']) ? $_SESSION['password'] : ''
]);
session_unset();
session_destroy();
//unset($_SESSION['isError'], $_SESSION['login'], $_SESSION['password']);
