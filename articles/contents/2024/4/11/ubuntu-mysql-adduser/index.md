# [Ubuntu 22.04] Mysql 新增使用者並賦予讀取資料庫權限

首先先用指令連接到 mysql

```shell
mysql -u root -p
```

有需要的話，先新建一個資料庫

```shell
mysql> CREATE DATABASE your_db_name;
```


下一步是建立 Mysql 帳號
```shell
mysql> CREATE USER your_user_name@localhost IDENTIFIED BY 'your_password';
```

賦予使用者權限
```shell
GRANT ALL PRIVILEGES ON *.* TO your_user_name@localhost
```


