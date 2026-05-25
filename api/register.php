<?php
// register.php
session_start();
header('Content-Type: application/json');

require_once '../system/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    $username = trim($data['username'] ?? '');
    $email    = trim($data['email'] ?? '');
    $password = trim($data['password'] ?? '');

    if (!$username || !$email || !$password) {
        echo json_encode(["status" => "error", "message" => "Username, email and password are required"]);
        exit;
    }

    if (mb_strlen($username) > 20) {
        echo json_encode(["status" => "error", "message" => "Der nutzername darf nicht mehr als 20 Zeichen lang sein"]);
        exit;
    }

    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    if ($stmt->fetch()) {
        echo json_encode(["status" => "error", "message" => "Email is already in use"]);
        exit;
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert the new user
    $insert = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (:username, :email, :pass)");
    $insert->execute([
        ':username' => $username,
        ':email' => $email,
        ':pass'  => $hashedPassword
    ]);

    // Automatisch Member mit Position 1 erstellen
    $memberInsert = $pdo->prepare("INSERT INTO members (name, brush_nr, color) VALUES (:name, 1, 'green')");
    $memberInsert->execute([
    ':name' => $username,
    ]);

    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
