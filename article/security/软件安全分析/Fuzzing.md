>  The Art, Science, and Engineering of Fuzzing: A Survey

## 术语

术语 `fuzz` 最初由 1990 年 Miller 等人创造，指的是生成由目标程序使用的随机字符流的程序，此后该术语在各种各样的上下文中被使用，包括动态符号执行、渗透测试、鲁棒性测试等，为了系统化整合大量模糊测试文献中的知识，给出现代用法中提取的模糊测试术语：

- PUT：Program Under Test（待测程序）

- Fuzzing：使用输入空间中的 inputs 来执行 PUT

- Fuzz Testing：使用 Fuzzing 来测试 PUT 是否违反安全策略

- Fuzzer：A fuzzer is a program that performs fuzz testing on a PUT.

- Fuzz Campaign：fuzzer 在特定安全策略下对 PUT 的一轮 fuzz，目的是发现违反安全策略的 bug。

  > 早期模糊测试器的安全策略：仅仅只是测试生成的测试用例是否使得待测程序（PUT）崩溃（Crash）。
  >
  > 但现代化的模糊测试可以用来测试任何安全策略。决定测试用例的执行是否违反安全策略的特定机制称为 Bug Oracle

- Bug Oracle：a program, 可能是 fuzzer 的一部分，决定给定的 PUT 的执行是否违反了特定的安全策略

- Fuzz Configuration：控制 Fuzz alogrithm 的参数值，该配置的类型有 fuzz alogrithm 的性质决定。

  > 将 fuzzer 实现的算法称为 fuzz alogrithm。 除了 PUT 所需的参数外，几乎所有 fuzz alogrithms 都还依赖于其他的参数，称为 fuzz configuration。
  >
  > seed 是 Fuzz Configuration 的一部分。

- seed：一般是对 PUT 精心构造的输入，被用于变异生成多种测试用例。fuzzer 通常会维护种子集合，成为 seed pools。有些还会在每轮 fuzz 结束后进化种子池。

  > fuzzer 能够在配置中存储数据，例如 coverage-guided fuzzers 将获取的 coverage 存储在配置中。

## 算法

Fuzzing 的普适算法：

![fuzzing_algorithm](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/software_analysis/fuzzing_algorithm.png)

输入 a set of fuzz configurations 和超时时间，输出发现的 Bug。

该算法分为两个部分：

- PREPROCESS，预处理，在 fuzz campaign 开始前执行。该函数输入 fuzz configurations，输出 potentially-modified fuzz configurantions。 取决于 fuzz algorithm， PREPROCESS 函数的作用不同，可能是对 PUT 的代码进行插桩，也可能计算 seed 文件的执行速度等。
- 循环，一次循环称为模糊迭代（fuzz iteration），其中 INPUTEVAL 函数使用测试用例运行 PUT 称为 fuzz run。循环内五个函数：
  - SCHEDULE：从输入的配置集合中选择一个模糊配置，用于本次模糊迭代。
  - INPUTGEN：将模糊配置作为输入，生成一组具体的测试用例 tcs（test cases）。在生成 tcs 时，INPUTGEN 使用模糊配置中的特定参数。 Some fuzzers use a seed in conf for generating test cases, while others use a model or grammar as a parameter.
  - INPUTEVAL：使用测试用例 tcs 执行 PUT，使用 bug oracle 判断是否违反安全策略，输出违反策略的 bugs 以及 fuzz run 的执行信息（可用于更新 fuzz configurantions）
  - CONFUPDATE：更新模糊配置，许多灰盒 fuzzer 会基于执行信息减少模糊配置的数量。
  - CONTINUE：将模糊配置作为输入，输出布尔值，指示是否继续模糊迭代。此函数可用于对白盒模糊器进行建模，当没有更多路径可供发现时，这些模糊器可以终止。

## 分类

黑盒、白盒、灰盒三种，传统的软件测试只有黑盒和白盒测试，灰盒是白盒的辩题，只能从每次 fuzz run 中获取一部分信息。

- 黑盒：看不到 PUT 内部信息，只能观察 PUT 的输入/输出。在软件测试中，黑盒测试也称为 IO 驱动或数据驱动测试。大多数传统 fuzzer 都属于黑盒，现代 fuzzer 往往会考虑输入的结构信息，以生成更有意义的测试用例。
- 白盒：能够系统的探索 PUT 的状态空间，白盒模糊术语由 Godefroid 于 2007 年引入，指的是动态符号执行。 此外，白盒模糊还被用于描述采用污点分析的 fuzzer。白盒测试开销比黑盒高得多。
- 灰盒：灰盒 fuzzer 可以获取 PUT 的内部信息及（或）执行信息。但不同于白盒测试，灰盒 fuzzer 不推理 PUT 的全部语义，而是执行轻量级静态分析、收集有关其执行的动态信息，例如代码覆盖率。

黑白灰模糊之间的区别并不清晰，黑盒 fuzzer 也可能会收集执行信息等。

## PREPROCESS 预处理

### Instrumentation（插桩）

不同于黑盒测试，白盒和灰盒测试都可以对 PUT 进行插桩，来获取 INPUTEVAL 的执行反馈信息，收集的信息俩个决定了 fuzzer 的类型（黑白灰）。尽管还有其他办法获取 PUT 内部信息（例如 processor traces or system call usage），但插桩是最常用且最有效的方法。

插桩分为：

- 静态插桩：在 PREPROCESS 阶段进行。通常在源代码或中间代码的编译时执行，相比于动态插桩，其开销小。若 PUT 依赖库，则必须单独检测库。
- 动态插桩：在 PUT 运行时进行，即 INPUTEVAL 阶段。对 PUT 依赖库插桩更简单，但高开销。

通常，fuzzer 可以支持多种类型的插桩，例如 AFL 支持源代码级别的静态插桩，或在 QEMU 的帮助下支持二进制级别的动态插桩。

**Execution Feedback**

灰盒 fuzzer 通常把执行反馈作为演化测试用例的输入。

**In-Memory Fuzzing**

如果测试的程序很大，但有时只是需要测试其中的一部分功能时，可以先存储一份内存快照，在新的测试用例直接写入内存之前，恢复内存快照，这样能最小化重新启动程序所需开销。

内存 API Fuzzing：不需要重新恢复 **PUT** 的状态，可以重复执行测试。缺点

- 发现 bugs 无法复现，因为没办法构造目标函数的调用上下文。
- 不能捕获多个函数
- 可靠性取决于入口函数，但入口函数的寻找非常困难。

**Thread Scheduling**

Race Condition bugs 很难触发，因为其依赖于可能很少发生的非确定性行为，但是插桩也可以通过显式控制线程的调度方式来触发不同的非确定性程序行为。

现有工作表明，即使是随机调度线程也可以有效地发现 Race Condition bugs

### Seed Selection

fuzzer 接受一组控制模糊算法行为的模糊配置，然而，模糊配置中的一些参数，例如基于变异的 fuzzer 的 seed，具有很大的值域。

例如：假设对一个接收 MP3 文件作为输入的 MP3 播放器进行模糊处理。

由于有效的 MP3 文件数量无限，那么应该使用哪些种子进行模糊处理？

减小初始种子池大小的问题称为种子选择问题。

有几种方法和工具可以解决该问题，常见的方法是：找到一个最小的 seed 集，最大化覆盖度量（例如节点覆盖）。该过程称为计算最小集。

- 使用分支对数计数器，计算分支覆盖率。
- 基于指令、分支和唯一基本块（basic blocks）数量计算覆盖率。

### Seed Trimming

更少的种子能减少内存的消耗和获得更大的吞吐量。（可以发生在当前的 PREPROCESS，也可以发生在 CONFUPDATE）

- 保证覆盖率不变的前提下，不断去迭代修剪种子。
- 赋予数量小的种子更高的优先级，但会造成发现特殊 **bug** 数量比随机种子少。
- 保留使用静态分析检测调用之间关系，扩展 Fuzzer 减少种子数量。

### Preparing a Driver Application

直接测试 **PUT** 比较困难时，可以先准备一个驱动程序。需要手动准备，并且可能在整个测试过程中只会使用一次。

## SCHEDULE

三个输入参数，分别是 fuzz Configuration， 上一次运行时间,运行超时时间；通过这三个参数计算返回下一次迭代所需要 **conf**（fuzz Configuration），这取决于 **Fuzzer** 的类型。

**FCS（Fuzz Configuration Scheduling）问题**

SCHEDULING 算法也存在探索-利用冲突（**exploration vs. exploitation**）：

- 探索：时间花在收集每个配置的更准确信息以告知未来决策上
- 利用：时间花在模糊化目前被认为会导致更有利结果的配置上

**黑盒 FCS 算法**

黑盒 FCS 算法可用的唯一信息是 fuzz configuration 的模糊结果（e.g. crash、bugs、time...），因此算法更倾向于选择具有更高成功率（#bugs/#runs）的配置。

介绍了 **WCCP/UW**、**MAB** 等算法？

**灰盒 FCS 算法**

灰盒 FCS 算法可以利用更多的信息，例如配置测试之后的覆盖率信息等。

AFL 是此类算法的先驱，其基于进化算法（EA）。EA 维护一群配置，每个配置都有 fitness 值，EA 选择合适的配置用于遗传转换，例如突变和重组，以产生后代，这些后代可能成为新的配置（假设产生的后代是更合适的）。

那什么配置是合适的？AFL 认为包含最快和最小输入的配置是合适的（AFL 术语为 favorite）。AFL 维护一个配置队列，循环从中选择配置。一旦选定了配置，AFL 对该配置进行模糊处理，运行一定的次数（该次数往往是恒定的）。

AFL Fast 对 EA 算法进行了三个方面的优化：

- 在执行控制流配置中，选择被选择更少哪个，如果前面选择有冲突，则选择对应执行路径执行次数最少的配置。

  - 选择配置时不再是轮询选择，而是基于优先级选择配置。
  - 选择配置运行固定次数变为可变次数，取决于 Power Schedule。

## INPUT GENERATION

由于测试用例的好坏，直接决定 bug 是否会被触发，因此用于 INPUT GENERATION 是 fuzzer 中最重要的一环。

fuzzer 分为：

- Model-based(Generation-based) Fuzzers：测试用例的产生取决于指定描述 PUT 预期输入的模型。
- Model-less(Mutation-based) Fuzzers：测试用例的产生来自给定输入种子的突变，因为种子只是举例输入，尽管数量很大，它也不能完整描述 PUT 预期输入空间。基于变异的 fuzzer 通常被认为是无模型的。

### Model-based（基于生成）

目前大致分为三种：

- Predefined Model：预定义模型。
  - 用户配置：例如 Peach 等运行用户指定输入语法，Autodafe 等提供 API 让用户创建自己的 input models，等等。
  - fuzzer 内置：例如针对特定的语言或语法的 fuzzer，其将该语言的模型内置于 fuzzer 中。
- Inferred Model：推理模型
  - Model Inference in PREPROCESS：TextMiner 在待测程序中搜索例如常量之类的数据，以此推测可能的 inputs；Neural and Learn&Fuzz 使用神经网络机器学习算法从一个给定的测试文件的集合学习一个模型，然后使用这个模型产生测试用例，等等。
  - Model Inference in CONFUPDATE：可以在每次模糊迭代后更新模型。PULSAR 从一系列捕获 PUT 产生的网络包中推断出一个网络协议模型，然后使用这个模型进行 fuzz；Doupe et al 提出了一种通过观察 I/O 行为推断出 web 服务的状态机，然后使用这个模型去扫描 web 漏洞，等等。
- Encoder Model：fuzzing 通常被用于测试解析特定文件格式的 decoder 程序。很多文件格式都有对应的 encoder 程序，encoder 程序可以被认为是文件格式的隐含模型。

此处的模型是否可以理解为输入格式？基于该模型生成测试用例。

### Model-less（基于变异）

经典的随机生成，对于需要生成满足特定路径条件的测试用例的情况效率很低。

例如：`if( inpit == 42)`，若 `input` 是一个 32 位整数，那么随机生成正确输入值的概率是 $1/2^{32}$ 。当考虑 well-structured input （例如 MP3） 时，情况会更糟糕，随机测试几乎不可能在合理的时间内生成有效的 MP3 文件作为测试用例。

大多数 Model-less fuzzer 都采用 seed，seed 是对 PUT 精心构造的输入，通过修改 seed 的一部分（变异）来生成新的测试用例，该测试用例大概率是有效的（但也可能包含异常值，导致 PUT 崩溃）。

常见的变异 seed 的方法如下：

- Bit-Flipping：位翻转。有些 fuzzer 简单地翻转固定数量的位，有些 fuzzer 则随机确定要翻转的位数，还有些提供可配置的参数（变异比），其决定翻转的位数，假设 fuzzer 像要从给定的 N 位种子种翻转 K 个随机位，此时变异比应设置为 K/N。SymFuzz 表明 fuzz 性能对突变率很敏感，且没有一个比率适用于所有 PUT。

- Arithmetic Mutation：算数突变。选择一个字节序列作为整数，并对该值进行简单的算术运算，然后用计算结果替换选择的字节序列。该方法可以将突变的影响限制在一个很小的数字内。

  > 例如，AFL 从 seed 中选择一个 4 字节的值，并将该值视为整数 i。然后将种子中的值替换为 i±r，其中 r 是随机生成的小整数。
  >
  > r 的范围取决于模糊器，并且通常是用户可配置的。在 AFL 中，默认范围为：0≤r<35

- Block-based Mutation：基于块的变异。Block 是种子的一个字节序列。

  - 在种子的随机位置插入随机生成的 Block；
  - 从种子中随机选择 Block 删除；
  - 随机选择 Block 替换为随机值；
  - 随机变换 Block 序列；
  - 使用一个随机 Block 改变种子大小；
  - 从一个种子中随机选取 Block 随机插入或替换掉另一个种子的 Block；

- Dictionary-based Mutation：基于字典的变异。使用一组预定义的隐含重要语义权重的值进行突变。例如 AFL 在改变整数时使用 0、-1、1 等值。Radamsa 使用 Unicode 字符串，GPF 使用 %x 和 %s 等格式化字符来改变字符串。

### White-box Fuzzers

有的 Fuzzer 利用白盒程序分析来查找有关 PUT 接收的输入的信息，将其用于黑盒或者灰盒测试。

- 动态符号执行（Dynamic Symbolic Execution）

- - 动态符号执行是传统的符号执行的变体，在动态符号执行过程中，符号执行和实际的执行（concrete input）会同时进行，因此被称为 concolic（concrete + symbolic）testing。
  - 建立符号表达式。为执行过程中遇到的每一条分支指令建立一个路径公式，如果存在一个实际的输入，能够执行目标路径，那么就说该路径公式是可满足的。

- Guided Fuzzing：使用静态分析或者动态分析来增强 Fuzzing 的效果。

- - 使用开销较大的程序分析 PUT，以此来获取有关于 PUT 的有用信息。

  - 使用上一条分析获取的有用信息生成测试用例。

  - 使用细粒度的污点分析来查找流入关键系统调用或 API 调用的输入字节（hot bytes）。

  - - 在编译时期执行静态分析，探索式查找可能包含错误的循环，例如空指针引用，然后通过污点分析计算输入字节与循环之间的关系，最后只将关键字节变为符号，运行动态符号执行。
    - 使用污点分析将每个路径约束和对应的字节联系起来，然后执行梯度下降式搜索算法，去引导突变朝解决约束的方向走。
    - 通过插桩比较和查找所有操作对象与给定输入之间的对应关系，来检测 PUT 中如何使用输入。

- PUT Mutation：如何绕过检验和验证。

- - stitched dynamic symbolic execution：在存在校验的情况下生成测试用例。

  - - 使用污点分析来校验和测试指令，并通过打补丁来绕过验证。当发现程序崩溃时，会使用正确的验证作为输入，以此来生成使未修改 PUT 崩溃的测试用例。

- - 在上面方法的基础上，通过灰盒测试，能够有效渗透所有类型的条件分支。

  - - 首先使用一组 NCC（Non-Critical Checks），它可以在不改变程序逻辑情况下进行分支转换。当 **fuzzing campaign** 发现新的路径停止时，选择一个 NCC，对其进行转换，然后在修改过的 PUT 上重新进行 **fuzzing campaign**；最后，当发现崩溃时，尝试使用符号执行在原始程序上复现。

## INPUT EVALUATION

在生成输入（基于模型的、基于变异的）之后，fuzzer 使用该输入执行 PUT，并决定如何处理执行结果。

### Bug Oracle

典型的安全策略将因为 fatal signal （例如段错误）导致程序终止的测试视为违规测试，该策略对内存漏洞十分有效，因为无效值覆盖数据或代码指针的漏洞通常导致段错误而终止，且该策略易于实现，因为操作系统允许此类异常情况在没有任何检测的情况下被 fuzzer 捕获。

但该策略并不能检测所有的内存漏洞，例如堆栈缓冲区溢出，覆写了指针指向另一个有效地址，程序可能仅出现无效结果，而不会崩溃终止，因此 fuzzer 无法检测到该漏洞。

为了解决上述问题， researchers have proposed a variety of efﬁcient program transformations that detect unsafe or unwanted program behaviors and abort the program. These are often called `sanitizers`.

- **内存类型安全（Memory and Type Safety）**：分为空间性和时间性错误。空间性错误指在对象之外被间接引用指向它原本指向的对象之外的情况下。时间性错误通常发生在指针失效后被引用。
  - 在编译时对程序进行插桩，采用影子内存（shadow memory），允许每个内存地址在被解引用之前，快速地进行合法检查。
  - 在分配对象之间创建大块不可访问内存——红色空间（redzones），如果这些红色空间被指针访问了，那就有可能造成崩溃。
  - 在编译时插桩，将边界和时间信息与每个指针相关联，理论上可以检测所有的空间性和时间性错误。
  - 在编译时插桩，检测 C++类型转换错误。
  - 在运行时检测原始程序中不可能的控制流转换，如找到非法篡改程序控制流的测试用例。
- **未定义行为（Undefined Behaviors）**
  - 在编译时插桩，使用影子内存（shadow memory）来表示每个可寻址位是否已经被初始化，用于检测 C 和 C++中使用未初始化内存而引起的未定义行为。
  - 编译时修改程序，可以检测错位指针、被零除、解引用空指针和整数溢出等未定义行为。
  - 编译时修改程序，检测数据竞争（data races）
- **输入验证（Input Validation）**：如 XSS，SQL 注入。
  - 使用真实的 Web 浏览器解析测试用例，提取 DOM 树，并将它与成功执行 XSS 攻击的手动指定模式进行比较。
  - 通过使用数据库代理来拦截 Web 应用程序与数据库之间的通信，以此检测是否触发有害行为。
- **语义差异（Semantic Difference）**
  - 与行为相似（但不相同）的程序相比较，之间的差异可能就是错误。
  - 在单个程序上使用多个不同的输入进行测试测试，将突变从 PUT 的输入映射到它的输出，可以用来识别信息泄漏。

### Execution Optimizations

每一次 **fuzz** 迭代都需要重新开启一个进程加载 PUT，很浪费性能。现在的 Fuzzer 提供一个 **fork-server**，每一次新的 fuzz 迭代可以对已经初始化的进程进行 **fork**，降低迭代的开销。

### Triage

分析和报告违反策略测试用例的过程，分为三个步骤：重复数据删除，优先级和测试用例最小化。

- **重复数据删除（Deduplication）**：删除结果中触发相同错误的测试用例的过程，理想情况下，每个测试用例都会触发一个独特的错误。可以减少硬盘空间的浪费和方便用户更简单理解结果。

  - 堆栈回溯哈希（Stack Backtrace Hashing）：在程序崩溃是记录堆栈回溯，并更具回溯内容分配堆哈希。
    - 只对函数名或函数地址进行哈希运算。
    - 同时对函数名和偏移量或行进行哈希运算。
    - 使用两个哈希：一个主要哈希，只对函数名进行哈希运算，将不同崩溃组合在一起。次要哈希，对函数名和行号，还可能包括不限数量的堆栈帧，进行哈希，更精确。
  - 基于覆盖的重复数据删除（Coverage-based Deduplication）

    - 记录 PUT 每条边的执行覆盖率，并粗略计算每条边命中次数。

    - 语义感知分析重复数据删除（Semantics-aware Deduplication）

    - 从每个崩溃中进行反向数据流分析，再从分析中恢复语义。

- **优先级和可利用程度（Prioritization and Exploitability）**

  - 根据严重程度和独特性对有问题的测试用例进行分组和排名。

  - 使用简单污点分析进行分级。

- **测试用例最小化（Test case minimization）**：保证结果不变的前提下尽可能减小测试用例的大小。

  - 尝试最小化与原始种子文件不同的位数。
  - 尝试通过在合适的情况下将字节设置为零和缩短测试用例的长度来简化测试用例。
  - 尝试通过以指数递减的方式删除相邻行或字节块来最小化文件。

## CONFIGURATION UPDATE

黑盒除了评估 BUG ORACLE 之外，每一次迭代都不能够收集到其他任何信息，从而无法更新配置信息；而白灰盒可以通过迭代后得到的信息不断更新配置信息。因此，CONFUPDATE 函数可以作为区分黑盒和白灰盒行为的重要角色。

### Evolutionary Seed Pool Update

EA（Evolutionary Algorithm）维护一个种子池，里面会包含一些有希望的个体，随着 **fuzzing campaign** 的进行不断进化，可能导致新的种子被发现。

- 使用节点或分支覆盖率作为计算点：如果测试用例发现新的分支或节点，则将它加入到种子池中。因此，种子池是代表所有可达路径多样化的工具，也可以代表 PUT 当前探索的情况。

### Maintaining a Minset

创建新的配置时，可能结果集会非常大。因此，最好是能够维护一个 minset，如能使覆盖率最大化，而本身最小化的测试用例集。

- 维护一个专门用于配置更新的 minset，完全删除不在 minset 中的配置。
- 同上，但不删除配置，而是标记在 minset 中的配置优先级更高，被用于测试的机会更高，这样合理保持了队列循环速度和测试用例多样性之间的平衡。
