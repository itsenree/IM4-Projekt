<?php

ini_set('session.cookie_httponly', 1);
session_start();

header('Content-Type: application/json');

require_once("../system/config.php");


// =====================================================
// JSON EMPFANGEN
// =====================================================

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);


// =====================================================
// WERTE AUS JSON
// =====================================================

$position   = $input["position"] ?? null;
$datetime   = $input["datetime"] ?? null;
$duration   = $input["duration"] ?? null;
$fulfilled  = $input["fulfilled"] ?? null;


// =====================================================
// PRÜFEN
// =====================================================

if (
    $position === null ||
    $datetime === null ||
    $duration === null ||
    $fulfilled === null
) {

    echo json_encode([
        "status" => "error",
        "message" => "Missing parameters"
    ]);

    exit;
}


// =====================================================
// MEMBER ÜBER brush_nr SUCHEN
// =====================================================

try {

    $stmt = $pdo->prepare("
        SELECT id
        FROM members
        WHERE brush_nr = :brush_nr
        LIMIT 1
    ");

    $stmt->execute([
        ':brush_nr' => $position
    ]);

    $member = $stmt->fetch(PDO::FETCH_ASSOC);

    // ================================================
    // KEIN MEMBER GEFUNDEN
    // ================================================

    if (!$member) {

        echo json_encode([
            "status" => "error",
            "message" => "No member found for brush_nr"
        ]);

        exit;
    }

    $members_id = $member['id'];


    // ================================================
    // INSERT
    // ================================================

    $stmt = $pdo->prepare("
        INSERT INTO brush_data
        (
            position,
            datetime,
            duration,
            fulfilled,
            members_id
        )
        VALUES
        (
            :position,
            :datetime,
            :duration,
            :fulfilled,
            :members_id
        )
    ");

    $stmt->execute([
        ':position'   => $position,
        ':datetime'   => $datetime,
        ':duration'   => $duration,
        ':fulfilled'  => $fulfilled,
        ':members_id' => $members_id
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Data saved successfully"
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>