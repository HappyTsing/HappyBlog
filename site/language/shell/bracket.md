---
comments: true
---
# Difference: ()、(())、[]、[[]]、{}

## 一、()

### 1.1 命令组：新开子 shell 执行

`(cmd1;cmd2;cmd3)`，括号中的命令将会 `新开一个子shell` 顺序执行，因此：

- 括号中声明的变量不能被脚本余下的部分使用
- 括号中多个命令之间用分号 `;` 隔开

```bash
#!/bin/bash
echo $$
echo $BASHPID
(echo $$;echo $BASHPID)

$ source test.sh
915416
915416
915416
918116  #()会开一个新的子shell来运行，因此 $BASHPID 发生了改变
```

### 1.2 子命令扩展：$()

子命令扩展又称命令替换：`$(...)`可以扩展成另一个命令的运行结果，该命令的所有输出都会作为返回值。

`$(...)`可以嵌套，比如`$(ls $(pwd))`。

有两种方法：

```bash
# 1. 反引号``
val=`echo "this is a command"`

# 2. $()
val=$(echo "this is acommand")
```

### 1.3 初始化数组：array=(a b c)

## 二、(())

### 2.1 特性

- 自动忽略内部空格
- 只要算数结果不是 `0` ，命令就算执行成功，即 `$?` 返回 `0` 。
- 不可以输入非整数，且返回结果总是整数，比如： `echo $((5 / 2)`，返回 2 而不是 2.5
- `((...))`内部可以用圆括号改变运算顺序
- 可以嵌套
- `((...))` 内部变量无需使用 `$` 符号前缀，当然也可以使用

### 2.2 支持的运算符

- 算数运算符： `+ - * / % ** ++ —`
- 二进制位运算符： `<< >> & | ~ ^`
- 逻辑运算符： `< > <= >= == != && || ! expr?expr2:expr3`
- 赋值运算符： `= += -= /= %= <<= >>= &= |= ^=`

### 2.3 总结

总的来说， `(())` 内部的语法和高级语言及其相似，无需特殊记忆！常用用法如下：

```bash
# 1. 赋值
a=5;((a++))
((a+=2))

# 2. 计算
val=`expr 1 + 1`
val=$((1+1))
let val=1+1

# 3. 算数比较
a=1;
if ((a<5))   # 相当于if [ $a -lt 5 ]。
then
	echo "a<5"
else
	echo "a>=5"
if

# 4. 三目运算
echo $((a>1 ? 1 : 0))
```

## 三、[]、[[]]

!!! warning "不建议使用"

    作用和`(())` 类似，但 `(())` 更现代化！

    

In Short:

- [] is a bash Builtin
- [[]] are bash **Keywords**

**Keywords:** Keywords are quite like builtins, but the main difference is that special parsing rules apply to them. For example, [ is a bash builtin, while [[ is a bash keyword. They are both used for testing stuff, but since [[ is a keyword rather than a builtin, it benefits from a few special parsing rules which make it a lot easier:

```bash
  $ [ a < b ]
 -bash: b: No such file or directory
  $ [[ a < b ]]
```

The first example returns an error because bash tries to redirect the file b to the command [ a ]. The second example actually does what you expect it to. The character < no longer has its special meaning of File Redirection operator.

Source: http://mywiki.wooledge.org/BashGuide/CommandsAndArguments

**Single Bracket** i.e. `[]` is POSIX shell compliant to to enclose a conditional expression.

**Double Brackets** i.e. `[[]]` is an enhanced (or extension) version of standard POSIX version, this is supported by bash and other shells(zsh,ksh).

总结： `[]` 兼容性更好，而 `[[]]`不一定兼容 `/bin/sh` 。但是 `[[]]` 使用起来可能更为方便，很多 `[]` 会出问题的可以正常运行。

**Recommendation: always use `[]`**

## 四、{}

## 4.1 {start..end..step} 扩展

大括号可以省略步长 `step`，即 `{start..end}`，表示扩展成一个连续序列。比如，`{a..z}`可以扩展成 26 个小写英文字母， `{1..5}` 可以扩展成 1 至 5，也支持 `逆序` 。如果整数前面有前导`0`，扩展输出的每一项都有前导`0` ， `{001..005}` 。

```bash
# 用途1：嵌套使用，形成复杂扩展
$ echo .{mp{3..4},m4{a,b,p,v}}
.mp3 .mp4 .m4a .m4b .m4p .m4v

# 用途2：多个简写形式连用，形成循环处理效果
$ echo {a..c}{1..3}
a1 a2 a3 b1 b2 b3 c1 c2 c3

# 用途3：用于for循环
for i in {1..4}
do
  echo $i
done
```

### 4.2 代码块

又被称为内部组，这个结构事实上创建了一个匿名函数 。与小括号中的命令不同，大括号内的命令不会新开一个子 shell 运行，即脚本余下部分仍可使用括号内变量。括号内的命令间用分号隔开，最后一个也必须有分号。{}的第一个命令和左括号之间必须要有一个空格。

### 4.3 命令组：当前 shell 执行

`{ cmd1;cmd2;cmd3;}`在 `当前shell顺序`执行命令：

- 各命令之间用分号隔开
- 最后一个命令后必须有分号
- 第一条命令和左括号之间必须用空格隔开

```bash
#!/bin/bash
echo $$
echo $BASHPID
{ echo $$;echo $BASHPID;}

$ source test.sh
915416
915416
915416
915416
```

## Reference

- [What is the difference between double and single square brackets in bash?](https://serverfault.com/questions/52034/what-is-the-difference-between-double-and-single-square-brackets-in-bash)
- [shell 中各种括号的作用](https://www.runoob.com/w3cnote/linux-shell-brackets-features.html)
