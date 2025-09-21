<?php

include __DIR__ . '/../cors.php'; // adjust path as needed

header("Content-Type: application/json");
include '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['username']) || !isset($data['email'])) {
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

$stmt = $conn->prepare("UPDATE users SET username=?, email=? WHERE id=?");
$stmt->bind_param("ssi", $data['username'], $data['email'], $data['id']);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User updated successfully"]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
