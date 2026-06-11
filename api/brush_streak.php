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
        WHERE bd.members_id = :members_id
        GROUP BY DATE(bd.datetime)
        HAVING LEAST(SUM(bd.fulfilled), 6) >= 6
        ORDER BY DATE(bd.datetime) DESC
    ");

    $stmt->execute([':members_id' => $members_id]);
    $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $completedDays = array_fill_keys($rows, true);

    $countStreakFrom = function (DateTime $startDate) use ($completedDays) {
        $streak = 0;
        $check = clone $startDate;

        while (isset($completedDays[$check->format('Y-m-d')])) {
            $streak++;
            $check->modify('-1 day');
        }

        return $streak;
    };

    $today = new DateTime('today');
    $todayKey = $today->format('Y-m-d');
    $todayReached = isset($completedDays[$todayKey]);

    if ($todayReached) {
        $streak = $countStreakFrom($today);
        $message = '';
    } else {
        $streak = $countStreakFrom(new DateTime('yesterday'));
        $message = 'Heute wurde der Streak noch nicht erreicht (6 Punkte nötig!)';
    }

    echo json_encode([
        "status" => "success",
        "streak" => $streak,
        "todayReached" => $todayReached,
        "message" => $message,
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>