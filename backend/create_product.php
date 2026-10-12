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

    if (!empty($data->name) && !empty($data->category) && isset($data->price)) {
        $query = "INSERT INTO products (name, category, price, description, text_engraving_price, image_engraving_price, stock, image_url) 
                  VALUES (:name, :category, :price, :description, :text_engraving_price, :image_engraving_price, :stock, :image_url)";

        $stmt = $conn->prepare($query);

        $description = $data->description ?? '';
        $text_engraving_price = $data->text_engraving_price ?? 0.00;
        $image_engraving_price = $data->image_engraving_price ?? 0.00;
        $stock = $data->stock ?? 0;
        $image_url = $data->image_url ?? '';

        $stmt->bindParam(":name", $data->name);
        $stmt->bindParam(":category", $data->category);
        $stmt->bindParam(":price", $data->price);
        $stmt->bindParam(":description", $description);
        $stmt->bindParam(":text_engraving_price", $text_engraving_price);
        $stmt->bindParam(":image_engraving_price", $image_engraving_price);
        $stmt->bindParam(":stock", $stock);
        $stmt->bindParam(":image_url", $image_url);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "Produs creat cu succes!"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Eroare la inserarea produsului."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Date incomplete. Câmpurile name, category și price sunt obligatorii."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>