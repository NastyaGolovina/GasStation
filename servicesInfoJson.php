<?php
include ('DBConnection.php');

$tablesToJson =[];

$consultation = "SELECT * FROM service";
if (!empty($connection)) {
    $result = mysqli_query($connection, $consultation);
    $Service = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $Service[] = $row;
        }
    } else {
        $Service[] = [];
    }
    $tablesToJson['ServiceTable'] = $Service;
}

echo json_encode($tablesToJson);
