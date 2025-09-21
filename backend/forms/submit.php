<?php

include __DIR__ . '/../cors.php'; // adjust path as needed

header("Content-Type: application/json");
include __DIR__ . '/../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['form_id']) || !isset($data['user_id']) || !isset($data['submission_data'])) {
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

$form_id = (int)$data['form_id'];
$user_id = (int)$data['user_id'];
$submission_json = json_encode($data['submission_data']);

$stmt = $conn->prepare("INSERT INTO form_submissions (form_id, user_id, submission_data) VALUES (?, ?, ?)");
$stmt->bind_param("iis", $form_id, $user_id, $submission_json);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Submission saved", "submission_id" => $stmt->insert_id]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to save submission"]);
}

$stmt->close();
$conn->close();
?>
