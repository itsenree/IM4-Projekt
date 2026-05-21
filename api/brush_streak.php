<?php

ini_set('session.cookie_httponly', 1);
session_start();

header('Content-Type: application/json');

require_once("../system/config.php");

$members_id = $_GET['members_id'] ?? null;

if (!$members_id) {
    echo json_encode(["status" => "error", "message" => "Missing parameters"]);
    exit;
}

try {

    // Alle Tage laden, an denen mindestens 1 Eintrag existiert
    $stmt = $pdo->prepare("
        SELECT DATE(datetime) AS tag
        FROM brush_data
        WHERE members_id = :members_id
        GROUP BY DATE(datetime)
        ORDER BY DATE(datetime) DESC
    ");

    $stmt->execute([':members_id' => $members_id]);
    $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Streak zählen: von heute rückwärts lückenlos
    $streak = 0;
    $check = new DateTime('today');

    foreach ($rows as $tag) {
        $tagDate = new DateTime($tag);
        if ($tagDate == $check) {
            $streak++;
            $check->modify('-1 day');
        } else {
            break;
        }
    }

    echo json_encode(["status" => "success", "streak" => $streak]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>