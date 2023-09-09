# API

## 选项式 API

Vue 的开发有两种方式，一种是 Vue2 就开始支持的`Options API` 。另一种是 Vue3 的新特性 `Composition API` 。

根据[官方 API 文档](https://v3.cn.vuejs.org/api/options-api.html)，共有如下几类选项：

### Data：操作数据的选项

- props：用于从父组件接收数据的数组或对象。使用对象时，可以验证数据的类型等等。
- data：定义响应式数据
- methods：方法
- computed：计算属性，底层实现和 methods 相同，但存在缓存。
- watch：侦听器，大部分时候应该使用 computed 实现，而不是 watch。很容易滥用！
- emits、expose

### DOM：DOM 相关的选项

- template：一个字符串模板，用作 component 实例的标记。模板将会**替换**所挂载元素的  `innerHTML`。挂载元素的任何现有标记都将被忽略，除非模板中存在通过插槽分发的内容。
- render

### 生命周期钩子

每个组件在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做 **生命周期钩子** 的函数，这给了用户在不同阶段添加自己的代码的机会。

- created
- mounted
- updated
- ...

### 资源

- directive：声明一组可用于组件实例中的指令
- components：声明一组可用于组件实例中的组件。
- 组合：
  - setup：Vue3 中新的组件选项，是组件内部使用 Composition API 的入口点。
  - mixins：不再推荐使用。用于在 Vue2 中创建可重用组件。Vue3 中更推荐使用 Composition API。
  - extends、provide/inject

### 杂项

- name：显示声明组件的名词，若没有显式声明，若单文件组件 `HelloWorld.vue` ，则 Vue 默认该组件名为 `HelloWorld` 。我们也应该将其显示声明为 `HelloWorld` 。
- ...

## 组合式 API

在选项式 API 中，我们在一个 component 中使用 (`data`、`computed`、`methods`、`watch` 等)组件 **选项** 来组织逻辑。

这种方式虽然很有效，但随着组件的变大，逻辑关注点的列表也会增长，尤其对于那些一开始没有编写这些组件的人来说，这会导致组件难以阅读和理解。

且如一个组件 `Content.vue` 中可能有多个功能，如：搜索和筛选。

此时，这两个功能的数据都存放在 data 中，方法都存放在 methods 中，就出现了一个问题：**处理同一个功能的代码并不连续**。

这种碎片化使得理解和维护复杂组件变得困难。选项的分离掩盖了潜在的逻辑问题。此外，在处理单个逻辑关注点时，我们必须不断地“跳转”相关代码的选项块。

因此，Vue3 引入了 **组合式 API**，它将同一个逻辑关注点相关代码收集在一起。

### 组件标签：setup

为了使用组合式 API，引入 `setup` 组件标签：

- 避免在 setup 中使用 this。因为它不会找到组件实例。setup 的调用发生在  `data`、`computed` 或  `methods`  被解析之前，所以它们无法在 setup 中被获取。
- 在创建组件实例时，在初始 prop 解析之后立即调用  `setup`。在生命周期方面，它是在  **[beforeCreate](https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#beforecreate)**  钩子之前调用的。
- setup 选项可接受两个参数：① props(响应式) ② context
  ```js
  export default {
    props: {
      name: String,
    },
    setup(props) {
      console.log(props.name);
    },
  };
  ```
- 已知 props 是响应式的，但 **setup 内部定义变量是非响应式的**，而本来在 data()中定义的值类型和引用类型的变量都是响应式的。因此引入[响应性 API](https://v3.cn.vuejs.org/api/reactivity-api.html)。

### 响应性 API

!!! note "响应式 API"

    - `ref` ，可以将数值类型和引用类型都变为响应式。如果是引用类型，其内部使用 reactive 实现。因此当出现引用类型（数组、对象）的时候，建议直接使用 reactive，这样就不用 `xxx.value` 了。
    - `shallowRef` ，只能将数值类型的变为响应式。
    - `reactive` ，只能将引用类型变成响应式。
    - `sheallowReactive` ，只讲传入的对象的第一层变为响应式。
    - `toRef` ，为源响应式对象的某个 property 新创建一个 `ref` 。
    - `toRefs` ，理解为批量的 `toRefs` 。

```js title="ref、reactivate 示例"
<template>
	<!-- 在模板里使用的时候，千万不要加上.value，vue3后台当看到是RefImpl对象时，默认会取.value-->
  <h1>姓名：{{ name }}</h1>
  <h1>年龄：{{ age }}</h1>

  <h1>工作种类_ref：{{ job_ref.type }}</h1>
  <h1>工作薪水_ref：{{ job_ref.salary }}</h1>
  <h1>工作种类_reactive：{{ job_reactive.type }}</h1>
  <h1>工作薪水_reactive：{{ job_reactive.salary }}</h1>
  <h1>爱好{{ hobby }}</h1>

  <button @click="changeInfo">changeInfo</button>
</template>

<script>
import { ref, reactive, toRef, toRefs } from "vue";
export default {
  setup() {
    let name = ref("张三");
    let age = ref(18);
    let job_ref = ref({
      type: "前端",
      salary: "30k",
    });

    let job_reactive = reactive({
      type: "前端",
      salary: "30k",
    });

    let hobby = reactive([1, 2, 3]);

    function changeInfo() {
      name.value = "李四";
      age.value = 20;
      console.log(name); // RefImpl对象，依靠 Object.defineProperty()的get set实现响应式

      job_ref.value.type = "后端";
      job_ref.value.salary = "40k";
      console.log(job_ref); // RefImpl对象
      console.log(job_ref.value); // Proxy对象，依靠 ES6的Proxy实现

      job_reactive.type = "后端";
      job_reactive.salary = "40k";
      console.log(job_reactive); // Proxy对象

      console.log(hobby); // Proxy对象
      // 可以用下标修改
      hobby[0] = 2;

      // 想用temp数组代替当前数组的内容，不能使用 hobby = temp;
      let temp = [3, 2, 1];

      // 先清空数组，然后将temp里的内容一个一个push进去，此处使用 ES6的扩展符号来快速实现
      hobby.length = 0;
      hobby.push(...temp);
    }

    return { name, age, job_ref, job_reactive, hobby, changeInfo };
  },
};
</script>
```

如上，我们创建了一个对象 `job_reactive` ，在 `<template>` 中使用时，每个都需要加上 `job_reactive.` 前缀来调用，非常的麻烦，因此引入 `toRef` ，用于单独交出对象中的某个属性。

```js title="toRef、toRefs 示例"
<template>
  <h1>工作种类：{{ type }}</h1>
  <h1>工作薪水：{{ salary }}</h1>
  <!-- toRef -->
  <h1>c：{{ c }}</h1>

  <!-- toRefs -->
  <h1>c：{{ a.b.c }}</h1>
  <button @click="changeInfo">changeInfo</button>
</template>

<script>
import { reactive, toRef, toRefs } from "vue";
export default {
  setup() {
    let job = reactive({
      type: "前端",
      salary: "30k",
      a: {
        b: {
          c: 30,
        },
      },
    });

    // 这样只是一个简单的赋值，相当于 let type = "前端"，显然不是响应式的。
    // let type = job.type;

    /** 注意，此时的type和job.type是联系起来的，无论是修改type还是job.type都是相同的
     *  toRef的意义在于
     *          1. 可以直接return {type:toRef(job,"type")}
     *          2. 如果直接return {type:job.type}的话，就像上面说的，就是直接返回了一个字符串,因此不是响应式的
     *          3. 总结：toRef让reactive的对象中的某个属性可以单独拿出来，保证它是响应式的，并且和源数据关联起来。
     */
    let type = toRef(job, "type");
    let salary = toRef(job, "salary");
    let c = toRef(job.a.b, "c");
    console.log(type); // ObjectRefImpl，和RefImpl类似，需要通过.value来取值

    function changeInfo() {
      // 此时修改salary有两种方式
      salary.value = "40k";
      job.salary = "40k";
    }

    return { changeInfo, type, salary, c };

    /** 不在外定义let type = toRef(job, "type"); 直接返回
      return {
      changeInfo,
      type: toRef(job, "type"),
      salary: toRef(job, "salary"),
      c: toRef(job.a.b, "salary"),
    };
     */

    // 上述的方法还是比较麻烦，因为要写多次 toRef。引入 toRefs，可批量。

    let x = toRefs(job);
    console.log(x); //ObjectRefImpl，是一个和job类似的对象

    // ES6语法，相当于把每个 key:value 分别传入。
    // 注意：存在嵌套job.a.b.c 而toRefs的key都是第一层的，也就是job.a。因此在外面使用时需要 a.b.c
    return { ...toRefs(job) };
  },
};
</script>
```

### 生命周期钩子函数

在选项式 API 中，有诸如 created、mounted 等钩子函数，在组件式 API 中，可以在 setup 内部通过写 onMounted 等钩子函数，来实现相同的功能。

!!! note

    注意：setup 中没有 ~~beforeCreate~~ 和 ~~created~~ 这两种钩子函数，其余都用 `onX` 来表示，即前面加 `on` 前缀，然后首字母变大写。

    [参见：生命周期钩子](https://v3.cn.vuejs.org/api/composition-api.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90)

### 处理数据

- 在选项式 API 中，我们在 data()中定义响应式数据，而组件式 API 中，可以直接定义变量，然后使用响应式 API 将其转化为响应式变量。
- 同理，methods 选项也无需使用，因为可以直接书写方法。
- watch 和 computed 与前两者不同，二者如果要在 setup 内使用，需要导入。

### 导入依赖

在 setup 中想要使用

- onMounted 等钩子函数
- watch、computed 等处理数据的函数
- ref、reactive、toRef 等响应式数据的函数

必须要先导入：

```js
<script>
import { ref, onMounted, watch, computed } from 'vue'
export default {
	setup(){
		// use ref、watch、onCreated
	}
}
</script>
```

### setup return{}

已知 setup 是一个函数，如果想要在 `<template>` 中使用 setup 中定义的响应式变量、计算属性、方法等，必须要将其返回。

```js
setup(){
	const name = ref("")
	funciton changeName(){}
	return { name, changeName }
}
```
