# Usage

First of all, [install](https://repo1.maven.org/maven2/org/soot-oss/soot/4.3.0/soot-4.3.0-jar-with-dependencies.jar) soot.

在 soot 中，区分了三种类：

- argument classes：用户在命令行的 classname 中显式指定的类，也可以是 -process-dir 指定的目录中扫描得到的类。
- application classes：需要 soot 分析，并被转换为输出的类。所有 argument classes 必须式 application classes。
- library classes：application classes 引用的类，但不是 application classes。它们会被用于分析和转换，但自己不会被转换或输出。

存在两种模式会影响类的分类方式：

- application mode：该模式下，argument 引用的类将成为 application classes
- non-application mode：在该模式下，argument 引用的类将成为 library classes

使用`--app`开启 application mode。

```
java [javaOptions] soot.Main --app classname
```

## Shell

使用命令行操作 soot，整体命令如下：

```shell
java [javaOptions] soot.Main [sootOptions] classname
```

- `javaOptions`：java 可以接收的选项，例如通过 `-cp $SOOT_HOME` 来指定 soot 的 jar 包目录.
- `sootOptions`：soot 可以接收的选项，通过 `java [javaOptions] soot.Main -h` 获取选项列表
- `classname`：soot 要分析的类

### options

#### general options

| general options | desc                                                                 |
| --------------- | -------------------------------------------------------------------- |
| `-h`            | 显示帮助信息                                                         |
| `-pl`           | 打印支持的 phases                                                    |
| `-ph <phase> `  | 打印指定 phase 的详细信息                                            |
| `-w`            | Run in whole-program mode, 启用过程间分析, enable wjpp, cg, and wjap |

#### input options

| input options                                   | desc                                                       |
| ----------------------------------------------- | ---------------------------------------------------------- |
| `-cp <path>`                                    | 需要 soot 分析的类的地址                                   |
| `-pp`                                           | Prepend the given soot classpath to the default classpath. |
| `-allow-phantom-refs`                           | Allow unresolved classes; may cause errors                 |
| `-no-bodies-for-excluded`                       | Do not load bodies for excluded classes                    |
| `-process-path <dir>`<br />`-porcess-dir <dir>` | 处理 dir 中所有的类,，该 dir 也可以是 jar 包               |

**`-pp`的必要性**

soot 有自己的 classpath，该 classpath 下是 soot 需要分析的文件，如`A.class`。

但是当我们使用 `java soot.Main -cp $SOOT_CP A.class`，仍然会报错：java.lang.RuntimeException: None of the basic classes could be loaded! Check your Soot class path!

其原因是 soot 需要用到 java 的自带的各种类，如 java.lang.Object，但当前的 classpath 下肯定不存在包含该类的 jar 包，因此报错。

此时推荐的解决办法有两种：

- 添加`jce.jar`, `rt.jar` 到 soot 的 classpath。其中`jce.jar`是使用了`-w`参数进入过程间分析才需要用到。
- 采用 `-pp` options，前提是正确设置 `$JAVA_HOME`，会自动加载`jce.jar`和 `rt.jar`。

此外还有一种不推荐的方法：

- `-allow-phantom-refs`：soot 将为无法解析的类创建一个 phantom class。本质是告诉 soot，无法提供你需要的类，你自己看着办把！

该选项很危险，许多请情况下无法获取你想要的结果。

!!! note
    当存在多个 classpath 时：

    - linux：冒号`:`分隔
    - windows：分号`;`分隔

    此外，PATH 的斜杠：

    - linux：反斜杠 `/`
    - windows：正斜杠 `\`

#### output options

| output options | desc                                           |
| -------------- | ---------------------------------------------- |
| `-f <format>`  | soot 的输出格式，常用`J`表示输出`Jimple`格式。 |
| `-d <dir>`     | soot 的结果输出到目录 dir 中                   |

#### processing options

| processing options | desc                                                                |
| ------------------ | ------------------------------------------------------------------- |
| `–W`               | Perform whole program optimizations, enable wjop and wsop           |
| `–O`               | Perform intraprocedural optimizations, enable bop, gop, jop and sop |

#### phase options

已知 soot 由若干个 phase 构成，每个 phase 又细分为若干个 subphase，这些 phase 的实现称为 pack。

而 phase options 的作用就是，让你改变每个 phase 的行为！

使用 `-p <puase>.<subphase>`开始，此后接设置，格式为 `OPT:VAL`，多个设置用逗号 `,`分隔。

如下示例：对`cg.spark`这个 subphase 进行自定义，对其开启 verbose 和 on-fly-cg：

- verbose：false(default), When this option is set to true, Spark prints detailed information about its execution.
- on-fly-cg：true(defaulte), When this option is set to true, the call graph is computed on-the-fly as points-to information is computed. Otherwise, an initial CHA approximation to the call graph is used.

```
java [javaOptions] soot.Main classname -p cg.spark verbose:true,on-fly-cg:false
```

已知 phase 的实现是 pack，pack 是 transformer 的集合，每一个 transformer 对应于一个 subphase。当 pack 调用时，它将按顺序执行每一个 transformer。

每一个 transformer 是`extend`了 `BodyTransformer` or `SceneTransformer` 的类的实例，且必须重写其中的`internalTransform()`方法，该方法 providing an implementation which carries out some transformation on the code being analyzed.

也就是说，添加一个 transformer 就是新增了一个 `subphase`。

具体代码将在 java api 中讲解。

> For more [options](https://soot-build.cs.uni-paderborn.de/public/origin/develop/soot/soot-develop/options/soot_options.htm).

### Example

Prepare:

```shell
wget -P soot https://repo1.maven.org/maven2/org/soot-oss/soot/4.3.0/soot-4.3.0-jar-with-dependencies.jar
```

下述代码将处理 `HelloWorld.java`，并最终在`sootOutput/com.wang.HelloWorld.jimple`输出结果。

```shell
export SOOT_HOME = shell_soot/soot-4.3.0-jar-with-dependencies.jar
export POJO_HOME = src/test/java
# verify install
java -cp shell_soot/soot-4.3.0-jar-with-dependencies.jar  soot.Main  -h

# compile
javac src/test/java/com/wang/HelloWorld.java

# use soot output .jimple
java -cp shell_soot/soot-4.3.0-jar-with-dependencies.jar soot.Main -cp src\test\java -pp -f J com.wang.HelloWorld
```

- `-cp $SOOT_HOME` 指定 soot 的 jar 包目录
- `-cp $POJO_HOME` : 指定所要分析 `.class` 文件的目目录
- `-pp`: 指定 soot 去自动搜索 java 的 path， 主要是 rt.jar 和 jce.jar， soot 会去$JAVA_HOME 下寻找
- `-f J`: 指定输出文件类型， J 就是 jimple
- `com.wang.HelloWorld`: 你要分析的 class 的名字

## Java API

> https://github.com/HappyTsing/soot-tutorial
>
> https://github.com/HappyTsing/cflow_analysis

## Reference

- [soot 介绍 - 简要 未细看](https://fynch3r.github.io/Soot/)
- [soot survivors guide - 微过时 浅述应用 入门看](https://www.brics.dk/SootGuide/sootsurvivorsguide.pdf)
- [soot survivors guide - 前四章翻译 建议直接看 EN](https://zhuanlan.zhihu.com/p/79801764)
- [Fundamental-Soot-objects - soot 自定义的概念](https://github.com/soot-oss/soot/wiki/Fundamental-Soot-objects)
- [Jimple 基本概念 - Foundamental-Soot-objects 的中文版](https://colinxiong.github.io/program/2015/08/19/Jimple-introduction)
- [soot 安装与 shell/java 生成 Jimple 文件 - 参考安装](https://blog.csdn.net/qq_45401577/article/details/123958021)
- [Packs-and-phases-in-Soot - Transfer 代码示例](https://github.com/soot-oss/soot/wiki/Packs-and-phases-in-Soot)
- [soot 学习笔记 - 微门槛 用处不大](https://blog.csdn.net/beswkwangbo/category_2710855.html)
- [soot options - 必看官网文档 使用查阅](https://soot-build.cs.uni-paderborn.de/public/origin/develop/soot/soot-develop/options/soot_options.htm)
- [Soot-as-a-command-line-tool - 更多运行示例 出错查询](https://github.com/soot-oss/soot/wiki/Introduction:-Soot-as-a-command-line-tool)
- [soot java api](https://soot-build.cs.uni-paderborn.de/public/origin/develop/soot/soot-develop/jdoc/)
- [简单入门代码](https://xz.aliyun.com/t/11643#toc-2)
