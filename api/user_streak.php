<?php

ini_set('session.cookie_httponly', 1);
session_start();

header('Content-Type: application/json');

require_once("../system/config.php");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Not logged in"]);
    exit;
}

$users_id = $_SESSION['user_id'];

try {

    // Member des eingeloggten Users laden
    $stmt = $pdo->prepare("
        SELECT id FROM members WHERE users_id = :users_id LIMIT 1
    ");
    $stmt->execute([':users_id' => $users_id]);
    $member = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$member) {
        echo json_encode(["status" => "error", "message" => "No member found"]);
        exit;
    }

    $members_id = $member['id'];

    // Streak berechnen (gleiche Logik wie brush_streak.php)
    $stmt2 = $pdo->prepare("
        SELECT DATE(bd.datetime) AS tag
        FROM brush_data bd
        JOIN members m ON m.id = :members_id
        WHERE bd.members_id = :members_id
            AND bd.position = m.brush_nr
        GROUP BY DATE(bd.datetime)
        ORDER BY DATE(bd.datetime) DESC
    ");

    $stmt2->execute([':members_id' => $members_id]);
    $tage = $stmt2->fetchAll(PDO::FETCH_COLUMN);

    $streak = 0;
    $check = new DateTime('today');

    foreach ($tage as $tag) {
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