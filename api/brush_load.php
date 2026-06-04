<?php

ini_set('session.cookie_httponly', 1);
session_start();

header('Content-Type: application/json');

require_once("../system/config.php");

// =====================================================
// PARAMETER EMPFANGEN
// =====================================================

// members_id und Datumsbereich aus GET-Parametern lesen
$members_id = $_GET['members_id'] ?? null;
$date_from  = $_GET['date_from']  ?? null;
$date_to    = $_GET['date_to']    ?? null;

// Abbrechen, falls ein Parameter fehlt
if (!$members_id || !$date_from || !$date_to) {
    echo json_encode([
        "status"  => "error",
        "message" => "Missing parameters"
    ]);
    exit;
}

// =====================================================
// DATEN LADEN
// (brush_data wird mit bd abgekürzt)
// =====================================================

try {
    // Punkte pro Tag laden -> maximal 6 Punkte pro Tag
    $stmt = $pdo->prepare("
        SELECT
            DATE(bd.datetime) AS tag,
            LEAST(SUM(bd.fulfilled), 6) AS punkte
        FROM brush_data bd
        JOIN members m ON m.id = :members_id
        WHERE bd.members_id = :members_id
            AND bd.position = m.brush_nr
            AND DATE(bd.datetime) BETWEEN :date_from AND :date_to
        GROUP BY DATE(bd.datetime)
        ORDER BY DATE(bd.datetime) ASC
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