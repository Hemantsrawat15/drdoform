<?php

include __DIR__ . '/../cors.php'; // adjust path as needed

header("Content-Type: application/json");
include __DIR__ . '/../config/db.php';

if (!isset($_GET['group_id'])) {
    echo json_encode(["error" => "Missing group_id"]);
    exit;
}

$group_id = (int)$_GET['group_id'];

$stmt = $conn->prepare("SELECT id, form_name, form_template FROM forms WHERE group_id = ?");
$stmt->bind_param("i", $group_id);
$stmt->execute();
$result = $stmt->get_result();

$forms = [];
while ($row = $result->fetch_assoc()) {
    $forms[] = $row;
}

echo json_encode($forms);

$stmt->close();
$conn->close();
?>
