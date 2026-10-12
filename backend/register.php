<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$db_name = "app_db";
$username = "admin_user";
$password = "1234";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->name) && !empty($data->email) && !empty($data->password)) {
        $check = $conn->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
        $check->bindParam(":email", $data->email);
        $check->execute();

        if ($check->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Acest email este deja înregistrat."]);
            exit();
        }

        $hashed_password = password_hash($data->password, PASSWORD_BCRYPT);
        $role = "client";

        $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)");
        $stmt->bindParam(":name", $data->name);
        $stmt->bindParam(":email", $data->email);
        $stmt->bindParam(":password", $hashed_password);
        $stmt->bindParam(":role", $role);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "Cont creat cu succes."]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Eroare la crearea contului."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Toate câmpurile (nume, email, parolă) sunt obligatorii."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>