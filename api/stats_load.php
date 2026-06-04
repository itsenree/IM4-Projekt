<?php
ini_set('session.cookie_httponly', 1);
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../system/config.php';

// Zeitraum aus GET-Parameter lesen, Standard: 'woche'
$zeitraum  = $_GET['zeitraum'] ?? 'woche';
$members_id = $_SESSION['members_id'] ?? 1; // TODO: Fallback auf 1 entfernen, sobald Auth steht

// Zeitraum in Anzahl Tage umrechnen
$tage = match($zeitraum) {
    'woche' => 7,
    'monat' => 30,
    default => null
};

if (!$tage) {
    echo json_encode(["status" => "error", "message" => "Ungültiger Zeitraum"]);
    exit;
}

try {
    // Pro Tag: Gesamtputzdauer (in Sekunden) und Anzahl Einträge abfragen
    $stmt = $pdo->prepare("
    SELECT
        DATE(datetime)                     AS tag,
        SUM(TIME_TO_SEC(duration))         AS gesamtdauer,
        COUNT(*)                           AS erfuellt        -- einfach alle Einträge zählen
    FROM brush_data
    WHERE DATE(datetime) >= CURDATE() - INTERVAL :tage DAY   -- DATE() vergleichen!
        AND members_id = :members_id
    GROUP BY DATE(datetime)
    ORDER BY tag ASC
    ");

    $stmt->execute([':tage' => $tage, ':members_id' => $members_id]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Ergebnis-Array mit allen Tagen vorbefüllen (Tage ohne Einträge bekommen 0)
    $result = [];
    for ($i = $tage - 1; $i >= 0; $i--) {
        $datum = date('Y-m-d', strtotime("-$i days"));
        $result[$datum] = [
            'label'       => date('d.m.', strtotime("-$i days")),
            'gesamtdauer' => 0,
            'erfuellt'    => 0,
        ];
    }

    // Datenbankwerte in die vorbereiteten Tages-Slots eintragen
    foreach ($rows as $row) {
        if (isset($result[$row['tag']])) {
            $result[$row['tag']]['gesamtdauer'] = (int) $row['gesamtdauer'];
            $result[$row['tag']]['erfuellt']    = (int) $row['erfuellt'];
        }
    }

    $values = array_values($result);

    echo json_encode([
        "status"       => "success",
        "labels"       => array_column($values, 'label'),
        "gesamtdauer"  => array_column($values, 'gesamtdauer'),
        "erfuellt"     => array_column($values, 'erfuellt'),
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>