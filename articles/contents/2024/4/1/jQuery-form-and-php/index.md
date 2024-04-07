## 使用HTML form與PHP交互

### PHP範例
```php
<?php
if(!$_SERVER['REQUEST_METHOD'] == 'POST'){
    echo 'please use post method';
    exit;
}

$username = $_POST['username'];
$password = $_POST['password'];

echo "<p>username:$username</p>";
echo "<p>password:$password</p>";
```

### HTML範例

<iframe src="{{curFolderPath}}/index.html" width="100%" height="300px"></iframe>

