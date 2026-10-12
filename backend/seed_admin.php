<?php
$host = "localhost";
$db_name = "app_db";
$username = "admin_user";
$password = "1234";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $admins = [
        [
            "name" => "Administrator",
            "email" => "admin@mastercraft.ro",
            "password" => "admin123"
        ],
        [
            "name" => "Andra Admin",
            "email" => "andra@mastercraft.ro",
            "password" => "parola_ta_aici"
        ]
    ];

    $role = "admin";
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) 
                            VALUES (:name, :email, :password, :role) 
                            ON DUPLICATE KEY UPDATE password = :password, role = :role");

    foreach ($admins as $adm) {
        $hashed_pass = password_hash($adm['password'], PASSWORD_BCRYPT);

        $stmt->bindParam(":name", $adm['name']);
        $stmt->bindParam(":email", $adm['email']);
        $stmt->bindParam(":password", $hashed_pass);
        $stmt->bindParam(":role", $role);

        $stmt->execute();
        echo "Admin {$adm['email']} salvat/actualizat cu succes!\n";
    }

} catch (PDOException $e) {
    echo "Eroare: " . $e->getMessage() . "\n";
}
?>