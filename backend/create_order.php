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

    if (!empty($data->user_id) && !empty($data->items) && is_array($data->items)) {
        $conn->beginTransaction();

        $total_price = floatval($data->total_price ?? 0);
        $shipping_address = $data->shipping_address ?? 'Adresa nespecificata';

        // 1. Inserare comanda principala
        $orderStmt = $conn->prepare("INSERT INTO orders (user_id, total_price, status, shipping_address) VALUES (:user_id, :total_price, 'Pending', :shipping_address)");
        $orderStmt->bindParam(":user_id", $data->user_id);
        $orderStmt->bindParam(":total_price", $total_price);
        $orderStmt->bindParam(":shipping_address", $shipping_address);
        $orderStmt->execute();

        $order_id = $conn->lastInsertId();

        // 2. Inserare produse comandate
        $itemStmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, unit_price, customization) VALUES (:order_id, :product_id, :quantity, :unit_price, :customization)");

        foreach ($data->items as $item) {
            $itemStmt->bindParam(":order_id", $order_id);
            $itemStmt->bindParam(":product_id", $item->id);
            $itemStmt->bindParam(":quantity", $item->quantity);
            $itemStmt->bindParam(":unit_price", $item->price);
            $customization = $item->customization ?? '';
            $itemStmt->bindParam(":customization", $customization);
            $itemStmt->execute();
        }

        $conn->commit();

        http_response_code(201);
        echo json_encode(["status" => "success", "message" => "Comanda plasata cu succes!", "order_id" => $order_id]);
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Date incomplete pentru plasarea comenzii."]);
    }
} catch (PDOException $e) {
    if ($conn && $conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>