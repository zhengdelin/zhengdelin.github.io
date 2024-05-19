# 1130506將後台cookbook.txt檔以utf8內碼轉為json格式字串，並顯示在營幕並存檔

PHP 程式碼：
```php
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <?php
    $filename = "cookbook.txt";
    $file = fopen($filename, "r");
    $writeFile = fopen("output.json", "w");

    if (!$file) {
        echo "無法開啟檔案";
    } else {

        function replace_quote($string)
        {
            return str_replace("\"", "\\\"", $string);
        }

        function replace_new_line($string)
        {
            return str_replace("\r\n", "", $string);
        }

        function handle_encoding($string)
        {
            return iconv("big5", "utf-8", $string);
        }

        $echo_to_html_then_write = function ($string) use ($writeFile) {
            echo str_replace("\n", "<br>", $string);
            fwrite($writeFile, $string);
        };

        $headerLine = fgets($file);
        $header = explode(",", handle_encoding(replace_new_line(replace_quote($headerLine))));

        $echo_to_html_then_write("[\n");

        $isStart = true;
        do {
            $line = fgets($file);
            $handledStr = handle_encoding(replace_new_line(replace_quote($line)));
            if (!$handledStr) {
                break;
            }
            $items = explode(",", $handledStr);

            $content = "";
            if ($isStart) {
                $content .= "{\n";
                $isStart = false;
            } else {
                $content .= ",\n{\n";
            }
            for ($i = 0; $i < count($header); $i++) {
                $itemStr = "\"" . $header[$i] . "\":\"" . $items[$i] . "\"";
                $content .= $itemStr;
                if ($i < count($header) - 1) {
                    $content .= ",";
                }
                $content .= "\n";
            }
            // write end of items
            $content .= "}";
            $echo_to_html_then_write($content);
        } while (!feof($file));
        // write end of array
        $echo_to_html_then_write("]\n");
        fclose($file);
        fclose($writeFile);
    }
    ?>
</body>

</html>
```
輸出結果：
<image src="{{curFolderPath}}/image.png" />
<iframe src="{{curFolderPath}}/src/main.php" width="100%" height="500px"></iframe>