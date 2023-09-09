# 引用类型和对象

在 ECMAScript 中，引用类型是一种数据结构，用于将数据和功能组织在一起。不妥当的称呼为: **类**。

**对象是某个特定引用类型的实例**。新对象是使用 `new` 才做附后跟一个 `构造函数` 来创建的。

构造函数的形式和普通函数没有区别，只是该函数是处于创建新对象的目的而定义的。

## Object 类型

Object 类型并不具备多少功能，但对于在应用程序中存储和传输数据而言，是十分理想的选择，创建 Object 实例的方法有两种：

```js title="方法一：对象字面量表示法"
var person = {
  age: 32,
  name: ["Bob", "Smith"],
  gender: "male",
  interests: ["music", "skiing"],
  bio: function () {
    alert(
      this.name[0] +
        " " +
        this.name[1] +
        " is " +
        this.age +
        " years old. He likes " +
        this.interests[0] +
        " and " +
        this.interests[1] +
        "."
    );
  },
  greeting: function () {
    alert("Hi! I'm " + this.name[0] + ".");
  },
};
```

```js title="方法二：new"
var person = new Object();
person.age = 32;
person.xxx = xxx;
```

获取对象属性也有两种方法：

```js title="方法一：点表示法"
person.name[0];
```

```js title="方法二：n括号表示法"
person["name"][0];
```

## Array、Date、RegExp 类型

除 Object 类型外，还有 Array、Date 类型等，不赘述。

此处介绍下 RegExp 类型，ECMAScript 通过 RegExp 来支持正则表达式。

## Function 类型

在 ECMAScript 中，每个函数都是 Function 类型的实例，而且都与其他引用类型一样具有属性和方法。

**由于函数是对象，因此函数名实际上也是一个指向函数对象的指针。**

如以下三种写法几乎是等价的：

```js
// 函数声明
function sum(num1, num2) {
  return num1 + num2;
}

// 函数表达式
var sum = function (num1, num2) {
  return num1 + num2;
};

// 不推荐，这会导致解析两次代码
var sum = new Function("num1", "num2", "return num1+num2");
```

**函数声明与函数表达式的区别**

解析器会先解析 **函数声明**，因此下述代码可以正常运行：

```js
alert(sum(1,1));
function sum(num1,num2){...};
```

但 **函数表达式** 只会顺序运行，下述代码会报错：

```js
alert(sum(1,1));
var sum = function (num1,num2){...};
```

**深入理解重载**

由于函数名只是一个指向函数对象的指针，因此 ECMAScript 函数没有重载也就便于理解了，实际上第二次定义相同函数名的函数时，实际上覆盖了第一个函数的函数名变量。

```js
var sum = function () {}; // 第一次定义
sum = function () {}; // 第二次定义，覆盖了sum变量
```

**函数作为值**

由于函数名本身就是变量，所以函数也可以作为值使用。

不仅可以向传递参数一样把一个函数传递给另一个函数，而且也可以将一个函数作为另一个函数的结果返回。

```js
// 第一个参数是函数，第二参数是该函数需要的参数
function CallFunction(Function, Argument) {
  return Function(Argument);
}
```

## 基本包装类型：Boolean、Number、String

## 单体内置对象：Global

ECMAScript 对内置对象的定义为：有 ECMAScript 实现提供、不依赖于宿主环境的对象。

也就是说，开发人员不必显式的实例化内置对象，因为它们已经被实例化了。例如：Object、Array、Math 和 String

本次介绍另外两个单体内置对象：Global

**Global 对象**

该对象是 ECMAScript 中最特别的一个对象，因为不属于任何其他对象的属性和方法，最终都是它的属性和方法。例如：

- URI 编码方法：encodeURI()、encodeURIComponent()，对 URI 进行编码，以便发送给浏览器。decodeURI()、decodeURIComponent()进行解码。
- eval()方法：该方法就像一个 ECMAScript 解析器，它只接受一个参数，即要执行的 ECMAScript 字符串。
  ```js
  eval(alert("hi"));
  ```

Global 对象的属性：

| 属性                                                                           | 说明     |
| ------------------------------------------------------------------------------ | -------- |
| undefined、Infinity、NaN                                                       | 特殊值   |
| RegExp、Date、Number、String、Boolean、Function、Array、Object                 | 构造函数 |
| Error、EvalError、RangeError、ReferenceError、SyntaxError、TypeError、URIError | 构造函数 |

ECMAScript 没有明确支持如何直接访问 Global 对象，但 Web 浏览器都是将这个对象作为 `window` 对象的一部分加以实现的。因此可以通过 `window` 对象来访问。

## 对象原型

通过 `原型` 这种机制，JavaScript 中的对象从其他对象继承功能特性；这种继承机制与经典的面向对象编程语言的继承机制不同。

每个函数都有一个 `prototype` （原型）属性，该属性是一个指针，指向一个对象。该对象的用途是包含可以由特定类型的所有实例共享的属性和方法。

ECMAScript 仅仅支持实现继承（不支持接口继承），通过**原型链**来实现。
