# 指令

## v-bind

`v-bind` 指令用于数据 **单向绑定**，将 data()中定义的数据绑定到页面上。即 `data()→ 页面` 。

```js
<!-- 完整语法 -->
<a v-bind:href="url"> ... </a>

<!-- 缩写 -->
<a :href="url"> ... </a>

<!-- 动态参数的缩写 -->
<a :[key]="url"> ... </a>

data(){
	return {
		url:"www.leqing.work"
	}
}
```

## v-model

`v-model` 指令用于数据 **双向绑定**，只能应用于表单类元素（输入类元素)：

- `<input>` ，根据 `type="xxx"` 的不同，分为：
  - 文本框：text
  - 密码：password
  - 单选：radio，需要为多个 radio 赋上同一个 name。
  - 多选：checkbox
- `<select>` ：下拉选项框
- `<textarea>` ：多行输入
- components

```js
<div>
	单向数据绑定：<input type="text" v-bind:value="name"><br/>
	双向数据绑定：<input type="text" v-model:value="name"><br/>
	<!-- value可以省略 -->
	双向数据绑定：<input type="text" v-model="name"><br/>

	<!-- 当v-model使用在非表单类元素上时，报错 -->
	<h2 vmodel:x="name">你好</h2>
</div>

data(){
	return {
		name:"xxx"
	}
}
```

## 收集数据

`v-model`  在内部为不同的输入元素使用不同的 property 并抛出不同的事件：

- text 和 textarea 元素使用  `value` property 和  `input`  事件；
- checkbox 和 radio 使用  `checked` property 和  `change`  事件；
- select 字段将  `value`  作为 prop 并将  `change`  作为事件。

## v-on

`v-on`指令，它用于监听 DOM 事件，在这里参数是监听的事件名。

```js
<!-- 完整语法 -->
<a v-on:click="doSomething"> ... </a>

<!-- 缩写 -->
<a @click="doSomething"> ... </a>

<!-- 动态参数的缩写 -->
<a @[event]="doSomething"> ... </a>

methods:{
	click(){
		// xxx
	},
	click_times(num,event){
		// click num次
	}
}
// 传入参数num和event
<a @click_times="doSomething(3,$event)"> ... </a>
```

动态参数：这里的 `[key]和[event]` 会被作为一个 JavaScript 表达式进行动态求值，求得的值将会作为最终的参数来使用。

比如，当  `event`  的值为  `"focus"`  时，`v-on:[event]`  将等价于  `v-on:focus`

### 修饰符

修饰符 (modifier) 是以半角句号  `.`  指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。

事件修饰符如：

```js
<!-- 阻止单击事件继续冒泡 -->
<a @click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a @click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form @submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div @click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div @click.self="doThat">...</div
```

`click` 事件常用的有：

- `prevent` ：阻止默认事件
- `stop`：组织事件冒泡
- `once`：事件只触发一次

`keyon`、 `keydown` 使用按键修饰符和系统修饰符。

按键修饰符：

- `.enter`
- `.tab`
- `.delete` (捕获“删除”和“退格”键)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

系统修饰符：

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

## v-if

用于条件性地渲染一块内容。这块内容只会在指令的表达式返回 truthy 值的时候被渲染。

```js
<div v-if="type === 'A'">A</div>
<div v-else-if="type === 'B'">B</div>
<div v-else-if="type === 'C'">C</div>
<div v-else>Not A/B/C</div>
```

v-show 和 v-if 非常相似。

`v-if`  是“真正”的条件渲染，因为它会确保在切换过程中，条件块内的事件监听器和子组件适当地被销毁和重建。

`v-if`  也是**惰性的**：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。

相比之下，`v-show`  就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。

一般来说，`v-if`  有更高的切换开销，而  `v-show`  有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用  `v-show`  较好；如果在运行时条件很少改变，则使用  `v-if`  较好。

## v-for

当  `v-if`  与  `v-for`  一起使用时，`v-if`  具有比  `v-for`  更高的优先级，因此不推荐二者一起使用。

v-for 可以遍历 data()中定义的数组、对象、字符串或自然数。

注意，需要指定 `:key` ，作为虚拟 DOM 的标识，当数据发生变化时，Vue 会根据新数据生成新的虚拟 DOM，随后 Vue 进行新旧虚拟 DOM 的差异比较：

- 旧虚拟 DOM 中找到了与新虚拟 DOM 相同的 key，若虚拟 DOM 中内容未变化，直接使用之前的真是 DOM，否则生成新的真是 DOM。
- 若没有找到相同 key 的旧虚拟 DOM，直接创建新的真实 DOM，随后渲染到新页面。

因此，使用 `:key` 首先可以加快渲染速度。

但如果对数据存在逆序添加、逆序删除等破坏顺序地操作，使用 `index` 作为 `key` 会造成渲染效率低，甚至如果包含了输入类的 DOM，会出现错误的 DOM 渲染问题。

因此，我们最好使用每条数据的唯一标识作为 key，如 id、身份证号等唯一值。

不过如果不存在逆序添加、逆序删除等操作，可以直接使用 index 作为 key，也不会有问题。

```js
<div>
<h2>遍历数组</h2>
<ul>
  <li v-for="(p,index) in persons" :key="index">
    姓名：{{ p.name }} 年龄：{{p.age}}
  </li>
</ul>

<h2>遍历对象</h2>
<ul>
  <li v-for="(value,key) in car" :key="key">
    {{key}} : {{value}}
  </li>
</ul>
</div>

<h2>遍历字符串</h2>
<ul>
  <li v-for="(char,index) in str" :key="index">
    {{index}} : {{char}}
  </li>
</ul>
</div>

<h2>遍历指定次数</h2>
<ul>
  <li v-for="(number,index) in 3" :key="index">
    {{number}} : {{index}}
  </li>
</ul>
</div>

<!-- 遍历三次，结果如下：
1:0
2:1
3:2
-->

data() {
  return {
		persons:[
				{id:1,name:"张三",age:18},
				{id:2,name:"李四",age:22},
				{id:3,name:"王五",age:23}
		],
    car:{
				name:"奥迪A4",
				price:"20w",
				color:"black"
		},
		str:"hello"
  }
}
```
