<?php
session_start();
echo json_encode([
    'isError' => isset($_SESSION['isError']) ? $_SESSION['isError'] : false
]);
