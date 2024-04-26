# [Ubuntu 22.04] 部署前端 Vue.js、後端 PHP

要部署前端 Vue.js 和後端 PHP，
需要將專案檔案上傳至伺服器，
上傳方式可使用 github、ftp 等。

>參考文章： <a data-article-id="20240411-ubuntu-install-ftp"></a>
參考文章： <a data-article-id="20240411-ubuntu-install-git"></a>


## 部署 PHP

### 1. 上傳 PHP 檔案

使用github clone 或 ftp，
將後端php檔案複製到 `/var/www/your_folder_name` 底下。

### 2. 配置 Nginx

接著我們需要新增一個 nginx 虛擬主機，
在 `/etc/nginx/sites-available/` 目錄底下建立一個檔案，
名稱即為上個步驟中的 `your_folder_name`：

>※ 在上個步驟中複製的資料夾為 `/var/www/backend`，在此步驟中則要建立 `/etc/nginx/sites-available/backend`

```bash
nano /etc/nginx/sites-available/your_folder_name
```

接著貼上以下配置，
設置入口為 `/var/www/your_folder_name`，
由於我們只有一個 IP，
為了不與前端專案的 port 衝突，
因此將 Port 設置為 8888，
```bash
server {
        listen 8888;

        root /var/www/your_folder_name;

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
```bash
sudo ln -s /etc/nginx/sites-available/your_folder_name /etc/nginx/sites-enabled/
```

接著使用 `sudo nginx -t` 檢查設定檔格式有沒有錯誤，
如果顯示以下文字表示設定檔格式沒有錯誤：

```bash
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

最後重啟 nginx 服務：
```bash
sudo systemctl reload nginx
```


將 `/var/www/your_folder_name` 的**資料夾以及底下所有檔案**，的權限設定至少為 **755**，請執行以下指令變更檔案權限</font>

```bash
sudo chmod 755 /var/www/your_folder_name -R
```



## 部署前端 Vue.js

### 1. 上傳打包後的檔案

使用github clone 或 ftp，
將打包後的檔案複製到 `/var/www/your_folder_name` 底下。

### 2. 配置 Nginx

新增一個 nginx 虛擬主機，
在 `/etc/nginx/sites-available/` 目錄底下建立一個檔案，
名稱即為上個步驟中的 `your_folder_name`：

>※ 在上個步驟中複製的資料夾為 `/var/www/frontend`，在此步驟中則要建立 `/etc/nginx/sites-available/frontend`

```bash
nano /etc/nginx/sites-available/your_folder_name
```

接著貼上以下配置，設置入口為 `/var/www/your_folder_name`：
```bash
server {
        listen 80 default_server;

        root /var/www/your_folder_name;

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

`listen 80 default_server;` 這個設定值的 `default_server` 表示做為 nginx 的預設伺服器，
而 nginx 預設是以 `/etc/nginx/sites-enabled/default` 做為預設伺服器，
因此我們要刪除 `/etc/nginx/sites-enabled/default` 此檔案，
才能避免預設伺服器衝突，
執行以下指令來刪除軟連結：



```bash
sudo rm /etc/nginx/sites-enabled/default
```

建立軟連結，將檔案同步到sites-enabled：
```bash
sudo ln -s /etc/nginx/sites-available/your_folder_name /etc/nginx/sites-enabled/
```

接著使用 `sudo nginx -t` 檢查設定檔格式有沒有錯誤。
最後使用 `sudo systemctl reload nginx` 重啟服務。

將 `/var/www/your_folder_name` 的**資料夾以及底下所有檔案**，的權限設定至少為 **755**，請執行以下指令變更檔案權限</font>

```bash
sudo chmod 755 /var/www/your_folder_name -R
```

這樣便已經部署完前端後端， `http://your_IP/` 為你的前端網址， `http://your_IP:8888` 為你的後端網址