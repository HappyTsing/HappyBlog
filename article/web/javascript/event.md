# 事件

## 简介

JS 与 HTML 之间的交互是通过事件实现的。

**事件**，就是文档或浏览器窗口中发生的一些特定的交互瞬间。可以使用

**侦听器** (或处理程序)来来预定事件，以便事件发生时执行相应的代码。

**事件流**：描述的是从页面中接受事件的顺序。

IE 和 Netscape 开发团队提出了两种几乎完全相反的事件流的概念。

**一、IE：事件冒泡流**，事件开始由最具体的元素接受，然后逐级向上传播到较为不具体的节点。

```js
<html>
  <head>
    <title>Event Bubbling Example</title>
  </head>
  <body>
    <div id="myDiv">Click Me</div>
  </body>
</html>
```

如果你单机了页面中的 `<div>` 元素，那么这个 click 事件会按照如下顺序传播：

!!! success "①`<div>` ②`<body>` ③`<html>` ④document"

**二、NC：事件捕获流**，事件捕获的思想是不太具体的节点应该更早接受到事件，而最具体的节点应该最后接受到。如上述 click 事件传播顺序应为：

!!! success "①document ②`<html>` ③`<body>` ④`<div>`"

DOM 事件流：**DOM2 级事件** 规定的事件流包括三个阶段：

1. 事件捕获阶段：捕获阶段，事件从 document 到 `<html>` 再到 `<body>` 就停止。
2. 处于目标阶段：事件在 `<div>` 上发生
3. 事件冒泡阶段：冒泡阶段发生，事件又传播回文档。

## 事件处理程序

事件就是用户或浏览器自身执行的某种动作。诸如 click、load 和 mouseover，都是事件的名字。

而响应某个事件的函数就叫做 **事件处理程序(或事件侦听器)**，事件处理程序的名字以 `on` 开头，因此 click 事件的事件处理程序就是 onclick，load→onload。

为事件指定处理程序的方式也有多种：

### HTML 事件处理程序

某个元素支持每种事件，都可以使用一个与相应事件处理程序同名的 HTML 特性来制定，这个特性的值应该是能够执行的 JS 代码。

```js
<input type="button" value="Click Me" onclick="alert('clicked')" />

<script>
		function showMessage(){alert("Hellow");}
</script>

<input type="button" value="Click Me" onclick="showMessage()" />
```

### DOM0 级事件处理程序

每个元素都有自己的事件处理程序属性，如 onclick，将这个属性设置为一个函数，就可以指定事件处理程序。

```js
var btn = document.getElementById("myBtn");
btn.onclick = function () {
  alert("clciked");
};
```

### DOM2 级事件处理程序

DOM2 级事件定义了两个方法，用于处理指定和删除事件处理程序的操作：

- addEventListener()
- removeEventListener()

所有 DOM 节点中都包含这两个方法，并且都接受三个参数：

- 要处理的事件名
- 作为事件处理程序的函数
- 布尔值
  - true：捕获阶段调用事件处理程序
  - false：冒泡阶段调用事件处理程序

```js
var btn = document.getElementById("myBtn");
btn.addEventListener(
  "click",
  function () {
    alert(this.id);
  },
  false
);
btn.addEventListener(
  "click",
  function () {
    alert("clicked");
  },
  false
);
```

可见，使用 DOM2 级事件处理程序的好处是可以添加多个事件处理程序。

注意：通过 addEventListener()添加的事件处理程序只能通过 removeEventListener()来移除。

### IE 事件处理程序和跨浏览器的事件处理程序

暂且不谈。

## 事件对象

在触发 DOM 上的某个事件时，会产生一个事件对象 `event` ，该对象包含着所有与事件有关的信息。

兼容 DOM 的浏览器都会将一个 event 对象传入到事件处理程序中，无论是 DOM0 级还是 DOM2 级的事件处理程序，都会传入 event 对象。

event 对象包含创建它的特定事件有关的属性和方法：

- type：被触发的事件的类型
- target：事件的目标
- stopPropagation()：取消事件的进一步捕获或冒泡
- ...

```js
var btn = document.getElementById("myBtn");
var f = function (event) {
  alert(event.type); //"click"
};

btn.onclick = f;
btn.addEventListener("click", f, false);
```
