# IR

soot 包含四种 IR 形式：

- Baf：基于栈的 bytecode
- Jimple：**soot 的核心**，三地址码。Jimple 适用于绝大多数的不需要精确 control flow 或者 SSA 的静态分析。
- Simple：Static Single Assignment 版的 Jimple，保证了每个局部变量都有一个静态定义，不知道有啥用。
- Grimp：和 Jimple 类似，多了允许树形表达和 new 指令。相比于 Jimple，更贴近 Java code，所以更适合人来读。

```java
public static void main(String[] args) {
```

## Jimple

Soot 能直接创建 Jimple 码，也可由 Java source code、bytecode or class files 创建。

相对于 bytecode 的 200 多种指令，Jimple 只有 15 条，分别是：

- 核心指令：NopStmt、IdentityStmt、AssignStmt
- 函数内控制流指令：IfStmt、GotoStmt\TableSwitchStmt、LookUpSwitchStmt
- 函数间控制流：InvoeStmt、ReturnStmt、ReturnVoidStmt
- 监视器指令：EnterMonitorStmt、ExitMonitorStmt
- 处理异常：ThrowStmt
- 退出：RetStmt

要对 Jimple 操作，首先需要实例化一个 Jimple 的环境对象 scene :

```java
val scence = Scene.v()
```

然后，再对 scene 进行分析和操作

```java
package com.wang;

public class Foo {
    public static void main(String[] args) {
        Foo f = new Foo();
        int a = 7;
        int b = 14;
        int x = (f.bar(21) + a) * b ;
        System.out.println(x);
    }
    public int bar(int n) { return n + 42; }
}
```

上述 Java 代码转化为 Jimple 后如下：

```java
public class com.wang.Foo extends java.lang.Object
{

    public void <init>()
    {
        com.wang.Foo r0;

        r0 := @this: com.wang.Foo;

        specialinvoke r0.<java.lang.Object: void <init>()>();

        return;
    }

    public static void main(java.lang.String[])
    {
        java.io.PrintStream $r1;
        com.wang.Foo $r0;
        int $i0, $i1, i2;
        java.lang.String[] r2;
        r2 := @parameter0: java.lang.String[];
        $r0 = new com.wang.Foo;
		// InvokeStmt, specialinvode 调用构造函数. virtualinvode 大多数调用都是这个。
        specialinvoke $r0.<com.wang.Foo: void <init>()>();
        $i0 = virtualinvoke $r0.<com.wang.Foo: int bar(int)>(21);     // 也是 AssignStmt
        $i1 = $i0 + 7;
        i2 = $i1 * 14;
        $r1 = <java.lang.System: java.io.PrintStream out>;
        virtualinvoke $r1.<java.io.PrintStream: void println(int)>(i2);
        return;
    }

    public int bar(int)
    {
        int i0, $i1;
        com.wang.Foo r0;
        r0 := @this: com.wang.Foo;   // IdentityStmt
        i0 := @parameter0: int;      // IdentityStmt
        $i1 = i0 + 42;               // AssignStmt
        return $i1;                  // ReturnStmt
    }
}
```

在 Soot 中，既有与 Java 对应的概念：

- 类 Class
- 字段 Filed
- 方法 Method

还有 Soot 自定义的概念：

- Unit：在 Jimple 中的实现是 stmt，在 Grimp 中的实现是 Inst
- Box
- Value
- CallGraph
- ...

### Scene

scene 中可以直接获取 Java Source 中的所有 Class，每一个 Class 都会生成一个 Jimple 文件与之对应。如果是内部类，名称前加其所在类的名称并用`$`符号连接。

!!! tip 

    使用 javac 编译一个名为`outClass`的类，其内部存在一个内部类`inClass`，使用`javac outclass`后，会生成两个文件：

    - outClass.class
    - outClass$inclass.class

    故而，scene 本质上应该就是做了编译工作？此处存疑！

通过 Scene，在开启了`whole program mode`的情况下，还可以用于生成 `Call Graph`。

### Class

class 代表一个 Java Class 类，相应的通过 Jimple 可以获取 class 中包含的：

- 字段 Field
- 方法 Method
- class 的父类方法 superClass
- 继承的接口 Interface 等。

根据 Java 的定义，每一个类会包含有构造器，因此 class 的 methods 中一定会有一个构造方法，方法名为`<init>`，参数与构造方法的参数相同。

同时，在主类 mainClass，即包含有 main 入口方法的类中，如果定义有全局变量，虽然这也属于 Field，但是这些变量的初始化操作在一个新的方法中执行，方法名为`<clinit>`。

```java
public class com.wang.Foo extends java.lang.Object
```

### Field

Class 中的字段即 Field，字段被引用或者赋值时，是通过 FieldRef 实现的。FieldRef 中包含了 declaringClass，name 等基本信息。

在 class 中通过`getFieldByName(String name)`获取字段时，如果没有该名字的字段，Jimple 会自动生成一个。

```java
java.lang.String[] r2;
```

### Method

方法 Method 的组成有参数 ParameterList，返回类型 ReturnType，方法体 Body。

Method 的 Body 是分析和修改 Method 的基础，包含了 Method 中所有的语句单元 Unit。

Method 也可以被调用，调用的方法为 MethodRef。

同样，在通过`getMethodByName(String name)`时，如果名字、参数、返回类型有一个不同，Jimple 会自动生成一个，并且该方法体中有 Error。

```java
com.wang.Foo: int bar(int)
```

### Body -> Unit

Body 代表了一个 Method 的方法体，每个 Body 里面有三个主链，分别是 Units 链、Locals 链、Traps 链：

- Units：方法的语句，在 Jimple 中，Unit 的实现就是 Stmt；而 Grimp 中，Unit 的实现是 Inst。
- Locals：方法的局部变量
- Traps：方法的异常处理

soot 中共有四种 Body：`BafBody`, `JimpleBody`,`ShimpleBody` and `GrimpBody`，在具体实现中，都继承了抽象类 Body。

执行语句 Unit 的类型 Stmt 常见的有:

```java
r0 := @this: com.wang.Foo;                            // IdentityStmt ThisRef
i0 := @parameter0: int;      						// IdentityStmt ParameterRef
$i1 = i0 + 42;              					    // AssignStmt
return $i1;                  						// ReturnStmt
specialinvoke $r0.<com.wang.Foo: void <init>()>();    // invokeStmt
```

### Value

Value 用于表示数据，Value 共有如下几类：

- `Local`
- `Constant`
- `Expr`
- `Ref`，如`ParameterRef`, `CaughtExceptionRef` and `ThisRef`

其中 Expr 是最有趣的，它可以细分为多种实现，例如：`NewExpr`和`AddExpr`。

一般来说，一个 Expr 可以对若干个 Value 进行一些操作并且返回另一个 Value。

```java
y = x + 1;    // AssignStmt
```

以上述的 AssignStmt 为例，其 leftOp 是 `y`，rightOp 是`x + 1`，此时`AddExpr`将其作为操作数，返回新的 Value。其中 `y` 是 `Local` 类型的 Value，而 `1`是 `Constant`类型的 Value。

### box

box 是一个指针，在 soot 中有两类 box：

- UnitBox
- ValueBox

#### UnitBox

每个 Unit 都会提供 getUnitBoxes() 方法，该方法大多数情况下返回空集，但代码中存在：

- GotoStmt：返回单个元素的列表，如下示例
- SwitchStmt：返回多个元素的列表

```java
    x = 5;
    goto l2;
    y = 3;
l2: z = 9;
```

此时对 `goto l2`这个 Unit 调用方法 `Unit.getUnitBoxes() `，会返回一个 UnitBox，指向 l2。

##### ValueBox

与 UnitBox 类似，是指向 Value 的指针。

1. 对于这个 AssignStmt 来说，需要首先获取他的 Boxes，这些 Boxes 里面包含了 Value 的指针。
2. 遍历 Boxes，cast 为 ValueBox，然后获取他的 Value，如果是 AddExpr 的话，那就是我们想优化的。
3. 对于 AddExpr 来说，获取他的左值和右值，也就是两个 value。
4. 如果都是常量 IntConstant 的话，那么就把他们的 value 加在一起。
5. 重新给 AssignStmt 的 box 赋值，让他指向 sum 和的常量。

```java
public void foldAdds(Unit u)
{
    Iterator ubIt = u.getUseBoxes().iterator();
    while (ubIt.hasNext())
    {
        ValueBox vb = (ValueBox) ubIt.next();
        Value v = vb.getValue();
        if (v instanceof AddExpr)
        {
            AddExpr ae = (AddExpr) v;
            Value lo = ae.getOp1(), ro = ae.getOp2();
            if (lo instanceof IntConstant && ro instanceof IntConstant)
            {
                IntConstant l = (IntConstant) lo,
                      r = (IntConstant) ro;
                int sum = l.value + r.value;
                vb.setValue(IntConstant.v(sum));
            }
        }
    }
}
```

### Phases

soot 的执行分为若干个`phase`，每个`phase`的实现称为`pack`。此外，每个`phase`又被细分为若干个`subphase`。

!!! tip 

	可以把 soot 理解为 maven，它们的执行都分为若干步骤，且可以通过参数选择开启或关闭特定的步骤！

执行的第一个`phase`，名为`jb`，该阶段解析 Class、Jimple、Source 文件，将解析结果 `Jimple Body`，输入不同此后的的 `phase`中。

此外，`jb`细分为`jb.a`等若干个`subphase`。

!!! tip

	Body 是方法体，程序内分析（intra-procedure analysis），其实就是分析单个方法内部的代码，如果该方法内部调用了其它方法，不会进行深入的分析。而程序间分析（inter-procedure analysis）则是在前者的基础上，对方法调用进行更为深入的分析。

如图所示，存在名为`jtp`的若干种`pack`，其命名规则为：

- 第一个字母，表示接受哪种形式的 IR 作为输入： s for Shimple, j for Jimple, b for Baf and g for Grimp.
- 第二个字母，表示`pack`的角色：b for body creation, t for user-defined transformations, o for optimizations and a for attribute generation (annotation).
- 最后一个字母 `p`，代表着 `pack`：例如 `jap`的含义是 `Jimple Annotation Pack`，包含了所有在 `intra-procedural analysis`中构建的内容。

值得特别关注的是：

- jtp(Jimple transformation pack)和 stp(Shimple transformation pack)。因为任何用户定义的 `BodyTransfer`(如从分析中得出对信息的标签) 可以被插入(inject)到这两个 `pack` 中，作为 Soot 执行过程的一部分。
- jap(Jimple annotation pack)：存放优化的结果，也可以使用`BodyTransfer`，作为 Soot 执行过程的一部分。
- jop，默认关闭，使用`-o`开启。

![intra-procedure analysis](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/soot/image-20220919205001688.png)

上述及上图表示的是 intra-procedural analysis 的执行流程，但 inter-procedure analysis 略有不同。

首先，需要将 soot 置于 `Whole-program`模式，可以通过设置 option 为 `-w`来实现。

在该模式下，soot 首先为所有的方法执行 Jimple Body（jd），然后执行新增的四种全程序 `pack`：

- cg：call graph generation
- wjtp：whole Jimple transformation pack
- wjop, the whole-jimple optimization pack (通过 `-W`开启)
- wjap：whole Jimple annotation pack

这四种`pack`是可以改变的，为其添加 `SceneTransformers`进行一个全程序的分析。

![inter-procedure analysis](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/soot/image-20220919204941135.png)

使用下述命令获取 soot 支持的所有`pack`

```shell
java -cp $SOOT_HOME soot.Main -pl
# $PACH_NAME=wjtp
java -cp $SOOT_HOME soot.Main -ph $PACK_NAME
```

所有的 phases and subphases 都接受 option `enabled`，想要让该 phase 运行，`enabled`必须为`true`。为了方便书写，可以用：

- on，代替 enable:true，例如想开启 Spark，`-p cg.spark on`
- off，代替 enable:false