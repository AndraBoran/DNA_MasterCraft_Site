<?php
$host = "localhost";
$db_name = "app_db";
$username = "admin_user";
$password = "1234";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $name = "Administrator";
    $email = "admin@mastercraft.ro";
    $raw_pass = "admin123";
    $hashed_pass = password_hash($raw_pass, PASSWORD_BCRYPT);
    $role = "admin";

    $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) 
                            VALUES (:name, :email, :password, :role) 
                            ON DUPLICATE KEY UPDATE password = :password, role = :role");

    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":password", $hashed_pass);
    $stmt->bindParam(":role", $role);

    $stmt->execute();
    echo "Contul admin creat/actualizat cu succes!\n";
} catch (PDOException $e) {
    echo "Eroare: " . $e->getMessage() . "\n";
}
?>