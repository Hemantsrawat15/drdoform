<?php

include __DIR__ . '/../cors.php'; // adjust path as needed

header("Content-Type: application/json");
include __DIR__ . '/../config/db.php';

// Get POST data (assumes JSON payload)
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['group_name'])) {
    echo json_encode(["error" => "Group name is required"]);
    exit;
}

$group_name = $data['group_name'];
// Optional: accept group_template JSON from frontend or set empty JSON string
$group_template = isset($data['group_template']) ? json_encode($data['group_template']) : json_encode(new stdClass());

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO groups (group_name, group_template) VALUES (?, ?)");
$stmt->bind_param("ss", $group_name, $group_template);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Group added successfully", "group_id" => $stmt->insert_id]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
