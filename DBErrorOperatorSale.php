<?php
    session_start();
    echo json_encode([
        'isError' => isset($_SESSION['isError']) ? $_SESSION['isError'] : false,
        'errorMsg' => isset($_SESSION['errorMsg']) ? $_SESSION['errorMsg'] : false,
    ]);
    unset($_SESSION['isError'], $_SESSION['errorMsg']);