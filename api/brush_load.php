<?php

ini_set('session.cookie_httponly', 1);
session_start();

header('Content-Type: application/json');

require_once("../system/config.php");

// =====================================================
// PARAMETER EMPFANGEN
// =====================================================

$members_id = $_GET['members_id'] ?? null;
$date_from  = $_GET['date_from']  ?? null;
$date_to    = $_GET['date_to']    ?? null;

if (!$members_id || !$date_from || !$date_to) {
    echo json_encode([
        "status"  => "error",
        "message" => "Missing parameters"
    ]);
    exit;
}

// =====================================================
// DATEN LADEN
// =====================================================

try {

    $stmt = $pdo->prepare("
        SELECT
            DATE(datetime) AS tag,
            LEAST(SUM(fulfilled), 6) AS punkte
        FROM brush_data
        WHERE members_id = :members_id
            AND DATE(datetime) BETWEEN :date_from AND :date_to
        GROUP BY DATE(datetime)
        ORDER BY DATE(datetime) ASC
    ");

    $stmt->execute([
        ':members_id' => $members_id,
        ':date_from'  => $date_from,
        ':date_to'    => $date_to,
    ]);

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data"   => $rows
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status"  => "error",
        "message" => $e->getMessage()
    ]);
}
?>