<?php
// brush_save.php
ini_set('session.cookie_httponly', 1);
// ini_set('session.cookie_secure', 1); // if using HTTPS
session_start();
header('Content-Type: application/json');

require_once '../system/config.php'; // Import database connection

// Retrieve data from GET request
$position = $_GET['position'] ?? null;
$datetime = $_GET['datetime'] ?? null;
$duration = $_GET['duration'] ?? null;
$fulfilled = $_GET['fulfilled'] ?? null;

// Placeholder for member ID
$members_id = 1;

if ($position && $datetime && $duration && $fulfilled) {
    try {
        // Insert data into the brush_data table
        $stmt = $pdo->prepare("INSERT INTO brush_data (position, datetime, duration, fulfilled, members_id) VALUES (:position, :datetime, :duration, :fulfilled, :members_id)");
        $stmt->bindParam(':position', $position, PDO::PARAM_INT);
        $stmt->bindParam(':datetime', $datetime, PDO::PARAM_STR);
        $stmt->bindParam(':duration', $duration, PDO::PARAM_INT);
        $stmt->bindParam(':fulfilled', $fulfilled, PDO::PARAM_BOOL);
        $stmt->bindParam(':members_id', $members_id, PDO::PARAM_INT);

        $stmt->execute();

        echo json_encode(["status" => "success", "message" => "Data saved successfully"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to save data: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Missing one or more parameters."]);
}

// ---------------- TO DO ----------------
// 1. Check if Data has the correct type/doesnt have any problems
// 2. Check Database 'members' for the brush_nr = the position
//    --> Then select the id of the member with the corresponding brush_nr
// 3. Add members_id (fk) to rest of Data & Save all Data into DB

?>