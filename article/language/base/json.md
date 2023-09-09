# JSON

## Introduce

JSON(JavaScript Object Notation)

和 XML 的用途一样，JSON 也是用于**存储和传输数据**的格式，但是 JSON 比 XML 更小、更快、更易解析。

注：JSON 不支持注释，如果需要注释，可以添加一个键值对作为注释：

```json
{
  "_comment": "this is a comment"
}
```

## JSON Grammar

JSON 以键值对的形式存储： `key : value` ，其中， `key` 必须用**双引号**进行包裹，键值对之间采用**逗号**分隔。

JSON 的 `value` 共有以下几种形式：

- 整数
- 字符串 ""
- 布尔值 true/false
- 数组 []
- 对象 {}
- null

```json
{
  "string": "HappyTsing",
  "boolean": true,
  "array": [false, true, 1, "HappyTsing", null],
  "object": {
    "array": [
      {
        "name": "nested"
      }
    ]
  }
}
```
