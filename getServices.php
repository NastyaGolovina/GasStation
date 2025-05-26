<?php
global $connection;
include('DBConnection.php');
header('Content-Type: application/json');

$query = "SELECT ServiceID, Name FROM service";
$result = mysqli_query($connection, $query);

$services = [];
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $services[] = $row;
    }
}

echo json_encode(['services' => $services]);
?>
