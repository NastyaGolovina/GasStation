<?php
include('DBConnection.php');
header('Content-Type: application/json');

$tablesToJson = [];

$consultation = "SELECT * FROM scheduleservice";
if (!empty($connection)) {
    $result = mysqli_query($connection, $consultation);
    $scheduleService = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $scheduleService[] = $row;
        }
    } else {
        $scheduleService[] = [];
    }
    $tablesToJson['ScheduleServiceTable'] = $scheduleService;
}

echo json_encode($tablesToJson);
?>
