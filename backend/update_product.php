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

    if (!empty($data->id) && !empty($data->name) && isset($data->price)) {
        $query = "UPDATE products SET 
                    name = :name, 
                    category = :category, 
                    price = :price, 
                    description = :description, 
                    text_engraving_price = :text_engraving_price, 
                    image_engraving_price = :image_engraving_price, 
                    stock = :stock,
                    image_url = :image_url
                  WHERE id = :id";

        $stmt = $conn->prepare($query);

        $stmt->bindParam(":id", $data->id);
        $stmt->bindParam(":name", $data->name);
        $stmt->bindParam(":category", $data->category);
        $stmt->bindParam(":price", $data->price);
        $stmt->bindParam(":description", $data->description);
        $stmt->bindParam(":text_engraving_price", $data->text_engraving_price);
        $stmt->bindParam(":image_engraving_price", $data->image_engraving_price);
        $stmt->bindParam(":stock", $data->stock);
        $stmt->bindParam(":image_url", $data->image_url);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Produsul a fost actualizat cu succes!"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Eroare la actualizarea produsului."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Date incomplete pentru actualizare."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>