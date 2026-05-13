<?php
// members_load.php
header('Content-Type: application/json');

require_once '../system/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Connect to the database
        $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

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
} else {
    // Invalid request method
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
?>