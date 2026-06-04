<?php
session_start();
header('Content-Type: application/json');

require_once '../system/config.php';

// Zugriff nur für eingeloggte Benutzer
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

$userId = (int) $_SESSION['user_id'];

// GET: Aktuelle Benutzerdaten zurückgeben
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->prepare("SELECT id, username, email FROM users WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "User not found"]);
            exit;
        }

        echo json_encode([
            "status" => "success",
            "data" => $user
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Database error",
            "details" => $e->getMessage()
        ]);
    }
    exit;
}

// POST: Einzelnes Benutzerfeld aktualisieren (username, email oder password)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $field = $data['field'] ?? '';
    $value = trim($data['value'] ?? '');

    // Nur erlaubte Felder akzeptieren
    if (!in_array($field, ['username', 'email', 'password'], true)) {
        echo json_encode(["status" => "error", "message" => "Invalid field"]);
        exit;
    }

    if ($value === '') {
        echo json_encode(["status" => "error", "message" => "Empty value is not allowed"]);
        exit;
    }

    try {
        if ($field === 'username') {

             // Maximallänge prüfen
            if (mb_strlen($value) > 20) {
                echo json_encode(["status" => "error", "message" => "Der nutzername darf nicht mehr als 20 Zeichen lang sein"]);
                exit;
            }

            // Eindeutigkeit prüfen (anderer User darf den Namen nicht bereits haben)
            $stmt = $pdo->prepare("SELECT id FROM users WHERE username = :username AND id <> :id LIMIT 1");
            $stmt->execute([
                ':username' => $value,
                ':id' => $userId
            ]);

            if ($stmt->fetch()) {
                echo json_encode(["status" => "error", "message" => "Username is already in use"]);
                exit;
            }

            $stmt = $pdo->prepare("UPDATE users SET username = :value WHERE id = :id");
            $stmt->execute([
                ':value' => $value,
                ':id' => $userId
            ]);

            $_SESSION['username'] = $value; // Session aktualisieren
        } elseif ($field === 'email') {
            // E-Mail-Format validieren
            if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                echo json_encode(["status" => "error", "message" => "Invalid email address"]);
                exit;
            }

            // Eindeutigkeit prüfen
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email AND id <> :id LIMIT 1");
            $stmt->execute([
                ':email' => $value,
                ':id' => $userId
            ]);

            if ($stmt->fetch()) {
                echo json_encode(["status" => "error", "message" => "Email is already in use"]);
                exit;
            }

            $stmt = $pdo->prepare("UPDATE users SET email = :value WHERE id = :id");
            $stmt->execute([
                ':value' => $value,
                ':id' => $userId
            ]);

            $_SESSION['email'] = $value; // Session aktualisieren
        } elseif ($field === 'password') {
            // Passwort hashen (bcrypt via PASSWORD_DEFAULT) und speichern
            // Hinweis: Kein Mindestlängen- oder Komplexitätscheck vorhanden
            $hashedPassword = password_hash($value, PASSWORD_DEFAULT);

            $stmt = $pdo->prepare("UPDATE users SET password = :value WHERE id = :id");
            $stmt->execute([
                ':value' => $hashedPassword,
                ':id' => $userId
            ]);
        }

        echo json_encode([
            "status" => "success",
            "message" => "Settings updated successfully"
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Database error",
            "details" => $e->getMessage()
        ]);
    }
    exit;
}

echo json_encode(["status" => "error", "message" => "Invalid request method"]);
