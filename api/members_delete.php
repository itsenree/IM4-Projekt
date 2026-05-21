<?php
header('Content-Type: application/json');

require_once '../system/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['id']);

try {
    $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("DELETE FROM members WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(["status" => "success"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error", "details" => $e->getMessage()]);
}
?>