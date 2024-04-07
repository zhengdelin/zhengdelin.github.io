<?php
if(!$_SERVER['REQUEST_METHOD'] == 'POST'){
    echo 'please use post method';
    exit;
}


$username = $_POST['username'];
$password = $_POST['password'];

echo "<p>username:$username</p>";
echo "<p>password:$password</p>";