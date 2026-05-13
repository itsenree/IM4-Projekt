<?php
// members.php
header('Content-Type: application/json');

require_once '../system/config.php';

$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
$pdo = new PDO($dsn, $user, $pass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Query all data from the members table
        $stmt = $pdo->query("SELECT * FROM members");
        $members = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Return the data as JSON
        echo json_encode(["status" => "success", "data" => $members]);
    } catch (PDOException $e) {
        // Return error as JSON
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database error", "details" => $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $name = trim($data['name'] ?? '');
    $brush_nr = trim($data['brush_nr'] ?? '');
    $color = trim($data['color'] ?? '');

    if (!$name || !$brush_nr || !$color) {
        echo json_encode(["status" => "error", "message" => "All fields are required."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO members (name, brush_nr, color) VALUES (:name, :brush_nr, :color)");
        $stmt->execute([
            ':name' => $name,
            ':brush_nr' => $brush_nr,
            ':color' => $color
        ]);

        echo json_encode(["status" => "success", "message" => "Member saved successfully."]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Database error.", "details" => $e->getMessage()]);
    }
} else {
    // Invalid request method
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
?>