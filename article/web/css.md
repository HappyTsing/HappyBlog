# CSS

## CSS 简介

CSS(**Cascading Style Sheets**，层叠样式表)。

HTML 用于定义内容的结构和语义，CSS 用于设计风格和布局。

- 给文档添加样式：例如改变标题和链接的[颜色](https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value)及[大小](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-size)。
- 创建布局：例如将一个单列文本变成包含主要内容区域和存放相关信息的侧边栏区域的[布局](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Layout_cookbook/Column_layouts)。
- 特效：例如[动画](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations)。查看本段内容中所给出的特定案例。

## 向 HTML 添加 CSS

```html
<head>
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
</head>
```

## CSS 是如何工作的？

!!! note "参考: [渲染页面：浏览器的工作原理 - Web 性能 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work)"

- 浏览器载入 HTML 文件
- 第一步：将 HTML 文件转化成一个 DOM（Document Object Model），DOM 是文件在计算机内存中的表现形式。可以理解为节点树。
- 浏览器主线程用于构建 **DOM 树**，同时，预加载扫描仪将解析可用的内容并请求高优先级资源，如 CSS、JavaScript、脚本、图像。
- 第二步：将 CSS 文件转化为 **CSSOM**(CSS Object Model)。CSSOM 是树形形式的所有 CSS 选择器和每个选择器的相关属性的映射，具有树的根节点，同级，后代，子级和其他关系。
- 当 CSS 被解析并创建 CSSOM 时，其他资源，包括 JavaScript 文件正在下载（preload scanner）。JavaScript 被解释、编译、解析和执行。Script 被解析为 **抽象语法树**。
- 第三步：**渲染树**。将 DOM 和 CSSOM 组合成一个 Render 树，计算样式树或渲染树从 DOM 树的根开始构建，遍历每个可见节点。
- 第四步：**布局**。在渲染树上运行布局以计算每个节点的几何体。布局是确定呈现树中所有节点的宽度、高度和位置，以及确定页面上每个对象的大小和位置的过程。回流是对页面的任何部分或整个文档的任何后续大小和位置的确定。
- 第五步：**着色**。网页展示在屏幕上。

## CSS 解析

当浏览器遇到无法解析的 CSS 时，会直接忽略整个选择器规则，并继续解析下一个 CSS 选择器。

此外，CSS 和 HTML 一样，会自动将多个空白符合并为一个。

## CSS 层叠、优先级、继承

!!! note "参考: [层叠与继承 - 学习 Web 开发 | MDN](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance)"

- 层叠：简单的说，css 规则的顺序很重要，当应用两条同级别的规则到一个元素的时候，写在后面的就是实际使用的规则。
- 优先级：`ID选择器>类、伪类、属性选择器>元素、伪元素选择器` 。浏览器是根据优先级来决定当多个规则有不同选择器对应相同的元素的时候需要使用哪个规则，比如类选择器的优先级大于元素选择器，因此即便元素选择器顺序在后面，也会应用类选择器，而不是元素选择器。
- 继承：一些设置在父元素上的 css 属性是可以被子元素继承的，有些则不能，举个例子如果你在一个元素上设置  width 50% ，所有的后代不会是父元素的宽度的 50% 。如果这个也可以继承的话，CSS 就会很难使用了!

## CSS 语法

!!! note "参考: [CSS 参考 - CSS（层叠样式表） | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference)"

语法由一个 **选择器(Selecter)** 开始，它选择了将要添加样式的 HTML 元素。

接着输入一对 **大括号{}**，内部定义一个或多个形式为 `属性(property):值(value)` 的 **声明(declarations)**

```css
h1 {
  color: red;
  font-size: 5em;
}
```

## CSS 选择器

选择器列表：可以用 **逗号** 分隔多种选择器，应用同样的 css 规则。

```css
h1,
.classValue,
a[title] {
}
```

### 类型、类、ID 选择器

```css
h1 {
}
.classValue {
}
#idValue {
}
```

### 标签属性选择器

这组选择器根据一个元素上的某个标签的属性的存在以选择元素的不同方式：

```css
a[title] {
}
```

或者根据一个有特定值的标签属性是否存在来选择：

```css
a[href="https://example.com"]
{
}
```

### 伪类与伪元素选择器

这组选择器包含了伪类，用来样式化一个元素的特定状态。例如`:hover`伪类会在鼠标指针悬浮到一个元素上的时候选择这个元素。

```css
a:hover {
}
```

| 属性         | 描述                                                      |
| ------------ | --------------------------------------------------------- |
| :active      | 向被激活的元素添加样式。(如 button 被点击）               |
| :focus       | 向拥有键盘输入焦点的元素添加样式。（如 input 正在输入时） |
| :hover       | 当鼠标悬浮在元素上方时，向元素添加样式。                  |
| :link        | 向未被访问的链接添加样式。                                |
| :visited     | 向已被访问的链接添加样式。                                |
| :first-child | 向元素的第一个子元素添加样式。                            |
| :lang        | 向带有指定 lang 属性的元素添加样式。                      |

它还可以包含了伪元素（**单、双引号都可**），选择一个元素的某个部分而不是元素自己。

```css
p::first-line {
}
p:first-line {
}
```

| 属性           | 描述                                                                         |
| -------------- | ---------------------------------------------------------------------------- |
| ::first-letter | 将特殊样式添加到文本的首字母                                                 |
| ::first-line   | 将特殊样式添加到文本的首行                                                   |
| ::before       | 在某元素之前插入某些内容                                                     |
| ::after        | 在某元素之后插入某些内容，如.help::after{content:"?"; }                      |
| ::first-child  | 假设 div(无 class)下有三个 p，若要修改第一个 p 标签，则 div p::first-child{} |
| ::last-child   | 同 first                                                                     |
| nth-child()    | 在括号内输入数字即可实现控制修改第 n 个标签                                  |

!!! note

    此外，还有一些其他的选择器，如后代选择器、子代选择器、并集选择器等，有兴趣可自行搜素学习。

## 盒模型

在 CSS 中，所有的元素都被一个个盒子包围着，主要分为两种：

### 块级盒子(Block box)

- 每个盒子都会换行。
- `width` 和 `height` 属性可以发挥作用。
- 内边距（padding）, 外边距（margin） 和 边框（border） 会将其他元素从当前盒子周围“推开”。
- 盒子会在内联的方向上扩展并占据父容器在该方向上的所有可用空间，**在绝大数情况下意味着盒子会和父容器一样宽。**

### 内联盒子(Inline box)

- 盒子不会产生换行。
- `width` 和 `height` 属性都将不起作用
- **垂直方向** 的 padding、margin、border 会被应用但是 `不会` 把其他处于  `inline`  状态的盒子推开。
- **水平方向** 的 padding、margin、border 会被应用且 `会` 把其他处于  `inline`  状态的盒子推开。

!!! note

    HTML中元素主要分为两种：

    - **块级元素**，在页面中以块的形式展现。相对于其前面的内容它会出现在**新的一行**，其后的内容也会被挤到下一行展现。块级元素不会被嵌套进内联元素中，但可以嵌套在其他块级元素中。主要用于展示结构化的内容，如段落、列表、导航菜单、页脚等。
    - **内联元素**，通常出现在块级元素中，不会导致文本换行。

    因此，默认情况下，HTML中的块级元素，在CSS中会是块级盒子。但可以通过对盒子 `display` 属性的设置，比如 `inline` 或者 `block` ，来控制盒子的 **外部显示类型**。

### 盒模型的内部和外部显示类型

如上所述， css 的 box 模型有一个 **外部显示类型**，来决定该元素对应的盒子是块级还是内联。

同样盒模型还有 **内部显示类型**，它决定了盒子内部元素是如何布局的。默认情况下，和外部显示类型相同，都和 HTML 元素类型相同。

- 外部显示类型：更改盒子 `display` 属性的设置，比如 `inline` 或者 `block` ，即可实现更改。
- 内部显示类型：display：[flex](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Flexbox)，此时将内部显示类型修改为 `flex` 。

### 盒模型的各个部分

CSS 中组成一个块级盒子需要:

- **Content box**: 这个区域是用来显示内容，大小可以通过设置 `width` 和 `height`.
- **Padding box**: 包围在内容区域外部的空白区域； 大小通过 `padding` 相关属性设置。
- **Border box**: 边框盒包裹内容和内边距。大小通过 `border` 相关属性设置。
- **Margin box**: 这是最外面的区域，是盒子和其他元素之间的空白区域。大小通过 `margin>` 相关属性设置。

![box](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/css/box.png)

## CSS 布局

排版的几种方法：

- position
- float
- flex
- grid
