# [ShellScript學習紀錄02] - 基本語法

## Shebang
每個shell script檔案的開頭都應該包含一個Shebang行，指定要用來執行該腳本的Shell解釋器。例如：
```bash
#!/bin/bash
```

## 註解
可以使用 `#` 符號來添加註解，這些註解將被解釋器忽略並且不執行。例如：
```bash
# This is a comment
```

## 變數
使用變數來存儲和操作數據。在shell script中，變數名稱通常不需要事先聲明，直接賦值即可。例如：
```bash
name="John"
```

## 輸出
使用 `echo` 命令來輸出文本。例如：
```bash
echo "Hello, World!"
```

## 條件判斷
使用 `if` 語句來進行條件判斷。例如：
```bash
# 一般用法
if [ condition ]; then
    # statements
fi

# if else
if [ condition ]
then
    # statements
else
    # statements
fi

# if elseif else
if [ condition ]
then
    # statements
elif [ condition ]
then
    # statements
else
    # statements
fi
```

## 迴圈
使用 `for` 和 `while` 語句來實現迴圈。例如：
```bash
# for
for i in {1..5}; do
    # statements
done

# while
while [ condition ]
do
    # statements
done
```

## 函數
可以定義和使用函數來組織和重複使用程式碼例如：
```bash
function greet {
    echo "Hello, $1!"
}
greet "Alice"
```

## 引用
使用單引號和雙引號來引用字串，以防止特殊字符被解釋。例如：
```bash
single_quoted='This is a single quoted string'
double_quoted="This is a double quoted string"
```

## 讀取輸入
使用 `read` 命令來讀取用戶的輸入。例如：
```bash
read -p "Enter your name: " name
```

## 執行命令
在 shell script 中執行 Shell 指令，可以直接將指令寫在腳本檔案中，就像在終端中直接輸入一樣，例如：
```bash
#!/bin/sh

ip a
```

將這些程式碼保存到一個以.sh為副檔名的檔案中，例如 ip_info.sh，然後使用 Shell 解釋器執行該腳本。例如，如果你使用的是 Bash 作為 Shell 解釋器，可以透過以下命令執行：
```bash
bash ip_info.sh
# 或 ./ip_info.sh
```

## 命令替換（command substitution）
在Shell腳本中，命令替換允許你將指令的輸出直接分配給一個變數。以下是一個示例：
```bash
#!/bin/sh

# 將ip a指令的結果賦值給變數ip_info
ip_info=$(ip a)

# 輸出變數ip_info的內容
echo "$ip_info"
```

