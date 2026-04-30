<?php 

session_start();
header("Content-Type: application/json");

require_once('../system/config.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // hier wollen wir die Variablen entpacken 

    // entpacke die Daten
    $data = json_decode(file_get_contents("php://input"), true);


    $email = $data['email'];
    $password = $data['password'];


    // checken, ob der User*die User*in bereits registriert ist
    $stmt = $pdo->prepare("SELECT email FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    if ($stmt->fetch()) {
        echo json_encode([
            "status" => "error",
            "message"=> "Email is already registered"

        ]);
        exit;
    }



    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $insert = $pdo->prepare("INSERT into users(email, password) VALUES (:email, :pass)");
    $insert->execute([
        ':email' => $email,
        ':pass' => $hashedPassword 
    ]);

// an JS zurückschicken
echo json_encode([
    "statsus" => "success",
    "email" => $email
]);

}
?>