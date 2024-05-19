# 1130429後台讀訂單文字檔再逐一分解出單項，顯示在營幕上及另存檔案

PHP 程式碼：
```php
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .table-container {
            max-width: 100vw;
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #ddd;
        }



        th,
        td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        th {
            background-color: #f2f2f2;
        }

        tbody tr:hover {
            background-color: #f5f5f5;
        }
    </style>
</head>

<body>
    <div class="table-container">
        <table border="1">
            <?php
            // 開啟文件


            $filename = "090206.YT2";
            $file = fopen($filename, "r", false);
            $writeFile = fopen("output.txt", "w");

            // 檢查文件是否正確開啟
            if (!$file) {
                echo "無法開啟檔案";
            } else {
                // 設定 tbody
                $len = 47;
                $itemsRange = range(0,  $len - 1);
                $tds = array_map(function ($i) {
                    return "<th>col" . ($i + 1) . "</th>";
                }, $itemsRange);
                echo "<thead>
                    <tr>" . join("", $tds) . "</tr>
                </thead>
                <tbody>";
                // 逐行讀取 輸出至html的table
                while (($line = fgets($file)) !== false) {
                    // 依照 | 分割
                    $items = explode("|", iconv("big5", "UTF-8", $line));

                    // 輸出 td 
                    echo "<tr>" . join("", array_map(function ($i) use ($items) {
                        $item = "";
                        if ($i < count($items)) {
                            $item = $items[$i];
                        }
                        return "<td>$item</td>";
                    }, $itemsRange)) . "</tr>";

                    fwrite($writeFile, $line);
                }
                echo "</tbody>";
                fclose($writeFile);
                fclose($file);
            }
            ?>
        </table>
    </div>



</body>

</html>
```

輸出結果：
<image src="{{curFolderPath}}/image.png" />
<iframe src="{{curFolderPath}}/src/main.php" width="100%" height="500px"></iframe>