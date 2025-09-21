<?php
include __DIR__ . '/../cors.php';
header("Content-Type: application/json");
include __DIR__ . '/../config/db.php';

if (!isset($_GET['form_id'])) {
  echo json_encode(["error" => "Missing form_id"]);
  exit;
}

$form_id = (int)$_GET['form_id'];
$stmt = $conn->prepare("SELECT id, group_id, form_name, form_template, pages FROM forms WHERE id = ?");
$stmt->bind_param("i", $form_id);
$stmt->execute();
$result = $stmt->get_result();

if ($form = $result->fetch_assoc()) {
  echo json_encode($form);
} else {
  echo json_encode(["error" => "Form not found"]);
}

$stmt->close();
$conn->close();
?>
