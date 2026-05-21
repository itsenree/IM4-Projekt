<?php

// Include database configuration
require_once '../system/config.php';

// Connect to the database
$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
$pdo = new PDO($dsn, $user, $pass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Get the JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Extract variables from the input
$member_id = $data['member_id'] ?? null;
$new_name = $data['name'] ?? null;
$new_color = $data['color'] ?? null;
$new_brush_nr = $data['brush_nr'] ?? null;

// Validate input
if (!$member_id || !$new_name || !$new_color || $new_brush_nr === null) {
    echo json_encode(["success" => false, "message" => "Invalid input data."]);
    exit;
}

try {
    // Update query
    $sql = "UPDATE members SET name = :name, color = :color, brush_nr = :brush_nr WHERE id = :id";
    $stmt = $pdo->prepare($sql);

    // Bind parameters
    $stmt->bindParam(':name', $new_name);
    $stmt->bindParam(':color', $new_color);
    $stmt->bindParam(':brush_nr', $new_brush_nr);
    $stmt->bindParam(':id', $member_id);

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Member updated successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update member."]);
    }
} catch (PDOException $e) {
    // Handle database errors
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

?>