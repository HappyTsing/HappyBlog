# Vue 框架: MMVM

## 理解数据驱动视图

Vue 一个核心思想是数据驱动。所谓数据驱动，是指视图是由数据驱动生成的，我们对视图的修改，不会直接操作 DOM，而是通过修改数据，来实现对 DOM 的操作。

Example from [Vue 3.0 官方文档](https://v3.cn.vuejs.org/guide/introduction.html#%E8%B5%B7%E6%AD%A5)
```js
// HTML
<div id="counter">
  Counter: {{ counter }}
</div>

// JavaScript vue实现
<script>
const Counter = {
	// Counter是个对象，其属性应为kv键值对，即data:function(){}。在EC6中可以缩写为data(){}
  data() {
    return {
      counter: 0
    }
  },
  mounted() {
    setInterval(() => {
      this.counter++
    }, 1000)
  }
}
Vue.createApp(Counter).mount('#counter')
</script>
```

此处没有操作 DOM，而仅仅是修改数据 counter 的值，就实现了计时器的效果。如果使用原生 JS 实现，应为：

```js
<div id="counter"></div>
<script>
    let num = 0;
    setInterval(() => {
      num++;
      document.getElementById("counter").innerText = "";
      document.getElementById("counter").innerText = "counter:" + num;
    }, 1000);
</script>
```

其本质上是 Vue 帮助我们做了对 DOM 的相关操作。

## MVVM

由此，我们引入前端的经典框架 MVVM，如下图：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d49f3fcb-e477-425d-a1c4-00581f19bba8/Untitled.png)

前端所有的框架几乎都符合该模型，共分为三层：

- M：Model，其实就是 data()选项
- V：View，就是定义的 html 模板，`<template>`
- VM：ViewModel，就是 vue 实例对象。 `const vm = app.mount('#app')` 。

## 组件与模块

**模块** 是 ES6 中的一个概念。我们可以将一个复杂的提供多个功能(打印学生信息、打印老师信息）的一个 js 文件，**拆分** 成多个提供单独功能的便于复用的多个 js 文件：

- 打印学生信息.js
- 打印老师信息.js

可以采用 ES6 提供的 `export` 和 `import` 来导出和导入模块。

由此引出另一个概念，当应用中的 js 都以模块来编写，那我们称这个应用是 `模块化` 的。

---

在组件出现之前的前端编程，我们 CSS 和 JS 代码由于可以在 HTML 中导入，因此都可以实现复用，但 HTML 代码就无法复用。

假设两个页面都有相同的 `header` 和 `footer` ，只能复制，而不能复用。因为 HTML 是一个整体，无法分割成 HTML 片段来导入。

**组件** 正是为了解决代码的复用等问题而出现的，它是用来实现局部(特定)功能效果的代码集合，一个组件包含：

- **HTML 片段**
- CSS
- JS
- Images
- ...

注意，此处的 HTML 并不是一个完整的 HTML，它只是其中的一个片段。比如 `header.vue` 组件，其中的 HTML 就只包含 `header` 组件的 HTML。

`组件化` 类似于模块化，当应用中的功能都是多组件的方式来编写的, 那这个应用就是一个组件化的应用。

---

结合上述的概念，Vue 中的一个 **单文件组件** `*.vue` 默认有三个部分组成：

- `<template>`：HTML 片段
- `<script>`：定义组件的 data、method、生命周期钩子函数等
- `<style lang=”css” scoped>`：CSS 样式
  - `lang` 修改语言，如 css、scss、less 等，默认为 css。若采用其他语言，需要下载相应的 loader。最终都会编译成 css。
  - `scoped` 用于限定该样式仅用于该组件。若不加 `scope` ，vue 会将所有组件的 style 配置渲染到一起，如果两个组件中都用类选择器 `.test` ，选中了 `class=”test”` 的对象 ，则会出现冲突。因此一般我们都要加上 `scoped` 。

当然，还有可选的附加自定义块，详见官方文档。

---

在 Vue 中，组件文件主要有两种：

- [单文件组件](https://v3.cn.vuejs.org/api/options-dom.html#template)：以 `.vue` 结尾的文件，具体形式如上，指一个文件中仅含有一个组件。
- [非单文件组件](https://www.bilibili.com/video/BV1Zy4y1K7SH?p=54)：一个文件中含有 n 个组件。通常直接在一个 HTML 文件里写。组件中通过[template](https://v3.cn.vuejs.org/api/options-dom.html#template)选项，添加字符串模板，字符串模板是 ES6 的功能，用两个反引号 `` 包裹。

在使用脚手架 Vue CLI 开发时，使用单文件组件形式。

## 组件

### 参数 props

假设有两个单文件组件：

- Content.vue：父组件，Student.vue 在其中局部注册。
- Student.vue：子组件

此时，父组件就可以向子组件传递参数：

- 静态传递：`age=""`
- 动态传递：`v-bind:age=""`


```js title="Content.vue"
<template>
	<div>
		<Student name="王乐卿" :age="1+1"></Student>
	</div>
</template>
<script>
	export default{
		name:'Content',
	  components:{
	    Student
	  }
}
</script>
```

同样，子组件需要说明接受哪些参数，通过 props 选项配置，共有两种：

- 数组 props：仅仅接受数据。
- 对象 props：在接受参数的同时，进行数据验证，如类型检查。

```js title="Steudent.vue"
<template>
   ...
</template>
<script>
	export default{
		name:'Student',
		/* 方法一：数组类型 */
		props:["name","age"],

		/* 方法二：对象类型 */
		props:{
		// 基础的类型检查 (`null` 和 `undefined` 值会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组的默认值必须从一个工厂函数返回
      default() {
        return { message: 'hello' }
      }
    }
	}
		setup(props){...}

}
</script>
```

### 插槽 slot

目前父组件可以传递参数给子组件，但是无法传递诸如 `<img ...>` 给子组件。插槽就可以实现这样的功能。

首先需要在子组件中挖坑：

```js title="Steudent.vue"
<template>
  <div>
    <slot></slot>
  </div>
</template>
```

然后当父组件使用子组件时，传入的内容就会显示在 `<slot>` 的位置。

```js title="Content.vue"
<template>
	<div>
		<Student>
				<img ...></img>
				这里的内容都会加到插槽中
		</Student>
	</div>
</template>
<script>
	export default{
		name:'Content',
	  components:{
	    Student
	  }
}
</script>
```

除了上述的普通插槽，还有具名插槽和作用域插槽。

下述是具名插槽，通过 `name` 为插槽提供一个名字，然后在父组件中使用 `v-slot` 来指定将哪些内容放到指定 `name` 的插槽中。

此外，还有一个较为重要的标签 `<template>` ，在此之前，这个标签是单文件组件中都会使用的一个标签。但实际上，这个标签在最外部的 `<template>` 标签之内还能使用，它唯一的作用的将一些内容包裹起来，但最后渲染生成的 DOM 中，完全不会存在这个标签。

```js
// 子组件提供具名插槽
<template>
	<div class="container">
	  <header>
	    <slot name="header"></slot>
	  </header>
	  <main>
	    <slot></slot>
	  </main>
	  <footer>
	    <slot name="footer"></slot>
	  </footer>
	</div>
</template>

// 父组件
<template>
	<base-layout>
	  <template v-slot:header>
	    <h1>Here might be a page title</h1>
	  </template>

	  <template v-slot:default>
	    <p>A paragraph for the main content.</p>
	    <p>And another one.</p>
	  </template>

	  <template v-slot:footer>
	    <p>Here's some contact info</p>
	  </template>
	</base-layout>
</template>
```

最后的作用域标签，它可以让插槽内容能够访问子组件中才有的数据。[参见](https://v3.cn.vuejs.org/guide/component-slots.html#%E4%BD%9C%E7%94%A8%E5%9F%9F%E6%8F%92%E6%A7%BD)

## 应用

每个 Vue 应用都是通过一个[全局 API](https://v3.cn.vuejs.org/api/global-api.html#createapp) `createApp`  创建一个新的 **应用实例**开始的，该方法接收两个参数：

- 第一个参数：根组件选项对象。当我们挂载应用时，该组件作为渲染的起点
- 第二个参数：将根 prop 传递给应用程序

```js
import { createApp } from 'vue'
// 根组件选项对象
const RootComponent = {
	props:['age'],
  data() {
    return {
      ...
    }
  },
  methods: {...},
  computed: {...}
  ...
}
const props = {
	age:12
}
const app = Vue.createApp(RootComponent,props)
```

vue 应用有如下四个常用的[应用 API](https://v3.cn.vuejs.org/api/application-api.html)：component()、directive()、use()、mount()。

其中前三个方法都返回 `vue应用 app` ，因此可以链式调用：

```js
Vue.createApp({})
  .component("RootComponent", RootComponent)
  .directive("focus", FocusDirective)
  .use(router);
```

---

**①component()**

component 用于向 vue 应用注册 **全局组件** ，全局注册的组件可以直接使用，无需再次导入。

**②directive()**

注册全局自定义指令。

已知有内置指令，诸如 `v-bind`、`v-on`。这些自定义指令可以帮助我们对 DOM 进行处理。

当然，有些对 DOM 的操作可能内置指令无法满足，因此 vue 允许我们定义自定义指令。

**③use()**

use 用于安装 Vue.js `插件` ，如果插件是一个对象，则它必须暴露一个  `install`  方法。如果插件本身是一个函数，则它将被视为  `install`  方法。

插件用于增强 vue，官方的插件有：

- VueX：use(store)
- Vue Router：use(router)

当然也可以自定义插件，通常将插件放置于 `pluins` 文件夹下。

**④mount()**

一个 vue 应用需要被挂载到一个 DOM 元素中，例如，如果你想把一个 Vue 应用挂载到  `<div id="app"></div>`，应该传入  `#app`：

```js
const vm = app.mount("#app");
```

需要注意的是，mount()的方法返回的不是 vue 对象，而是 `组件实例vm` 。

注意，根组件和其余组件并无不同。

---

除此之外，还有如下六个应用 API：mixin、version、unmount、config、provide。

- mixin：vue 官网**不建议在应用代码中使用。**
- version：以字符串形式提供已安装的 Vue 的版本号
- unmount：卸载应用实例的根组件。
- config：一个包含应用配置的对象 | [应用配置](https://v3.cn.vuejs.org/api/application-config.html#errorhandler)

---

### 全局注册

全局注册和局部注册主要体现在组件和指令上。

- 使用 `app.component` 创建的组件是全局注册的，也就是说它们在注册之后可以用在任何新创建的组件实例的模板中。
- 使用 `app.directive` 创建的指令也是全局注册的。

### 局部注册

如果使用了诸如 Babel 和 webpack 的模块系统，推荐创建一个  `components`  目录，并将每个组件放置在其各自的文件中。

然后在局部注册之前导入每个你想使用的组件。

- 使用 `components` 注册局部组件
- 使用 `directives` 注册局部指令，注意使用时需要加上前缀 `v-` ，但命名时无需添加。

```js
// ComponentB
<template>
  <div class="home">
    <ComponentA/>
		<ComponentB/>
		<input v-focus>
  </div>
</template>

<script>
import ComponentA from './ComponentA'
import ComponentC from './ComponentC'

export default {
  components: {
    ComponentA,
    ComponentC
  }
	directives: {
    focus: {
      mounted(el) {
        el.focus()
      }
    }
  }
}
</script>
```

如上，就在 ComponentB 文件中局部注册了 ComponentA 和 ComponentC，并且在 ComponentB 的模板 template 中使用了这两个组件。

同时，声明了一组可用于组件实例中的指令 focus，并且在 template 中使用了自定义的 `v-focus` 指令。

## **实例 property**

Vue 还通过组件实例暴露了一些内置 property，如  `$data`  和  `$emit` 等。这些 property 都有一个  `$`  前缀，以避免与用户定义的 property 名冲突。

参见：[Vue3 | 实例 property](https://v3.cn.vuejs.org/api/instance-properties.html)

## 模板语法

vue 的模板语法有两类：

- **插值语法**：{{ ... }}，用于解析标签体内容。双括号内的会作为 js 表达式解析，意味着里面可以写 js 代码。此外，也可以直接读取 data()中定义的变量。
- **指令语法**：如 v-bind，用于解析标签，包括标签属性、标签体内容、绑定事件等。此外，如 `v-bind:href=" ... "` 的形式，此处的 `" ... "` 中的内容也会作为 js 表达式解析。

```js
<div>
<a v-bind:href="url">{{name}}</a>
</div>

data(){
	return {
		url:"www.leqing.work"
		name:"乐乐博客"
	}
}
```

支持的 js 格式：

```js
{
  {
    number + 1;
  }
}

{
  {
    ok ? "YES" : "NO";
  }
}

{
  {
    message.split("").reverse().join("");
  }
}

<div v-bind:id="'list-' + id"></div>;
```
