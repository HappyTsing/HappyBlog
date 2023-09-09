# XML

## Differences from HTML

- HTML(HyperText Markup Language)：超文本标记语言
- XML(Extensible Markup Language)：可扩展标记语言

二者的语法很，**XML 主要用于传输和存储数据**，而 HTML 主要用于显示信息。

因此，XML 使用的标签是 **自定义** 的，而 HTML 中使用的标签都是预定义的。

HTML 中，某些元素不必有一个关闭标签：

```html
<p>This is a paragraph. <br /></p>
```

但在 XML 中，省略关闭标签是非法的。

HTML 中，多个连续的空格会被裁剪合并为一个，而在 XML 中不会被删减，保留原样。

## XML Grammar

- XML 声明是可选部分，如果存在，需要放在文档的第一行：
  - xml version：告诉解析器或浏览器这个文件应该按照 XML 规则进行解析
  - encoding：编码格式

```xml
<?xml version="1.0" encoding="UTF-8"?>
```

- XML 标签对大小写敏感，例如标签 `<Letter>`与标签 `<letter>`是不同的。
- XML 注释：

```xml
<!-- This is a comment -->
```

- XML 属性值必须加引号：

```xml
<note date=2021/12/04>Hello XML!</note>    <!-- wrong -->
<note date="2021/12/04">Hello XML!</note>  <!-- correct -->
```

- XML 中，一些字符具有特殊意义，应当使用 `实体引用` 来代替这些字符：

| 实体引用 | 特殊字符 |
| -------- | -------- |
| `&lt;`   | <        |
| `&gt;`   | >        |
| `&amp;`  | &        |
| `&quot;` | "        |
| `&apos;` | '        |

以上是五个预定义的实体引用，使用方法如下：

```xml
<message>if salary < 1000 then</message>      <!-- wrong -->
<message>if salary &lt; 1000 then</message>   <!-- correct -->
```

## XML 命名规则

- 不能以数字或者标点符号开始
- 不能以字母 xml(e.g. XML, Xml)等开始
- 不能包括空格
- **推荐使用下划线分隔**
