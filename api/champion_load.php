<?php

ini_set('session.cookie_httponly', 1);
session_start();

header('Content-Type: application/json');

require_once("../system/config.php");

try {

    // Champion laden
    $stmt = $pdo->prepare("
        SELECT
            m.id,
            m.name,
            COALESCE(SUM(LEAST(tages_punkte.punkte, 6)), 0) AS total_punkte
        FROM members m
        LEFT JOIN (
            SELECT
                bd.members_id,
                DATE(bd.datetime) AS tag,
                SUM(bd.fulfilled) AS punkte
            FROM brush_data bd
            JOIN members m2 ON m2.id = bd.members_id
            WHERE bd.position = m2.brush_nr
            GROUP BY bd.members_id, DATE(bd.datetime)
        ) AS tages_punkte ON tages_punkte.members_id = m.id
        GROUP BY m.id, m.name
        ORDER BY total_punkte DESC
        LIMIT 1
    ");

    $stmt->execute();
    $champion = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$champion) {
        echo json_encode(["status" => "error", "message" => "No data found"]);
        exit;
    }

    // Punkte aller Members laden
    $stmt2 = $pdo->query("
        SELECT
            m.name,
            COALESCE(SUM(LEAST(tages_punkte.punkte, 6)), 0) AS total_punkte
        FROM members m
        LEFT JOIN (
            SELECT
                bd.members_id,
                DATE(bd.datetime) AS tag,
                SUM(bd.fulfilled) AS punkte
            FROM brush_data bd
            JOIN members m2 ON m2.id = bd.members_id
            WHERE bd.position = m2.brush_nr
            GROUP BY bd.members_id, DATE(bd.datetime)
        ) AS tages_punkte ON tages_punkte.members_id = m.id
        GROUP BY m.id, m.name
        ORDER BY m.id ASC
    ");

    $allePunkte = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    // Alles in einem einzigen echo ausgeben
    echo json_encode([
        "status"     => "success",
        "name"       => $champion['name'],
        "punkte"     => (int) $champion['total_punkte'],
        "allePunkte" => $allePunkte,
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>