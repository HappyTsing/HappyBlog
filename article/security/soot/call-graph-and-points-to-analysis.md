# Call Graph and Points-To Analysis

## Call Graph 

**前置知识**

Call Graph 是过程间分析的必要数据结构，当前有数种方法来构建 Call Graph，例如：

- Class Hierarchy Analysis( CHA) ：最快，但精度差。
- Points-To Analysis：指针分析，慢，但精度高。

Call Graph 是调用关系图，其每一个 Node 表示方法，而 Edge 表示调用。

**延申知识**

引入过程间分析后，我们向 CFG 中**添加 Call Graph 相应的元素**，得到过程间的控制流图（ICFG）

**soot 实现**

当使用 `-w` option 来开启 `whole program mode`时，可以通过 `getCallGraph()`方法来从环境类 `Scene`中访问`Call Graph`。

当什么都不设置时，默认采用 `CHA`生成 Call Graph。

调用图中的每条边都包含四个元素：

- source method
- source statement (if applicable)
- target method
- the kind of edge
  - static invocation
  - virtual invocation
  - interface invocation

![image-20220922220854158](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/soot/image-20220922220854158.png)

Call Graph 提供了三种方法：

- edgesInto(method)：查询进入方法的 edge
- edgesOutOf(method)：查询来自方法的 edge
- edgesOutOf(statement)查询来自特定 statement 的 edge，

Each of these methods return an Iterator over Edge constructs. soot 提供了 three so-called adapters 来遍历边的不同元素：

- Sources：遍历 source method
- Units：source statement
- Targets：target method

示例如下：

```java
public void printPossibleCallers(SootMethod target) {
    	CallGraph cg = Scene.v().getCallGraph();
        Iterator sources = new Sources(cg.edgesInto(target));
        while (sources.hasNext()) {
        SootMethod src = (SootMethod)sources.next();
        System.out.println(target + " might be called by " + src);
    }
}
```

## Points-To Analysis

指针分析，用于生成更精确的 CFG。可以在 soot 中通过两种框架来实现指针分析：

- SPARK
- Paddle

Soot provides three implementations of the points-to interface: CHA (a dumb version), SPARK and Paddle. The dumb version simply assumes that every variable might point to every other variable which is conservatively sound but not terribly accurate.

```shell
$ java -cp $SOOT_HOME soot.Main -pl | grep cg
cg                            Call graph constructor
    cg.cha                       Builds call graph using Class Hierarchy Analysis
    cg.spark                     Spark points-to analysis framework
    cg.paddle                    Paddle points-to analysis framework
```

可以看到，cg 是一个 phase，它有三个 subphase，默认情况下，执行`cg.cha`，如果想使用 spark，则需要启用 `cg.spark`。

## spark

通过`-p cg.spark on`来启用 spark，此外还有一些你可能感兴趣的 options：

- verbose. (设定 SPARK 在分析过程中，打印多种信息【提示信息】)
- propagator SPARK. (包含两个传播算法，原生迭代算法，基于 worklist 的算法)
- simple-edges-bidirectional. (如果设置为真，则所有的边都为双向的)
- on-fly-cg.（通过设置此选项，进行更加精确的 points-to 分析，得到精确的 call graph）
- set-impl. (描述 points-to 集合的实现。可能的值为 hash,bit,hybrid,array,double)
- double-set-old 以及 double-set-new.