# ES6

## 缩写

!!! note "参考：[es6-object](https://cookfront.github.io/2015/06/07/es6-object/)"

```js
// 在ES6中，当属性名和局部变量名是一样时，我们可以省略它后面的冒号和值
function createPerson(name, age) {
  return {
    name: name,
    age: age,
  };
}

function createPerson(name, age) {
  return {
    name,
    age,
  };
}

// 除了属性可以简写外，方法也是可以简写的。在ES5或之前，我们定义方法必须像下面这样：
var person = {
  name: "Nicholas",
  sayName: function () {
    console.log(this.name);
  },
};
// 但在ES6中，通过省略冒号和function关键字，使语法变得更加简洁。你可以重写之前的例子：
var person = {
  name: "Nicholas",
  sayName() {
    console.log(this.name);
  },
};
// 上述两种语法省略在vue中经常出现
```

## 模板字符串

!!! note "参考：[Template_literals](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals)"

即反引号`，通过反引号包裹，可以很方便的实现一些功能。

语法：

```js
`string text``string text line 1
 string text line 2``string text ${expression} string text`;

tag`string text ${expression} string text`;
```

示例：

```js
var a = 5;
var b = 10;
console.log(`Fifteen is ${a + b} and
not ${2 * a + b}.`);
// "Fifteen is 15 and
// not 20."
```

## 解构赋值

**解构赋值** 语法是一种 Javascript 表达式。通过 **解构赋值**，可以将属性/值从对象/数组中取出,赋值给其他变量。

- 解构数组：使用[]将变量括起来接收

```js
// 基础使用
var foo = ["one", "two", "three"];

var [one, two, three] = foo;
console.log(one); // "one"
console.log(two); // "two"
console.log(three); // "three"

// 将剩余数组赋值给一个变量
var [a, ...b] = [1, 2, 3];
console.log(a); // 1
console.log(b); // [2, 3]

// 设置默认值
var a, b;

[a = 5, b = 7] = [1];
console.log(a); // 1
console.log(b); // 7
```

- 解构对象

```js
// 基础用法
var o = { p: 42, q: true };
var { p, q } = o;

console.log(p); // 42
console.log(q); // true

// 默认值
var { a = 10, b = 5 } = { a: 3 };

console.log(a); // 3
console.log(b); // 5
```

## 模块化

在 ES6 前， 实现模块化使用的是 RequireJS 或者 seaJS（分别是基于 AMD 规范的模块化库， 和基于 CMD 规范的模块化库）。

ES6 引入了模块化，其设计思想是在编译时就能确定模块的依赖关系，以及输入和输出的变量。

ES6 的模块化分为：**导出（export） @与导入（import）两个模块**。

模块导出，可以导出各种类型的变量，如字符串、数值、函数和类。

导出的两种类型：

- export default：只能有一个，且导入时可以随意命名
- 普通 export：可以有无数个，在导入时需要加上{}

```js
// xxx.js
var name = "wlq";
function sayhi(num) {
  console.log("hi");
}
function plus(num) {
  return num++;
}
export default plus;
export { sayhi };
export { name as name_alias }; // 导出并重命名
```

导入

```js
import random_name_for_default from "./xxx.js";
import {sayhi} from "./xxx.js";
import {name_alias as name_alias_alias} "./xxx.js";   //此处可以再取一个别名
```

!!! note

	To load an ES module, set "type": "module" in the package.json or use the .mjs extension


## Promise 对象

!!! note "参考：[es6-promise](https://www.runoob.com/w3cnote/es6-promise.html)"

是异步编程的一种解决方案。

从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。


## async 关键字

async 是 ES7 才有的与异步操作有关的关键字，和 Promise ， Generator 有很大关联的。

## 展开语法

```js
list = [1, 2, 3];
list_new = [1];
list_new.length = 0; // 清空list_new
list_new.push(...list); // list_new [1,2,3]

obj = { a: 1, b: 2 };
obj_new = {};
```
