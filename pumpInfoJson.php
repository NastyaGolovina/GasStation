<?php
include('DBConnection.php');
header('Content-Type: application/json');

$pumpInfo= [];
$query = "SELECT 
            PumpID AS pumpID,
            FuelLevel,
            FuelType,
            Status
          FROM Pump_Management";

if (!empty($connection)) {
    $result = mysqli_query($connection, $query);

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $pumpInfo[] = $row;
        }
    } else {
        $pumpInfo[] = [];
    }
}

$tablesToJson = ['pumpTable' => $pumpInfo];
echo json_encode($tablesToJson);

