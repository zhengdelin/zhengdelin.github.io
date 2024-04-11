# [Ubuntu 22.04] Mysql 匯入匯出資料庫

## 匯出整個資料庫

```shell
mysqldump -u your_account -p your_db_name > your_file_name.sql
```

## 匯出單張資料表

```shell
mysqldump -u your_account -p your_db_name your_table_name > your_file_name.sql
```

## 新建資料庫

```shell
mysql> CREATE DATABASE your_database_name;
```

## 匯入整個資料庫
```shell
mysql -u your_account -p your_db_name < source_file_name.sql
```