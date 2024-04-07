### List（列表）：

List 是 Dart 中最常見的集合類型，它是有序的並且允許重複值的。

```dart
// 創建一個空的 List
List<int> numbers = [];

// 添加元素到 List
numbers.add(1);
numbers.add(2);
numbers.add(3);

// 取得 List 的長度
int length = numbers.length;

// 訪問 List 中的元素
int firstNumber = numbers[0];

// 使用 for 迴圈遍歷 List
for (int number in numbers) {
    print(number);
}
```
### Set（集合）：

Set 是 Dart 中的集合類型，它是無序的並且不允許重複值的。

```dart
// 創建一個空的 Set
Set<String> fruits = {};

// 添加元素到 Set
fruits.add('apple');
fruits.add('banana');
fruits.add('apple'); // 這個不會被添加進去，因為 'apple' 已經存在於 Set 中

// 訪問 Set 中的元素
for (String fruit in fruits) {
    print(fruit);
}
```

### Map（映射）：

Map 是 Dart 中的鍵值對集合，每個鍵對應一個值。

```dart
// 創建一個空的 Map
Map<String, int> ages = {};

// 添加鍵值對到 Map
ages['John'] = 30;
ages['Alice'] = 25;

// 訪問 Map 中的鍵值對
ages.forEach((key, value) {
    print('$key 的年齡是 $value');
});
```

### 循環語句：

與前面介紹的迴圈類似，我們可以使用不同的循環語句來遍歷集合。

1.  使用 `for` 迴圈遍歷 List 和 Set：

```dart
 List<int> numbers = [1, 2, 3];
for (int i = 0; i < numbers.length; i++) {
    print(numbers[i]);
}

Set<String> fruits = {'apple', 'banana'};
for (String fruit in fruits) {
    print(fruit);
}
```
2.  使用 `forEach()` 方法遍歷 List、Set 和 Map：

```dart
List<int> numbers = [1, 2, 3];
numbers.forEach((number) {
    print(number);
});

Set<String> fruits = {'apple', 'banana'};
fruits.forEach((fruit) {
    print(fruit);
});

Map<String, int> ages = {'John': 30, 'Alice': 25};
ages.forEach((key, value) {
    print('$key 的年齡是 $value');
});
```

以上就是 Dart 中 List、Set、Map 的基本用法、差異和循環語句。這些集合類型在 Dart 編程中非常常見，通過熟悉它們，可以更靈活地處理數據集合。