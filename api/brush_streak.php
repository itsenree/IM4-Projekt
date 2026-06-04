<?php

ini_set('session.cookie_httponly', 1);
session_start();

header('Content-Type: application/json');

require_once("../system/config.php");

// members_id aus GET-Parameter empfangen (wird vom Mikrocontroller aufgerufen)
$members_id = $_GET['members_id'] ?? null;

if (!$members_id) {
    echo json_encode(["status" => "error", "message" => "Missing parameters"]);
    exit;
}

try {

    // Nur Tage laden, an denen die maximale Tagespunktzahl (6) erreicht wurde
    $stmt = $pdo->prepare("
        SELECT DATE(bd.datetime) AS tag
        FROM brush_data bd
        JOIN members m ON m.id = :members_id
        WHERE bd.members_id = :members_id
            AND bd.position = m.brush_nr
        GROUP BY DATE(bd.datetime)
        HAVING LEAST(SUM(bd.fulfilled), 6) >= 6
        ORDER BY DATE(bd.datetime) DESC
    ");

    $stmt->execute([':members_id' => $members_id]);
    $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Streak zählen: von heute rückwärts, solange keine Lücke auftritt
    $streak = 0;
    $check = new DateTime('today');

    foreach ($rows as $tag) {
        $tagDate = new DateTime($tag);
        if ($tagDate == $check) {
            $streak++;
            $check->modify('-1 day');
        } else {
            break;  // Lücke gefunden – Streak ist zu Ende
        }
    }

    echo json_encode(["status" => "success", "streak" => $streak]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>