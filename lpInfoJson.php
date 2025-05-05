<?php
session_start();
echo json_encode([
    'Name' => isset($_SESSION['Name']) ? $_SESSION['Name'] : '',
    'Description' => isset($_SESSION['Description']) ? $_SESSION['Description'] : '',
]);