# HTML

## 快速使用

在 vscode 中输入 html:5，回车后即可生成基础内容（包含 head、空 body)。

![vscode-html](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/html/vscode-html.png)

## 什么是 HTML

HTML(HyperText Markup Language) 不是一门编程语言，而是一种用来告知浏览器如何组织页面的 **标记语言**。由一系列的 **元素（[elements](https://developer.mozilla.org/zh-CN/docs/Glossary/Element)）** 组成，这些元素可以用来包围不同部分的内容，使其以某种方式呈现或者工作。

一对标签（ [tags](https://developer.mozilla.org/zh-CN/docs/Glossary/Tag)）可以为一段文字或者一张图片添加超链接，将文字设置为斜体、改变字号等

!!! note

    HTML标签不区分大小。即 `<title>` `<TITLE>` `<Title>` 等效

## 引号风格

不给属性值加引号，有时是可行的，但是当一个元素有多个属性时，就会报错。因此我们始终应该添加引号。

单引号和双引号，二者都可以使用，只是风格问题。

!!! warning "单双引号不可以混用"

## 注释

```html
<!-- This is a comment -->
```

## HTML 空白

无论你在 HTML 元素的内容中使用多少空格（空白符号、换行），当渲染这些代码的时候，HTML 解释器都会将连续出现的空白字符减少为一个单独的空格符。

```html
<h1>我的 Web 
		页面</h1>
<h1>我的 Web 页面</h1>
```

## 实体引用

在 HTML 中，字符 `<` `>` `"` `'` `&` 是特殊字符。它们是 HTML 语法自身的一部分，如何显示他们呢？

使用字符引用：

| 原义字符 | 等价字符引用 |
| -------- | ------------ |
| <        | `&lt;`       |
| >        | `&gt;`       |
| "        | `&quot; `    |
| '        | `&apos;`     |
| &        | `&amp;`      |

## HTML 元素

如下是一个完整的段落元素：

![segment](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/html/segment.png)

该元素的主要部分有：

- 开始标签
- 结束标签
- 内容

三者共同组成了一个元素。

当然，不是所有的元素都拥有以上三个部分，**有些元素只有一个标签**，通常用来在此元素所在位置插入/嵌入一些东西，称为空元素(Empty elements, void elements)

例如：元素 `<img>` 是用来在它所在的位置插入一张指定的图片。

```html
<img src="/path/to/pic.png" />
```

---

此外，元素还可以拥有 **属性**：

![attribute](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/html/attribute.png)

属性包含元素的额外信息，这些信息不会出现在实际的内容中。如上图，该 class 属性给元素赋予了一个识别的名字。

一个属性必须包含如下内容：

- 一个空格，在属性和元素名词之间，若多个属性，则彼此之间也应有空格。
- 属性名称，后面跟随一个 `等号=`
- 属性值，由一对 `引号””` 包裹

例如 `<a>` 元素可以添加大量属性，例如：

```html
<a href="https://leqing.work.com/" title="乐乐博客" target="_blank"
  >click to block</a
>
```

- href：声明超链接的 web 地址，被点击后跳转到改地址
- title：当鼠标悬停在超链接上时，会提示 title 的内容
- target：链接如何呈现， `target="_blank"` 将在新标签中显示。否则将在当前页面显示。

**布尔属性**：没有值的属性。他们的属性值就是属性名，因此可以省略。

```html
<!-- 使用disabled属性来防止终端用户输入文本到输入框中 -->
<input type="text" disabled="disabled" />
<input type="text" disabled />
```

---

元素可以 **嵌套**：

```html
<p>我的猫咪脾气<strong>暴躁</strong></p>
```

HTML 中元素主要分为两种：

- **块级元素**，在页面中以块的形式展现。相对于其前面的内容它会出现在 **新的一行**，其后的内容也会被挤到下一行展现。块级元素不会被嵌套进内联元素中，但可以嵌套在其他块级元素中。主要用于展示结构化的内容，如段落、列表、导航菜单、页脚等。
- **内联元素**，通常出现在块级元素中，不会导致文本换行。


## <head\>

`<head>` 元素包含了所有头部标签元素，在该元素中，你可以插入脚本(Script)、样式文件(CSS)、以及各种meta信息。它包含所有你想包含在HTML页面中，但又不是想在HTML页面中显示的内容。

可以添加在头部区域的元素标签为:

- 添加标题：`<title>`
- 添加元数据：`<meta>`，主要是 author、description
- 增加自定义图标：`<link>`
- 增加 CSS：`<link>`、`<style>`
- 增加 JavaScript：`<script>`

```html
<!DOCTYPE html>
<!-- 声明文档类型 -->
<html lang="zh-CN">
  <!-- 为文档设定主语言 -->

  <head>
    <!-- 包含所有你想包含在HTML页面中，但又不是想在HTML页面中显示的内容 -->

    <meta charset="UTF-8" />
    <!-- 设置文档使用utf-8字符集编码 -->
    <title>web页面的名字</title>

    <!-- META 元素通常用于指定网页的描述，关键词，文件的最后修改时间，作者，和其他元数据。 -->
    <meta name="author" content="HappyTsing" />
    <meta name="description" content="This is a blog." />

    <!-- 添加自定义图标 -->
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />

    <!-- CSS 内部样式表 -->
    <style type="text/css">
      body {
        background-color: yellow;
      }

      p {
        color: blue;
      }
    </style>

    <!-- CSS 外部样式表 -->
    <link rel="stylesheet" type="text/css" href="mystyle.css" />

    <!-- <script>标签用于加载脚本文件，如： JavaScript。 -->
    <script>
      function myFunction() {
        document.getElementById("demo").innerHTML =
          "我的第一个 JavaScript 函数";
      }
    </script>
    <script src="myScript.js" async></script>
  </head>

  <body>
    <!-- 包含了你访问页面时所有显示在页面上的内容，文本，图片，音频，游戏等等。 -->

    <h1>我的 Web 页面</h1>
    <p id="demo">一个段落。</p>
    <button type="button" onclick="myFunction()">点击这里</button>
  </body>
</html>
```

## 标签简介

**内容结构化**

- `<h1>` 、`<h2>`、`<h3>`、`<h4>`、`<h5>`、`<h6>`：标题
- `<p>`：段落

**重点强调**

- `<em>`：强调，表现为斜体
- `<strong>`：重要，表现为加粗

注意，上述二者更适合表现一种风格，但不应该常用。而是使用其他标签如 `<span>+CSS` ，或者 `<i>、<b>` 来实现。

**表象元素：斜体、粗体、下划线**

它们出现于人们要在文本中使用粗体、斜体、下划线但 CSS 仍然不被完全支持的时期。仅仅影响表象而且没有语义，被称为表象元素。

注意：他们不该被使用！而应该用 CSS 实现。

**超链接**

- `<a>`，可以将块级元素转换为链接。 `<a> <div></div> </a>`

**文档的组成部分**

- 页眉：`<header>`
- 导航栏：`<nav>`
- 主内容：`<main>`，主内容中存在各种字内容区块
  - `<article>`
  - `<section>`
  - `<div>`
- 侧边栏：`<aside>`
- 页脚：`<footer>`

**无语义元素**

有时你会发现，对于一些要组织的项目或要包装的内容，现有的语义元素均不能很好对应。有时候你可能只想将一组元素作为一个单独的实体来修饰来响应单一的用  [CSS](https://developer.mozilla.org/zh-CN/docs/Glossary/CSS)  或  [JavaScript](https://developer.mozilla.org/zh-CN/docs/Glossary/JavaScript)。

- `<div>`：块级无语义元素
- `<span>`：内联无语义元素

**换行与水平分割线**

- `<br>`：可在段落中进行换行 `<p>name:HappyTsing<br>age:18</p>`
- `<hr>`：可在段落中生成一条水平分割线

  **列表**

- `<ul>`：无序列表，属性：type(默认disc、方块squre、空心圆circle)
- `<ol>`：有序列表，属性：type(1、a、A、i、I)、start
- `<dl>`：自定义列表

```html
<ul>
  <li>豆浆</li>
  <li>油条</li>
</ul>
```

**表格**

`<table>`：表示一个表格

- `<tr>`：表示表格的一行
- `<td>`：表示表格的一列
- `<th>`：用法和td相同，会 **加粗**，自动 **居中**，一般用在表格的最上面的一行

```html
<table border="1" width="300px" height="150px">
  <tr>
    <th></th>
    <td></td>
  </tr>
</table>
```
