# 简介及引用

## JS 简介

HTML 定义静态内容，CSS 美化内容，JS 实现动态内容。

在 HTML 和 CSS 集合组装成一个网页后，浏览器的 JavaScript 引擎将执行 JavaScript 代码，因为 JavaScript 最普遍的用处是通过 DOM API 动态修改 HTML 和 CSS 来更新用户界面。

如果 JavaScript 在 HTML 和 CSS 就位之前加载运行，就会引发错误。

JS 是解释性语言，动态类型（不需要指定变量将包含什么数据类型）。

注意：不同于 HTML 和 CSS，JS 区分大小写！

一个完整的 JavaScript 实现应该由下列三个不同的部分组成：

- 核心(ECMAScript)
- 文档对象模型(DOM)
- 浏览器对象模型(BOM)

### ECMAScript

由 ECMA-262 定义的 ECMAScript 与 Web 浏览器没有必须的依赖关系，Web 浏览器只是 ECMAScript 实现可能的 `宿主环境`(e.g. Node、Adobe Flash) 之一。

宿主环境不仅能提供基本的 ECMAScript 实现，同时也会提供该语言的扩展(e.g. DOM)，以便语言与环境之间对接交互。

Web 浏览器对 ECMAScript 的支持就是 JavaScript，而 Adobe ActionScript 也实现了对 ECMAScript 的支持。

### DOM

DOM 是针对 XML 但经过扩展用于 HTML 的应用程序编程接口(API)。

DOM 把整个页面映射为一个多层节点结构，HTML 或 XML 页面中的每个组成部分都是某种类型的节点，这些节点又包含着不同类型的数据。

如下 HTML 页面：

```html
<html>
  <head>
    <title>Sample Page</title>
  </head>
  <body>
    <p>Hello World!</p>
  </body>
</html>
```

DOM 如图所示：

![dom](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/javascript/dom.jpg)

### BOM

从根本上讲，BOM 只处理浏览器窗口和框架，但人们习惯上也把所有针对浏览器的 JS 扩展算作 BOM 的一部分，如：

- 对 cookies 的支持
- 像 XMLHttpRequest 和 IE 的 AxtiveXObject 等自定义对象
- navigator、location、screen 等对象
- ...

由于没有 BOM 标准可以遵循，因此每个浏览器都有自己的实现。

## 向 HTML 添加 JS

```html
<head>
		<!-- 内部JavaScript -->
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            function createParagraph() {
                let para = document.createElement('p');
                para.textContent = '你点击了这个按钮！';
                document.body.appendChild(para);
            }

            const buttons = document.querySelectorAll('button');

            for (let i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener('click', createParagraph);
            }
        });
    </script>

		<!-- 外部JavaScript -->
    </script>
    <script src="myScript.js" async></script>

</head>
```

此外，还可以内嵌 JS，但极其不建议使用！

`<script>` 定义了 6 个属性

- async：异步脚本。应该立即下载脚本，但不应妨碍页面中的其他操作，比如下载其他资源或等待加载其他脚本。只对外部脚本文件有效。
- defer：延迟脚本。表示脚本可以延迟到文档完全被解析和显示后再执行。只对外部脚本文件有效。
- charset：表示通过 src 属性指定的代码的字符集。大多数浏览器会忽略该值，很少使用。
- src：表示包含要执行代码的外部文件
- ~~language：已废弃，原用于表示编写代码使用的脚本语言。~~
- type：不是必须的，默认为 text/javascript

## 脚本调用策略

若 JS 操作 DOM，但 JS 在 HTML 元素之前加载，则代码将出错。

然而，JS 在 `<head>` 中引入，解析于 HTML 文档体 `<body>` 之前，因此存在隐患，需要一些方法避免错误发生。

再看向 HTML 添加 JS 的代码：

- 内部 JavaScript

```js
/* 监听器，监听浏览器的 "DOMContentLoaded" 事件，即 HTML 文档体加载、解释完毕事件。
事件触发时才调用之后的代码，从而避免了错误发生 */
document.addEventListener("DOMContentLoaded", function() {
  . . .
});
```

- 外部 JavaScript

```js
/* 使用异步(async)属性
它告知浏览器在遇到 <script> 元素时不要中断后续 HTML 内容的加载 */
<script src="myScript.js" async></script>
```

这两种是较为先进高效的解决办法，在此之前，旧办法是把脚本元素放在文档体的底部，只有在所有 HTML DOM 加载完成后才开始脚本的加载/解析过程。

该方法有显著的性能损耗。

### async 和 defer

!!! note "参考: [defer 和 async 的区别](https://segmentfault.com/q/1010000000640869)"

- 如果脚本无需等待页面解析，且无依赖独立运行，那么应使用  `async`。
- 如果脚本需要等待页面解析，且依赖于其它脚本（脚本顺序加载），调用这些脚本时应使用  `defer`，将关联的脚本按所需顺序置于 HTML 中。

!!! warning

    任何时候都应该选中 async 或 defer，而不是什么都不输入！