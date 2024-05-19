# 1130513將後台讀取有分隔號的檔案組成json格式後，傳回前台，並將字串轉為json物件後，將資料以表格顯示在前台

## PHP 程式碼範例
```php
<?php

function replace_new_line($string)
{
    return str_replace("\n", "", str_replace("\r\n", "", $string));
}

function handle_encoding($string)
{
    return iconv("big5", "utf-8", $string);
}

function get_item_obj_from_arr($arr, $header)
{

    $itemObj = [];

    // 判斷欄位是否錯誤
    if (count($arr) != count($header)) {
        // throw new Exception("count not match");
        return null;
    }

    foreach ($arr as $idx => $value) {
        $key = $header[$idx];
        $itemObj[$key] = $value;
    }

    return $itemObj;
}

$file = fopen("cookbook.txt",  "r");
if (!$file) {
    throw new Exception("file not found");
}
// 先取得header
$header = explode(",",  replace_new_line(fgets($file)));

$results = [];
// 逐行讀取
while ($line = fgets($file)) {

    // 去除換行 編碼 取得資料
    $line = handle_encoding(replace_new_line($line));
    $items = explode(",", $line);

    $obj = get_item_obj_from_arr($items, $header);
    if (isset($obj)) array_push($results, $obj);
}

fclose($file);

echo json_encode($results);

```

## Javascript 程式碼範例
```javascript
const tBody = document.querySelector("tbody");

function createRow(item) {
  const { f_food_id, f_food_name, f_class_name, f_food_desc, f_food_qty, f_food_price } = item;

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${f_food_id}</td>
    <td>${f_food_name}</td>
    <td>${f_class_name}</td>
    <td>${f_food_desc}</td>
    <td>${f_food_qty}</td>
    <td>${f_food_price}</td>
  `;
  return tr;
}

function createTableRows(data) {
  const fragment = document.createDocumentFragment();
  data.forEach((item) => {
    fragment.appendChild(createRow(item));
  });

  tBody.appendChild(fragment);
}

window.addEventListener("DOMContentLoaded", () => {
  fetch("./get.php").then(async (response) => {
    const data = await response.json();
    createTableRows(data);
  });
});

```

執行結果：
<iframe src="{{curFolderPath}}/src/index.html" width="100%" height="500px"></iframe>