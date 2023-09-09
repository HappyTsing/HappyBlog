# BOM 和 DOM

## BOM

ECMAScript 是 JavaScript 的核心，但如果要在 Web 中使用 JavaScript，那么 BOM 无疑才是核心。

BOM 提供了很多对象，用于访问浏览器的功能，这些功能与任何网页内容无关。

BOM 的主要方面已经纳入 HTML5 的规范中，在此之前，不同的浏览器对 BOM 的扩展各不相同。

### window 对象

BOM 的核心对象是 window，它表示浏览器的一个实例。在浏览器中，window 有双重角色：

- window 是通过 JavaScript 访问浏览器窗口的一个接口
- window 又是 ECMAScript 规定的 Global 对象，这意味着在网页中定义的任何一个对象、变量、函数，都以 window 作为其 Global 对象，因此有权访问 parseInt()等方法
  ```js
  var age = 29;
  alert(window.age); //29
  ```
  如上，在全局作用域定义了一个变量 age，它被自动归在了 window 对象名下。

此外，还有很多用于确定和修改 window 对象位置的属性和方法，如 IE、Safari、Chrome 都提供了 screenLeft、screenTop 属性，分别用于表示窗口相对于屏幕左边和上边的位置。

还有许多有关窗口大小、导航和打开窗口的方法。

如 `window.open()` 方法既可以导航到一个特定的 URL，也可以打开一个新的浏览器窗口。还有 `close()` 方法可以关闭新打开的窗口。

浏览器通过 `alert(), confirm(), prompt()` 方法可以调用系统对话框向用户显示消息。

### location 对象

`location` 是最有用的 BOM 对象之一，使用该对象可以通过编程方式来访问浏览器的导航系统，设置相应的属性，可以逐段或整体性地修改浏览器的 URL。

它很特殊，它既是 `window` 对象的属性，也是 `document` 对象的属性，换句话说，调用 `window.location` 和 `documet.location` 引用的是同一个对象。

### navigator 对象

该对象提供了与浏览器有关的信息，具体有哪些信息，依据不同的浏览器而定。比如 `userAgent` 属性存在于所有浏览器中。

BOM 中还有两个对象：screen 和 history，但它们的功能有限。screen 对象中保存着与客户端显示器有关的信息，这些信息一般只用于站点分析。history 对象为访问浏览器的历史记录开了一个小缝隙，开发者可以据此判断历史记录的数量。

## DOM

DOM 是针对 HTML 和 XML 文档的一个 API。其描绘了一个层次化的节点树，允许开发人员添加、移除和修改页面的某一部分。

### Node 类型

DOM1 定义了一个 Node 接口，该接口由 DOM 中的所有节点类型实现。该接口在 JS 中是作为 Node 类型实现的，除 IE 之外，所有浏览器都可以访问到这个类型。

JS 中的所有节点类型都继承自 Node 类型，因此所有节点类型都共享着相同的基本属性和方法。

**nodeType 属性**

每个节点都有一个 nodeType 属性，用于表示节点的类型。

节点类型由在 Node 类型中定义的下列 12 个数值常量来表示，任何节点类型必居其一：

- **1 Node.ELEMENT_NODE**
- 2 Node.ATTRIBUTE_NODE
- 3 Node.TEXT_NODE
- 4 Node.CDATA_SECTION_NODE
- 5 Node.ENTITY_REFERENCE_NODE
- 6 Node.ENTITY_NODE
- 7 Node.PROCESSING_INSTRUCTION_NODE
- 8 Node.COMMENT_NODE
- **9 Node.DOCUMENT_NODE**
- 10 Node.DOCUMENT_TYPE_nODE
- 11 Node.DOCUMENT_FRAGMENT_NODE
- 12 Node.NOTATION_NODE

```js
if(someNode.nodeType==Node.ELEMENT_NODE){} //在IE中无效
if(someNode.nodeType==Node.1){} //适用于所有浏览器
```

**nodeName、nodeValue 属性**

对于元素节点，nodeName 保存的是元素的标签名，而 nodeValue 为 null。

**节点关系**

每个节点都有一个 `childNodes` 属性，其中保存着一个 NodeList 对象，该对象是一种类数组对象，它实际上是基于 DOM 结构**动态**执行查询的结果。因此，他不是第一次访问时的瞬间快照，而是动态更改有生命呼吸的对象。

访问保存在 NodeList 中的节点时，可以通过方括号，也可以使用 item()方法。此外，可通过 length 属性访问这一刻的长度。

```js
var firstChild = someNode.childNodes[0];
var secondChild = someNode.childNodes.item(0);
var count = someNode.childNodes.length;
```

每个节点都有一个 `parentNode` 属性，该属性指向文档树的父节点。很容易理解，在同一个 `childNodes` 中的节点具有共同的 `parentNode` 属性。

因此， `childNodes` 列表中的每个节点相互之间都是同胞节点。

通过使用每个 `childNodes` 列表中的节点的 `previousSibling` 和 `nextSibling` 属性，可以访问同一列表中的其他节点。

父节点的 `firstChild` 和 `lastChild` 属性分别指向其 `childNodes` 列表中的第一个和最后一个节点。

**操作节点**

因为关系指针都是只读的，因此 DOM 提供了一些操作节点的方法。

```js
appendChild(newNode) //用于向childNodes列表末尾添加一个节点，添加后节点关系指针会自动更新
insertBefore(newNode,作为参照的节点) //插入后，插入节点变成参照节点的前一个同胞节点
replaceChild(newNode，要替换的节点)
cloneNode()
normalize() //处理文档树的文本节点
```

### Document 类型

JS 通过 Document 类型表示文档。在浏览器中，document 对象是 HTMLDocument（继承自 Document 类型）的一个实例，表示整个 HTML 页面。

而且，document 对象是 window 对象的一个属性，因此可以将其作为全局对象来访问。

Document 节点具有以下特征：

- nodeType = **9 (Node.DOCUMENT_NODE)**
- nodeName = “#document”
- nodeValue = null
- parentNode = null
- 其子节点可能是一个 DocumentType、Element、ProcessingInstruction、Comment

**属性**

document 有两个内置的访问其子节点的快捷方式：

- `documentElement` ：该属性始终指向 HTML 页面的 `<html>` 元素

```js
var html = document.documentElement;
// html == document.childNodes[0] == document.childNodes.item(0) == document.firstChild
```

- `body` ：该属性可以取得对 `<body>` 元素的引用
- `doctype` 该属性可以取的对<!DOCTYPE>的引用。
- `title` ：`<title>` 引用
- `URL` ：完整的 URL，即地址栏显示的 URL
- `domain` ：只包含页面的域名
- `referrer` ：链接到当前页面的那个页面的 URL，无来源时，为空字符串。

**方法**

最常见的应用，就是取的特定的某个或某组元素的引用，然后再执行一些操作。

- `getElementById()` ：只返回文档第一次出现的元素。
  ```js
  <div id="myDiv">Some text</div>;
  var div = document.getElementById("myDiv"); // ID必须严格匹配，包括大小写。此处若为mydiv，则错误。
  ```
- `getElementsByTagName()` ：返回给定标签名的包含零或多个元素的 NodeList。NodeList 是 HTMCollection 对象，也是动态集合。[”tagName”]或 item()访问。
  ```js
  var images = document.getElementsByTagName("img");
  images.length;
  images[0].src; //获取第一个图像元素的src特性
  images.item(0);
  ```
  HTMCollection 对象有一个 namedItem()方法，该方法可以通过元素的 name 特性获取集合中的项。当然，也可以通过[”name”]访问。
  ```js
  <img src="myImage.gif" name="myImage">
  var myImage = images.namedItem("myImage");
  var myImage = images["myImage"];
  ```
  在后台，对数据索引，会调用 item()，而对字符串索引就会调用 namedItem()
- `getElementByName()` ：该方法会返回带有给定 name 特性的 NodeList。

**特殊集合**

除了属性和方法，document 对象还有一些特殊的结合，这些集合都是 HTMLCollection 对象。

- document.anchors：文档中所有带 name 特性的 `<a>` 元素
- document.forms：文档中所有的 `<form>` 元素，document.getElementsByTagName(”form”)
- document.images：文档中所有的 `<img>` 元素，document.getElementsByTagName(”img”)
- document.links：文档中所有带 href 特性的 `<a>` 元素
- ~~document.applets： `<applet>` 元素不再推荐使用。~~

**文档写入**

将输出流写入到网页：write(), writeln(), open(), close().

### Element 类型

Element 类型用于表现 XML 和 HTML 元素，提供了对元素标签名、子节点及特性的访问。

Element 具有如下特征：

- nodeType = **1 Node.ELEMENT_NODE**
- nodeName = 元素的标签名
- nodeValue = null
- parentNode = Document 或 Element

要访问元素的标签名，即可以使用 nodeName 属性，也可以使用 `tagName` 属性。在 HTML 中，标签名始终都以全部大写表示。

```js
<div id="myDiv"></div>;
var div = document.getElementById("myDiv");
div.tagName; //"DIV"
div.nodeNmae; //"DIV"
```

**HTML 元素**

所有 HTML 元素都由 HTMLElement 类型（不是直接通过该类型，而是该类型的子类）表示，HTMLElement 继承自 Element 并添加了一些属性，添加的这些属性分别对应于每个 HTML 元素中都存在的下列标准特性：

- id
- title
- lang
- dir：语言的方向，”ltr”、”rtl”。
- className：与元素的 class 特性对应，即为元素的 CSS 类。因为 class 为 ECMAScript 的保留字，因此采用 className，而不是 class。

```js
<div id="myDiv" class="bd" title="Body text" lang="en" dir="ltr"></div>;
var div = document.getElementById("myDiv");
alert(div.id); // "myDiv"
alert(div.className); // "bd"
div.id = "other_id"; // 修改特性id的值
```

**方法**

每个元素都有一或多个**特性(HTML 中称为属性)**，这些特性的用途是给出相应元素或其内容的附加信息。操作特性的 DOM 方法主要有三个：

- getAttribute()：该方法可以获取标准特性，也可以获取自定义特性。

  ```js
  alert(div.getAttribute("id");    // 效果等于div.id   返回"myDiv"
  alert(div.getAttribute("class"); // 效果等于div.className

  <div id="myDiv" my_special_attribute="hello"></div>
  div.getAttribute("my_special_attribute") //获取自定义特性
  ```

- setAttribute()：如果特性不存在，会创建该属性并设置相应的值。
  ```js
  div.setAttribute("id", "other_id"); // 效果等于div.id = "other_id" ，修改特性id的值
  ```
- removeAttribute()

**attributes 属性**

attributes 属性中包含一个 NameNodeMap，与 NodeList 类似，也是一个动态的集合。

元素的每一个特性都由一个 Attr 节点表示，每个节点都保存在 NameNodeMap 对象中，该对象有下列方法：

- getNamedItem(name)：返回 nodeName 属性等于 name 的节点
- removeNamedItem(name)：从列表中移除 nodeName 属性等于 name 的节点
- setNamedItem(node)：向列表中添加节点，以节点的 nodeName 属性为索引
- item(pos)：返回位于数字 pos 位置处的节点

**创建元素**

document.createElement()方法可以创建新元素，该方法只接受一个参数，即要创建元素的标签名(不区分大小写)。

```js
var div = document.createElement("div");
document.body.appendChild(div); // 把新创建的元素添加到文档的<body>元素中
```

### 其他类型：Text、Comment、CDATASection、DocumentType、Attr

### DOM 扩展

尽管 DOM 作为 API 已经十分完善了，但为了实现更多的功能，仍会有一些标准或专有的扩展。

对 DOM 的两个主要扩展是 Selectors API 和 HTML5。

**Selectors API**

众多 JS 库(如 jQuery)中最常用的一项功能，就是根据 CSS 选择符选择与某个模式匹配的 DOM 元素。

- querySelector()：接受一个 CSS 选择符，返回与该模式匹配的第一个元素，若无，返回 nul
- querySelectorAll()：接受一个 CSS 选择符，返回匹配的所有元素，即一个 NodeList 实例。

```js
var body = document.querySelector("body"); // 取body元素，类型选择器
var myDiv = document.querySelector("#myDiv"); // 取 ID 为“myDiv" 的元素，id选择器
var selected = document.querySelector(".selected"); // class选择器
var img = document.body.querySelector("img.button"); //
```
