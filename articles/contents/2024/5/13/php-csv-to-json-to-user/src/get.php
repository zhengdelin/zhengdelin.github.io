<?php

function replace_new_line($string)
{
    return str_replace("\r\n", "", $string);
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
        throw new Exception("count not match");
    }

    foreach ($arr as $idx => $value) {
        $key = $header[$idx];
        $itemObj[$key] = $value;
    }

    return $itemObj;
}

$file = fopen("./cookbook.txt",  "r");

// 先取得header
$header = explode(",",  replace_new_line(fgets($file)));

$results = [];
// 逐行讀取
while ($line = fgets($file)) {

    // 去除換行 編碼 取得資料
    $line = handle_encoding(replace_new_line($line));
    $items = explode(",", $line);

    try {
        $obj = get_item_obj_from_arr($items, $header);
        array_push($results, $obj);
    } catch (\Throwable $th) {
        // throw $th;
    }
}


header('Content-Type: application/json; charset=utf-8');
echo json_encode($results);
