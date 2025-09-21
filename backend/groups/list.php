<?php
include __DIR__ . '/../cors.php'; // adjust path as needed
header("Content-Type: application/json");
include __DIR__ . '/../config/db.php';

$sql = "
  SELECT g.id, g.group_name, g.group_template, COUNT(f.id) AS form_count
  FROM groups g
  LEFT JOIN forms f ON f.group_id = g.id
  GROUP BY g.id, g.group_name, g.group_template
";

$result = $conn->query($sql);
$groups = [];
while ($row = $result->fetch_assoc()) {
    $groups[] = $row;
}
echo json_encode($groups);
$conn->close();
?>
