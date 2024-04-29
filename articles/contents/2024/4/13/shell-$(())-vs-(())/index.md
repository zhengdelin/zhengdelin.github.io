# [ShellScript學習紀錄08] - $(( )) vs (( ))


在Shell中，`$(( ))` 和 `(( ))` 都是用於進行算術運算的構造，但它們之間有一些重要的區別。

## 1. `$(( ))`

`$(( ))` 是用於在命令替換中執行算術運算的構造。它會將算術運算的結果替換為其計算結果。這意味著，當你需要將算術運算的結果賦值給變數或者作為輸出的一部分時，你可以使用 `$(( ))`。

例如：

```bash
result=$(( 5 + 3 ))
echo "結果是: $result"
```

## 2. `(( ))`

`(( ))` 是用於在Shell中進行算術運算的一種擴展的語法。它可以直接執行算術運算，而不需要使用命令替換。通常情況下，它被用於條件判斷和循環中。

例如：

```bash
if (( 5 > 3 ))
then
    echo "5 大於 3"
fi
```

或者在循環中：

```bash
for (( i = 0; i < 5; i++ ))
do
    echo "迭代次數: $i"
done
```


## 區別

主要的區別在於，`$(( ))` 是用於命令替換中的算術運算，而 `(( ))` 是用於Shell語句中的算術運算。在 `(( ))` 中，支持更多的算術操作，如自增（`++`）、自減（`--`）等。