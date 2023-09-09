# 基本语法

!!! note "参考: [JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)"

## 变量

**声明变量**

- var：可以多次声明，且拥有[变量提升](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/var#%E5%8F%98%E9%87%8F%E6%8F%90%E5%8D%87)。
- let：不可多次声明，**在任何时候都应该使用 let**。除非需要支持 11 版之前的 Internet Explorer
- const 用于声明一个或多个常量，声明时必须进行初始化，且初始化后值不可再修改。

**变量类型 Number、String、Boolean、Array、Object**

**String**

- 连接字符串：+
- 字符串长度：myString.length；
- 获取字符串的第 n 个字符：myString[n-1]；
- 转换大小写：toLowerCase() 和 toUpperCase()
- 替换字符串的某部分：replace()
- 获取指定位置处字符：charAt(index) 方法
- 查找子串并提取：myString.indexOf(’substring’); //找不到返回-1

**Array**

```js
// 一维数组
let arrayname=new Array（...）;
let arrayname=[...];

// 多维数组
let arrayname=[ [...],[...] ];

// 修改数组
arrayname[index]=new_value;

// 数组长度
arrayname.length;

// 数组排序sortby 是可选的，规定排序顺序，必需是函数。如果没有参数的话，将会按照字符编码顺序进行排序。如果想按照其他标准进行排序，则需要提供比较函数。
arrayObject.sort(sortby);

// 进出栈操作，最后一位移入或移除
arrayname.pop();
arrayname.push(“1”，“2”...，“n”);

// 数组和字符串之间的转换：

// 1. split（）：字符串->数组
"1:2:3:4".split(":")    // returns ["1", "2", "3", "4"]
"|a|b|c".split("|")    // returns ["", "a", "b", "c"]

// 2. join（）方法：数组->字符串
["1", "2", "3", "4"].join(":"); // returns "1:2:3:4"
["", "a", "b", "c"].join("|"); // returns "|a|b|c"
```

## 条件判断：if、switch

```js
if () {

} else if () {

} else {}

switch (expression) {
    case choice1:
        // code
        break;

    case choice2:
        // code
        break;

    default:
        //一个都没有匹配时运行
}
```

## 循环：for、while

```js
for (a in b) {
}
for (var i = 0; i < n; i++) {}

while (cond) {}
do {} while (cond);
```

可用 continue、break 控制。

## 异常：[try、catch](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/try...catch)

```js
try {
   try_statements
}
[catch (exception_var_1 if condition_1) { // non-standard
   catch_statements_1
}]
...
[catch (exception_var_2) {
   catch_statements_2
}]
[finally {
   finally_statements // 无论是否有异常都会执行
}]
```

## 函数：function

```js
function fc_name(params) {
  // do something
  // arguments[0] 调用arguments对象获取参数，当然也可直接使用params
  // arguments.length
  return rt_value;
}

// 匿名函数
var myButton = document.querySelector("button");
myButton.onclick = function () {
  //此function没有fc_name
  alert("hello");
};
```

ECMAScript 函数的参数与其它语言不同，它不介意传来多少参数，也不介意参数是什么类型。

即便你定义的函数只接受两个参数，但调用时可以传递一个、三个甚至不传递参数。

**原因是 ECMAScript 中的参数在内部是用一个数组来表示的，函数接收到的始终是这个数组，而不关心数组的内容。**

实际上，在函数体内可以通过 `arguments` 对象来访问这个参数数组，从而获取传递给函数的每一个参数。

此外，**没有重载**。函数名只属于后定义的函数。