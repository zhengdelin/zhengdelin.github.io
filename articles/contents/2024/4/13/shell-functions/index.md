# [ShellScript學習紀錄07] - 函數

在Shell中，函數（Function）是一組被包裹在一起的指令序列，可以在需要的時候被調用和執行。函數提供了一種組織和重用程式碼的方式，可以使腳本更加結構化和可讀性更高。

以下是一些關於Shell中函數的詳細介紹：

## 定義函數

在Shell中，定義函數使用關鍵字 `function` 或者直接使用函數名。函數的定義通常放在腳本的開頭部分。

```bash
function my_function {
    # 函數內部指令序列
    echo "這是我的函數"
}
```

或者：

```bash
my_function() {
    # 函數內部指令序列
    echo "這是我的函數"
}
```

## 調用函數

要調用函數，只需使用函數名即可。如果函數有參數，則將參數以空格分隔列出。

```bash
my_function
```

## 函數參數

函數可以接受參數，類似於命令行參數。在函數內部，使用 `$1`、`$2` 等來引用參數。

```bash
my_function_with_params() {
    echo "第一個參數是: $1"
    echo "第二個參數是: $2"
}

# 調用
my_function_with_params arg1 arg2
```

## 返回值

函數可以通過 `return` 關鍵字返回一個值。默認情況下，函數的返回值是最後一個執行的指令的退出狀態碼。

```bash
my_function_with_return() {
    return 42
}

my_function_with_return 
echo "函數返回值: $?" # 通過 $? 取得上一個調用的函數的返回值
```
## 局部變數

在函數中定義的變數默認是局部變數，它們只在函數內部可見，不會影響到全局作用域。

```bash
my_function_with_local_var() {
    local local_var="這是局部變數"
    echo $local_var
}

my_function_with_local_var
echo "局部變數: $local_var"  # 這裡會報錯，因為 local_var 是局部變數，無法在函數外部訪問
```


## 注意事項

*   調用函數前，必須先定義函數。
*   函數名不能與內建命令或者其他指令同名，否則可能會導致意外的行為。

函數是Shell腳本中組織和重用程式碼的有用工具，能夠使腳本更加模組化和易於維護。