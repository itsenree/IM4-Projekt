<?php
// members_load.php
header('Content-Type: application/json');

require_once '../system/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Datenbankverbindung aufbauen
        $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

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
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
?>