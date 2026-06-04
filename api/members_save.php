<?php
// members_save.php
header('Content-Type: application/json');

require_once '../system/config.php';
// Datenbankverbindung aufbauen
$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
$pdo = new PDO($dsn, $user, $pass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Alle Members aus der Datenbank laden
        $stmt = $pdo->query("SELECT * FROM members");
        $members = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Daten als JSON zurückgeben
        echo json_encode(["status" => "success", "data" => $members]);
    } catch (PDOException $e) {
        // Fehler als JSON zurückgeben
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database error", "details" => $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Neuen Member aus dem Request-Body lesen    
    $data = json_decode(file_get_contents('php://input'), true);

    $name = trim($data['name'] ?? '');
    $brush_nr = trim($data['brush_nr'] ?? '');
    $color = trim($data['color'] ?? '');

    // Abbrechen, falls ein Feld fehlt
    if (!$name || !$brush_nr || !$color) {
        echo json_encode(["status" => "error", "message" => "All fields are required."]);
        exit;
    }

    try {
        // Neuen Member in die Datenbank einfügen
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