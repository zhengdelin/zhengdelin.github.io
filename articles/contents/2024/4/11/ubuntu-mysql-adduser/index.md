# [Ubuntu 22.04] Mysql 新增使用者並賦予讀取資料庫權限

首先先用指令連接到 mysql

```shell
mysql -u root -p
```

有需要的話，先新建一個資料庫

```shell
mysql> CREATE DATABASE your_database_name;
```


下一步是建立 Mysql 帳號
```shell
mysql> CREATE USER your_user_name@localhost IDENTIFIED BY 'your_password';
```

賦予使用者權限
```shell
GRANT ALL PRIVILEGES ON *.* TO your_user_name@localhost
```

CREATE USER u331286743_ity1@localhost IDENTIFIED BY 'T&%O&*XkxjL45c7W&m40'

<font color="red"> _※ 請確保 /var/www/frontend 及 /var/www/backend 的**資料夾以及底下所有檔案**，權限至少為**755**，如果沒有請執行以下指令變更檔案權限，否則無法讀取及執行_</font>

```shell
sudo chmod 755 /var/www/your_directory -R
```
