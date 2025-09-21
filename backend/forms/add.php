<?php

include __DIR__ . '/../cors.php'; // adjust path as needed

header("Content-Type: application/json");
include __DIR__ . '/../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
if (!is_array($data)) {
    echo json_encode(["error" => "Input should be an array of forms"]);
    exit;
}

$results = [];

// Updated query to insert pages JSON as well (assuming pages column exists)
$stmt = $conn->prepare("INSERT INTO forms (group_id, form_name, form_template, pages) VALUES (?, ?, ?, ?)");

foreach ($data as $form) {
    if (!isset($form['group_id'], $form['form_name'], $form['form_template'])) {
        $results[] = ["error" => "Missing required fields in one form"];
        continue;
    }

    $group_id = (int)$form['group_id'];
    $form_name = $form['form_name'];
    $form_template = json_encode($form['form_template']);

    // pages key is optional, so handle default empty array if missing
    $pages = isset($form['pages']) ? json_encode($form['pages']) : json_encode([]);

    $stmt->bind_param("isss", $group_id, $form_name, $form_template, $pages);

    if ($stmt->execute()) {
        $results[] = [
            "success" => true,
            "form_name" => $form_name,
            "form_id" => $stmt->insert_id
        ];
    } else {
        $results[] = [
            "success" => false,
            "form_name" => $form_name,
            "error" => $stmt->error
        ];
    }
}

$stmt->close();
$conn->close();

echo json_encode($results);
?>