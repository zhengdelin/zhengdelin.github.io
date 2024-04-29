<?php

$account = $_POST['account'];
$pwd = $_POST['password'];

if ($account != "admin" || $pwd != "1234") {
    // 401
    http_response_code(401);
    echo "帳號或密碼錯誤";
    exit;
}

// 讀取所有內容
$fileContents = file_get_contents("./orders.json");

// 回傳資料
echo $fileContents;