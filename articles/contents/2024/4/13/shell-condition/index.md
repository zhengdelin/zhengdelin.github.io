# [ShellScript學習紀錄06] - 條件判斷



## 語法

### if

```bash
if [ 條件 ]
then
    # 條件為真時執行的程式碼
fi
```

### if else
```bash
if [ 條件 ]
then
    # 條件為真時執行的程式碼
else
    # 所有條件都不滿足時執行的程式碼
fi
```

### if elseif
```bash
if [ 條件1 ]
then
    # 條件1為真時執行的程式碼
elif [ 條件2 ]
then
    # 條件2為真時執行的程式碼
fi
```
### 多重條件判斷
此結構下需要 **條件1** 及 **條件2** 都成立，才會執行陳述句。
```bash
if [ 條件1 ] && [ 條件2 ] 
then
     # statements
fi
```

另一種結構如下，此結構需要 **條件1** 或 **條件2** 其中一個成立，就會執行陳述句：
```bash
if [ 條件1 ] || [ 條件2 ] 
then
     # statements
fi
```

## 定義條件

### 字串比較

| 語法 |  用途 | 範例 | 說明 |
| ---- |  ----  | ---- | ---- |
| = | 等於。用於比較兩個字符串是否相等。 |  \$s1 = $s1  | \$s1 與 $s2 字串是否相同 |
| = | 等於。用於比較兩個字符串是否相等。 |  \$s1 == $s1  | \$s1 與 $s2 字串是否相同 |
| = | 不等於。用於比較兩個字符串是否不相等。 |  \$s1 != $s1  | \$s1 與 $s2 字串是否不相同 |
| = | 空。用於判斷字符串是否為空。 |  -n $s1  | 當 $s1 有值不是 null 時回傳 true |
| = | 非空。用於判斷字符串是否非空。 |  -z $s1  | 當 $s2 沒有值是 null 時回傳 true |

### 數字比較

| 語法 |  用途 | 範例 | 說明 |
| ---- |  ----  | ---- | ---- |
| -eq | 等於。用於比較兩個數字是否相等。 | \$a -eq \$b | a 等於 b 傳回 true |
| -ne | 不等於。用於比較兩個數字是否不相等。 | \$a -ne \$b | a 不等於 b 傳回 true |
| -gt | 大於。用於判斷一個數字是否大於另一個數字。 | \$a -gt \$b | a 大於 b 傳回 true |
| -ge | 大於等於。用於判斷一個數字是否大於或等於另一個數字。 | \$a -ge \$b | a 大於等於 b 傳回 true |
| -lt | 小於。用於判斷一個數字是否小於另一個數字。 | \$a -lt \$b | a 小於 b 傳回 true |
| -le | 小於等於。用於判斷一個數字是否小於或等於另一個數字。 | \$a -le \$b | a 小於等於 b 傳回 true |


### 文件比較操作符

| 語法 |  用途 | 範例 | 說明 |
| ---- |  ----  | ---- | ---- |
| -e |  存在。用於判斷文件是否存在。  | -e file | file 存在傳回 true |
| -d | 是目錄。用於判斷指定的路徑是否指向一個目錄。 | -d file | file 是目錄傳回 true |
| -f | 是文件。用於判斷指定的路徑是否指向一個文件。 | -f file | file 是檔案傳回 true |
| -r | 可讀。用於判斷文件是否可讀。 | -r file | file 可以讀傳回 true |
| -s | 用於檢查文件存在並且非空 | -s file | file 儲存容量大於 0 傳回 true |
| -w | 可寫。用於判斷文件是否可寫。 | -w file | file 可以寫入傳回 true |
| -x | 可執行。用於判斷文件是否可執行。 | -x file | file 可以執行傳回 true |
| -L | 用於檢查文件是否為軟連結 | -L file | file 為軟連結傳回 true |
| -nt | 新於，用於比較兩個文件的修改時間 | file1 -nt file2 | file1 比 file2 新傳回 true |
| -ot | 舊於，用於比較兩個文件的修改時間 | file1 -ot file2 | file1 比 file2 舊傳回 true |
| -ef | 用於檢查兩個文件是否指向同一文件 | file1 -ef file2 | file1 與 file2 為同一檔案傳回 true |

以上是一些常見的定義條件的選項和操作符。這些選項和操作符可以根據不同的場景和需求進行組合和應用，以實現更複雜的條件判斷。


## 其他定義條件的方法

### 使用方括號 `[]` 或者雙方括號 `[[]]`

```bash
if [ 條件 ]
then
    # 滿足條件時執行的指令
else
    # 不滿足條件時執行的指令
fi
```
```bash
if [[ 條件 ]]
then
    # 滿足條件時執行的指令
else
    # 不滿足條件時執行的指令
fi
```

### 使用條件表達式
```bash
if 條件
then
    # 滿足條件時執行的指令
else
    # 不滿足條件時執行的指令
fi
```

在第二種方式中，不需要方括號 `[]` 或者雙方括號 `[[]]`，只需將條件表達式直接放在 if 後面即可。

例如，下面是使用兩種方式進行條件判斷的示例：

```bash
# 使用方括號 []
if [ "$var" -eq 10 ]
then
    echo "var 等於 10"
else
    echo "var 不等於 10"
fi

# 直接使用條件表達式
if (( var == 10 ))
then
    echo "var 等於 10"
else
    echo "var 不等於 10"
fi
```

### 判斷布林值的方式
如果要判斷布林值，有以下兩種方式：
```bash

# 第一種方式
a=false
if [ $a == false]
then
    echo 'a is true'
else
    echo 'a is false'
fi

# 第二種方式
a=false
if $a
then
    echo 'a is true'
else
    echo 'a is false'
fi
```
第二種方式較為簡潔，但請注意，以下方式是行不通的：

```bash
a=false
if [ $a ]
then
    echo 'a is true'
else
    echo 'a is false'
fi
```

使用這種方式的話，會走向 「true」 語句，因為這樣會變成判斷 `$a` 存不存在。

> 延伸閱讀： <a data-article-id="20240413-shell-$(())-vs-(())"></a>
