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

    // Automatisch Member mit der ersten freien Position 1-3 erstellen
    $memberBrushNr = 0;
    $positionCheck = $pdo->prepare("SELECT COUNT(*) FROM members WHERE brush_nr = :brush_nr");
    $memberColors = ['yellow', 'red', 'purple', 'green', 'blue', 'pink'];
    $memberColor = $memberColors[array_rand($memberColors)];

    for ($position = 1; $position <= 3; $position++) {
        $positionCheck->execute([':brush_nr' => $position]);

        if ((int)$positionCheck->fetchColumn() === 0) {
            $memberBrushNr = $position;
            break;
        }
    }

    $memberInsert = $pdo->prepare("INSERT INTO members (name, brush_nr, color) VALUES (:name, :brush_nr, :color)");
    $memberInsert->execute([
    ':name' => $username,
    ':brush_nr' => $memberBrushNr,
    ':color' => $memberColor,
    ]);

    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
