# The Data-Flow Framework

**前置知识**

Data Flow Analysis，可以理解为：How Data Flows on CFG?

每次语句的执行，如 Jimple 中的 stmt 执行，都会将输入状态转换为新的输出状态。数据流分析可以分为 forward Analysis 和 backward Analysis 两类。

在 intra-procedural Analysis 中，将不对方法调用进行细致分析。

在 CFG 中，结点有通常两种：

- 单独的三地址码，例如 Jimple 就是一种三地址码
- 基本块 Basic Blocks，是三地址码的集合，存在单进单出的性质等

此外，CFG 中分支 meet 时，处理方法有两种：

- may analysis，此时采用并集 ∪，即可以误报，但不许漏报。
- must analysis，此时采用交集 ∩ ，即可以漏报，但不许误报。

**soot 实现**

在 Soot 作者的文档中，其对做一个 flow analysis 分为四个步骤：

- Decide what the nature of the analysis is. 即考虑 forward Analysis or backward Analysis？是否需要考虑分支信息？
- Decide what is the intended approximation. 即考虑 may analysis or must analysis？这决定了在结点 meet 时，选择 ∪ or ∩
- performing the actual flow. 本质上是为中间表示的每个语句编写等式，例如，如何处理赋值语句？
- entry node and inner nodes 的初始状态. 通常初始状态为空集或全集。例如 available exporessions analysis 中，entry node 初始化为全集(1...1)，inner nodes 初始化为空集(0...0)。

## Step1: nature of the analysis

Soot 提供了三种实现：

- ForwardFlowAnalysis,
- BackwardFlowAnalysis
- ForwardBranchedFlowAnalysis.

前两种的结果是两个 Map：

- from nodes to IN sets
- from nodes to OUT sets

最后一种还添加了分支信息，因此多了一个 Map：

- from nodes to IN sets,
- from nodes to fall-through OUT sets
- from nodes to branch OUT sets.

上述三种都是通过 fixed-point mechanism using a worklist algorithm 来实现的，如果你想自己实现，可以通过继承如下三个类：AbstractFlowAnalysis (the top one), FlowAnalysis or BranchedFlowAnalysis.

举个例子：very-busy expressions，该分析是为了找到必定使用的表达式，例如：`if(x>y) then a=1;b=2; else a=1;`,此时`a=1`就是 very-busy expression。

为了进行 very-busy expressions analysis，需要使用 backward analysis，因此我们用于分析的类必须继承 BackwardFlowAnalysis。

然后为了利用 soot 提供的功能，需要提供一个实现如下功能的构造函数：

- call the super’s constructor
- invoke the fixed-point mechanism

具体实现如下：

```java
class VeryBusyExpressionAnalysis extends BackwardFlowAnalysis{
    public VeryBusyExpressionAnalysis(DirectedGraph g) {
        super(g);
        doAnalysis();
	}
}
```

## Step2: Approximation level

该步骤用于决定是 may or must analysis，其实就是决定在结点交汇时使用 ∪ or ∩。

仍旧以 very-busy expressions analysis 为例，它使用 must analysis，也就是在结点交汇（meet）时使用交集 ∩。

在 soot 的实现中，通过重写 `merge()` 方法，来确定 meet 的处理方法：

```java
class VeryBusyExpressionAnalysis extends BackwardFlowAnalysis{
    @Override
    protected void merge(Object in1, Object in2, Object out) {
        FlowSet inSet1 = (FlowSet)in1,
        inSet2 = (FlowSet)in2,
        outSet = (FlowSet)out;
        inSet1.intersection(inSet2, outSet);
    }
    @Override
    protected void copy(Object source, Object dest) {
        FlowSet srcSet = (FlowSet)source,
        destSet = (FlowSet)dest;
        srcSet.copy(destSet);
    }
}
```

在上述的例子中可以看到，soot 抽象了 lattice element 的表示方式，本例中使用`FlowSet`。因为这种抽象，因此需要重写 `copy()`方法，用于将 lattice element 的内容复制给另一个 lattice element。

## Step3: Performing flow

此处是数据流分析中的 `transfer function`，是核心部分。

该阶段的处理分为两个步骤：

- kill()：当流从 IN 经过 NODE 到 OUT 的时候，需要 kill 掉一些已经无效的数据。
- gen()：需要向 OUT 中加入 NODE 生成的数据。

也就是说，最终的 OUT[NODE] = gen<sub>NODE</sub> ∪ ( IN[NODE] - kill<sub>NODE</sub> )

```java
class VeryBusyExpressionAnalysis extends BackwardFlowAnalysis{
    @Override
    protected void flowThrough(Object in, Object node, Object out) {
        FlowSet inSet = (FlowSet)source,
        outSet = (FlowSet)dest;
        Unit u = (Unit)node;
        kill(inSet, u, outSet);
        gen(outSet, u);
	}
    private void kill(FlowSet inSet, Unit u, FlowSet outSet){ /* 用户自定义实现 */ }
    private void gen(FlowSet outSet, Unit u) { /* 用户自定义实现 */ }
}
```

其中 `kill()`和`gen()`方法需要用户根据实际的情况实现，可以参考[示例源代码](https://github.com/soot-oss/soot/blob/develop/tutorial/guide/examples/analysis_framework/src/dk/brics/soot/analyses/SimpleVeryBusyExpressions.java)。

## Step4: Initial state

该步骤用于对 entry node 以及其 inner node 进行初始化，分别由`entryInitialFlow` 和 `newInitialFlow`两个方法实现：

```java
class VeryBusyExpressionAnalysis extends BackwardFlowAnalysis{
    @Override
    protected Object entryInitialFlow() {
		return new ValueArraySparseSet();
	}
    @Override
	protected Object newInitialFlow() {
		return new ValueArraySparseSet();
	}
}

```

在 very-busy expressions analysis 中，entry node 是最后一句语句，并用空集来初始化它，其余的 inner node 也全部都初始化为空集。

## FlowSet

FlowSet 代表着与控制流图 CFG 中 结点 node 相关联的数据集。对于 very-busy expressions analysis，a node’s flow set 代表 a set of expressions busy at that node.

有两种 FlowSet：

- bounded FlowSet：A bounded set is one that knows its universe of possible values，实现接口`BoundedFlowSet<T>`
- unbounded FlowSet：与 bounded 相反，实现接口 `FlowSet<T>`

继承了`FlowSet<T>`的接口需要实现：

- clone()
- clear()
- isEmpty()
- copy(FlowSet dest) // deep copy of this into dest
- union(FlowSet other, FlowSet dest) // dest <- this ∪ other
- intersection(FlowSet other, FlowSet dest) // dest <- this ∩ other
- difference(FlowSet other, FlowSet dest) // dest <- this - other

In addition, when implementing `BoundedFlowSet<T>`, it needs to provide methods for producing the set's complement and its topped set (i.e., a lattice element containing all the possible values).

soot 实现了四种 FlowSet，分别是：ArraySparseSet、ArrayPackedSet、ToppedSet 和 DavaFlowSet

- **ArraySparseSet** is an unbounded flow set. The set is represented as an array of references

- **ArrayPackedSet** is a bounded flow set. Requires that the programmer provides a FlowUniverse object.

  A FlowUniverse object is simply a wrapper for some sort of collection or array, and it should contain all the possible values that might be put into the set.

- **ToppedSet** wraps another flow set (bounded or not) adding information regarding whether it is the top set (⊤) of the lattice.

In our very-busy expressions example, we need to have flow sets containing expressions and as such we want them to be compared for equivalence — i.e., two different occurrences of `a + b` will be different instantiations of some class implementing BinopExpr; thus they will never compare equal. To remedy this, we use a modified version of ArraySparseSet, where we have changed the implementation of the contains method as such:

```java
public boolean contains(Object obj) {
    for (int i = 0; i < numElements; i++)
        if (elements[i] instanceof EquivTo && ((EquivTo) elements[i]).equivTo(obj))
        	return true;
        else if (elements[i].equals(obj))
        	return true;
    return false;
}
```

## CFG

soot 在 package `soot.toolkits.graph`中提供了若干种 CFG( Control Flow Graphs )，都是基于接口 `DirectedGraph<N>`，该接口定义了若干个 getter 方法：

- the entry and exit points to the graph,
- the successors and predecessors of a given node,
- an iterator to iterate over the graph in some undefined orde and the graphs size (number of nodes).

此处讨论的 CFG 的 node 是 Soot Units，在 Jimple 中，Units 的实现是 Stmt。此外，仅讨论 intra-procedural flow

Abstract class：`UnitGraph`，提供了构建 CFG 的工具，此外，soot 还提供了三种具体实现：BriefUnitGraph, ExceptionalUnitGraph and TrapUnitGraph.

- **BriefUnitGraph**：最简单的实现，it doesn’t have edges representing control flow due to exceptions being thrown
- **ExceptionalUnitGraph**：最常用的实现，it includes edges from throw clauses to their handler(catch block, referred to in Soot as Trap), that is if the trap is local to the method body.
- **TrapUnitGraph**：类似 ExceptionalUnitGraph，但会考虑可能引发的异常。

在 soot 中，可以为 body 生成 CFG，例如：

```java
UnitGraph g = new ExceptionalUnitGraph(body);
```

### Wrapping the results of the analysis

> todo
