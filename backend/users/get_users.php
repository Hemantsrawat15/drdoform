<?php

include __DIR__ . '/../cors.php'; // adjust path as needed

header("Content-Type: application/json");
include '../config/db.php';

$result = $conn->query("SELECT id, username, email, created_at FROM users");

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode($users);
$conn->close();
?>
