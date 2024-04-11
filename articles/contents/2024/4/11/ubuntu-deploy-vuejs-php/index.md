# [Ubuntu 22.04] 部署前端 Vue.js、後端 PHP

要部署前端 Vue.js 和後端 PHP，
需要將專案檔案上傳至伺服器，
上傳方式可使用 github、ftp等。

>參考文章： <a data-article-id="ubuntu-install-ftp"></a>
參考文章： <a data-article-id="ubuntu-install-git"></a>


## 部署 PHP

### 1. 上傳 PHP 檔案

使用github clone 或 ftp，
將後端php檔案複製到 `/var/www/your_folder_name` 底下

### 2. 配置 Nginx

接著我們需要新增一個 nginx 虛擬主機，
在 `/etc/nginx/sites-available/` 目錄底下建立一個檔案，
名稱即為上個步驟中的 `your_folder_name`，
以下會以 /var/www/backend 做為範例，
新建一個 /var/www/backend 相對應的 nginx 虛擬主機配置：

```shell
nano /etc/nginx/sites-available/backend
```

接著貼上以下配置，
設置入口為 /var/www/backend，
由於我們只有一個 IP，
為了不與前端專案的 port 衝突，
因此將 Port 設置為 8888，
```shell
server {
        listen 8888;

        root /var/www/backend;

        index index.html index.htm index.php index.nginx-debian.html;

        server_name _;

        location / {
                try_files $uri $uri/ =404;
        }

        location ~ \.php$ {
                include snippets/fastcgi-php.conf;
                fastcgi_pass unix:/run/php/php8.1-fpm.sock;
        }

        location ~ /\.ht {
            deny all;
        }
}
```

建立軟連結，將檔案同步到 sites-enabled
```
sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/
```

接著使用 `sudo nginx -t` 檢查設定檔格式有沒有錯誤，
如果顯示以下文字表示設定檔格式沒有錯誤：

```shell
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

最後重啟 nginx 服務：
```shell
sudo systemctl reload nginx
```

## 部署前端 Vue.js

### 1. 上傳打包後的檔案

使用github clone 或 ftp，
將打包後的檔案複製到 `/var/www/your_folder_name` 底下。

### 2. 配置 Nginx

新增一個 nginx 虛擬主機，
在 `/etc/nginx/sites-available/` 目錄底下建立一個檔案，
以下會以 /var/www/frontend 為例：

```shell
nano /etc/nginx/sites-available/backend
```

接著貼上以下配置，設置入口為 /var/www/frontend：
```shell
server {
        listen 80;

        root /var/www/frontend;

        index index.html index.htm index.php index.nginx-debian.html;

        server_name _;

        location / {
                try_files $uri $uri/ =404;
        }

        location ~ \.php$ {
                include snippets/fastcgi-php.conf;
                fastcgi_pass unix:/run/php/php8.1-fpm.sock;
        }

        location ~ /\.ht {
            deny all;
        }
}
```

建立軟連結，將檔案同步到sites-enabled：
```shell
sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
```

接著使用 `sudo nginx -t` 檢查設定檔格式有沒有錯誤。

由於這個虛擬主機要作為nginx的 default server，
因此我們要刪除 sites-enables 中的 default：

```shell
sudo rm /etc/nginx/sites-enabled/default
```

最後使用 `sudo systemctl reload nginx` 重啟服務。


