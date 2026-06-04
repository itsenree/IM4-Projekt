<?php
// logout.php
session_start();

// Session-Daten löschen und Session beenden
$_SESSION = [];
session_destroy();

// Erfolg zurückgeben
header('Content-Type: application/json');
echo json_encode(["status" => "success"]);
exit;
?>