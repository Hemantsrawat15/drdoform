<?php
/*
include __DIR__ . '/../cors.php'; // adjust path as needed

require_once __DIR__ . '/../vendor/autoload.php';  // Dompdf autoload
include __DIR__ . '/../config/db.php';             // DB connection
use Dompdf\Dompdf;

if (!isset($_GET['submission_id'])) {
    header("Content-Type: application/json");
    echo json_encode(["error" => "Missing submission_id"]);
    exit;
}
$submission_id = (int)$_GET['submission_id'];

$stmt = $conn->prepare("
    SELECT fs.submission_data, f.form_template, f.pages, g.group_template
    FROM form_submissions fs
    JOIN forms f ON fs.form_id = f.id
    JOIN groups g ON f.group_id = g.id
    WHERE fs.id = ?
");
$stmt->bind_param("i", $submission_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $submission_data = json_decode($row['submission_data'], true);
    $form_template = json_decode($row['form_template'], true);
    $pages = $row['pages'] ? json_decode($row['pages'], true) : [];
    $group_template = json_decode($row['group_template'], true);
    $form_title = $form_template['header'] ?? $form_template['title'] ?? 'Form Submission';
    $group_header = $group_template['header'] ?? '';

    $html = "<h1>" . htmlspecialchars($form_title) . "</h1>";
    $html .= "<h2>Group: " . htmlspecialchars($group_header) . "</h2>";

    // If pages are present, use the paged layout
    if (is_array($pages) && count($pages) > 0) {
        foreach ($pages as $i => $page) {
            $html .= "<h3>" . htmlspecialchars($page['title'] ?? ("Page " . ($i + 1))) . "</h3>";
            $html .= "<table border='1' cellpadding='5' cellspacing='0' width='100%'><tbody>";
            foreach ($page['fields'] as $field) {
                $name = $field['name'];
                $label = $field['label'];
                $value = isset($submission_data[$name]) ? $submission_data[$name] : null;
                if ($field['type'] === 'checkbox') {
                    $value = $value ? "Yes" : "No";
                } elseif ($value === "" || $value === null) {
                    $value = "<i>N/A</i>";
                } else {
                    $value = htmlspecialchars((string)$value);
                }
                $html .= "<tr><td width='60%'>" . htmlspecialchars($label) . "</td><td width='40%'>" . $value . "</td></tr>";
            }
            $html .= "</tbody></table>";
            // Only add page break between, not after last
            if ($i !== count($pages) - 1) {
                $html .= "<div style='page-break-after: always;'></div>";
            }
        }
    }
    // fallback to old flat fields if no pages exist
    else if (is_array($form_template['fields'] ?? null)) {
        $html .= "<table border='1' cellpadding='5' cellspacing='0' width='100%'><tbody>";
        foreach ($form_template['fields'] as $field) {
            $name = $field['name'];
            $label = $field['label'];
            $value = isset($submission_data[$name]) ? $submission_data[$name] : null;
            if ($field['type'] === 'checkbox') {
                $value = $value ? "Yes" : "No";
            }
            if ($value === "" || $value === null) {
                $value = "<i>N/A</i>";
            }
            $html .= "<tr><td width='60%'>" . htmlspecialchars($label) . "</td><td width='40%'>" . htmlspecialchars((string)$value) . "</td></tr>";
        }
        $html .= "</tbody></table>";
    }

    if (!empty($form_template['footer'])) {
        $html .= "<p><b>Note:</b> " . htmlspecialchars($form_template['footer']) . "</p>";
    }

    $dompdf = new Dompdf();
    $dompdf->loadHtml($html);
    $dompdf->setPaper('A4');
    $dompdf->render();

    // Add page numbers to all PDF pages (bottom right)
    $canvas = $dompdf->getCanvas();
    $font = $dompdf->getFontMetrics()->getFont('Helvetica', 'normal');
    $footerText = "Page {PAGE_NUM} of {PAGE_COUNT}";
    $fontSize = 10;
    $y = $canvas->get_height() - 30;
    $x = $canvas->get_width() - 100;
    $canvas->page_text($x, $y, $footerText, $font, $fontSize, array(0,0,0));

    $dompdf->stream("submission_$submission_id.pdf", ["Attachment" => false]);
    exit;
} else {
    header("Content-Type: application/json");
    echo json_encode(["error" => "Submission not found"]);
}

$stmt->close();
$conn->close();
*/

include __DIR__ . '/../cors.php'; // adjust path as needed

require_once __DIR__ . '/../vendor/autoload.php';  // Dompdf autoload
include __DIR__ . '/../config/db.php';             // DB connection
use Dompdf\Dompdf;

function styleArrayToString(array $styles = []): string {
    $styleString = '';
    foreach ($styles as $key => $value) {
        $cssKey = str_replace('_', '-', $key);
        $styleString .= "$cssKey: $value; ";
    }
    return $styleString;
}

if (!isset($_GET['submission_id'])) {
    header("Content-Type: application/json");
    echo json_encode(["error" => "Missing submission_id"]);
    exit;
}
$submission_id = (int)$_GET['submission_id'];

$stmt = $conn->prepare("
    SELECT fs.submission_data, f.form_template, f.pages, g.group_template
    FROM form_submissions fs
    JOIN forms f ON fs.form_id = f.id
    JOIN groups g ON f.group_id = g.id
    WHERE fs.id = ?
");
$stmt->bind_param("i", $submission_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $submission_data = json_decode($row['submission_data'], true);
    $form_template = json_decode($row['form_template'], true);
    $pages = $row['pages'] ? json_decode($row['pages'], true) : [];
    $group_template = json_decode($row['group_template'], true);
    $form_title = $form_template['header'] ?? $form_template['title'] ?? 'Form Submission';
    $group_header = $group_template['header'] ?? '';

    $form_styles = $form_template['styles'] ?? [];
    $body_style = styleArrayToString($form_styles);

    $html = "<html><head><style>
    body { $body_style }
    table { width: 100%; border-collapse: collapse; }
    td { vertical-align: top; padding: 6px; }
    .field-label { width: 60%; font-weight: " . ($form_styles['label_font_weight'] ?? 'normal') . "; padding: " . ($form_styles['padding'] ?? '6px 5px') . "; }
    .field-value { width: 40%; padding: " . ($form_styles['padding'] ?? '6px 5px') . "; }
    .checkbox-yes { color: green; font-weight: bold; }
    .checkbox-no { color: red; font-weight: bold; }
    </style></head><body>";

    $html .= "<h1 style='text-align:center;'>" . htmlspecialchars($form_title) . "</h1>";
    $html .= "<h2 style='text-align:center;'>Group: " . htmlspecialchars($group_header) . "</h2>";

    if (is_array($pages) && count($pages) > 0) {
        foreach ($pages as $i => $page) {
            $page_style = isset($page['page_style']) ? styleArrayToString($page['page_style']) : '';
            $html .= "<h3 style='$page_style'>" . htmlspecialchars($page['title'] ?? ("Page " . ($i + 1))) . "</h3>";

            $html .= "<table border='0' cellpadding='0' cellspacing='0'>";
            foreach ($page['fields'] as $field) {
                $name = $field['name'];
                $label = $field['label'];
                $value = $submission_data[$name] ?? null;
                $field_style = isset($field['style']) ? styleArrayToString($field['style']) : '';

                if ($field['type'] === 'checkbox') {
                    if ($value) {
                        $value = "<span class='checkbox-yes' style='$field_style'>Yes</span>";
                    } else {
                        $value = "<span class='checkbox-no' style='$field_style'>No</span>";
                    }
                } elseif ($value === "" || $value === null) {
                    $value = "<i style='$field_style'>N/A</i>";
                } else {
                    $value = "<span style='$field_style'>" . htmlspecialchars((string)$value) . "</span>";
                }

                $html .= "<tr><td class='field-label' style='$field_style'>" . htmlspecialchars($label) . "</td><td class='field-value'>$value</td></tr>";
            }
            $html .= "</table>";

            if ($i !== count($pages) - 1) {
                $html .= "<div style='page-break-after: always;'></div>";
            }
        }
    } else if (is_array($form_template['fields'] ?? null)) {
        $html .= "<table border='0' cellpadding='0' cellspacing='0'>";
        foreach ($form_template['fields'] as $field) {
            $name = $field['name'];
            $label = $field['label'];
            $value = $submission_data[$name] ?? null;
            $field_style = isset($field['style']) ? styleArrayToString($field['style']) : '';

            if ($field['type'] === 'checkbox') {
                if ($value) {
                    $value = "<span class='checkbox-yes' style='$field_style'>Yes</span>";
                } else {
                    $value = "<span class='checkbox-no' style='$field_style'>No</span>";
                }
            } elseif ($value === "" || $value === null) {
                $value = "<i style='$field_style'>N/A</i>";
            } else {
                $value = "<span style='$field_style'>" . htmlspecialchars((string)$value) . "</span>";
            }

            $html .= "<tr><td class='field-label' style='$field_style'>" . htmlspecialchars($label) . "</td><td class='field-value'>$value</td></tr>";
        }
        $html .= "</table>";
    }

    if (!empty($form_template['footer'])) {
        $html .= "<p><b>Note:</b> " . htmlspecialchars($form_template['footer']) . "</p>";
    }

    $html .= "</body></html>";

    $dompdf = new Dompdf();
    $dompdf->loadHtml($html);
    $dompdf->setPaper('A4');
    $dompdf->render();

    $canvas = $dompdf->getCanvas();
    $font = $dompdf->getFontMetrics()->getFont('Helvetica', 'normal');
    $footerText = "Page {PAGE_NUM} of {PAGE_COUNT}";
    $fontSize = 10;
    $y = $canvas->get_height() - 30;
    $x = $canvas->get_width() - 100;
    $canvas->page_text($x, $y, $footerText, $font, $fontSize, array(0,0,0));

    $dompdf->stream("submission_$submission_id.pdf", ["Attachment" => false]);
    exit;
} else {
    header("Content-Type: application/json");
    echo json_encode(["error" => "Submission not found"]);
}

$stmt->close();
$conn->close();

?>
