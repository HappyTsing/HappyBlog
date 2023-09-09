# Shell：语法

## 一、简介

!!! note

    本文基于 bash，同时也会讨论一些 zsh 的特性！

- shell：C 语言编写的应用程序，提供一个界面，用户通过该界面输入命令访问 Linux 服务
- shell script：为 shell 编写的脚本程序，文件后缀为 `.sh`
- shell interpreter：脚本解释器，种类众多，sh、bash、zsh

## 二、指定脚本解释器

在 shell 脚本，`#!`  告诉系统其后路径所指定的程序即是解释此脚本文件的 Shell 解释器。`#!`  被称作[shebang（也称为 Hashbang ）](https://zh.wikipedia.org/wiki/Shebang)。

出现在 shell 脚本的第一行，有两种写法：

- 直接指定： `#!/bin/sh` 、 `#!/bin/bash`
- 自动指定： `#!/usr/bin/env bash`

!!! tip

    当使用方法二自动指定时，系统自动在 PATH 环境变量中查找你指定的程序。

    因此 **强烈推荐** 使用该写法，因为程序的路径是不确定的，而且直接指定可能还会设计 shell 版本的问题，而 PATH 中的版本总是当前希望使用的。

## 三、shell 模式

- 交互模式：手动输入一些列 Linux 命令，比如 `ls` 、 `cd` 等
- 非交互模式：可以理解为执行 shell 脚本，shell 从文件或管道中读取命令并执行，当 shell 解释器执行完文件中的最后一个命令，shell 进程终止，并回到父进程。
  - 在新进程中运行 shell 脚本
    - 将脚本程序作为 **可执行程序** 运行：`./shell_script.sh` ，这种方法需要先给脚本添加执行权限： `chmod +x shell_script.sh`
    - 将 shell 脚本作为参数传递给 shell 解释器：`bash shell_script.sh` ，这种方法不需要给脚本执行权限，也不需要在脚本文件的第一行指定脚本解释器，指定了也会被忽略。
  - 在当前进程中运行 shell 脚本：`source shell_script.sh` ，这种方法会强制执行脚本文件中的全部命令，不需要给脚本执行文件。这也是为什么，当我们 `source ~/.zshrc`的时候，配置会立即生效，是因为就是在当前进程运行的！**注意，source 执行时，脚本文件指定脚本解释器的命令是无效的，默认使用当前 shell。**

!!! question

    `source shell_script.sh` 有个简写：`. shell_script.sh`

    但我测试中发现无法如此调用，却可以这样调用： `. ./shell_script.sh`

证明是否创建新进程：

```shell
## test.sh
#!/usr/bin/env bash
echo "test"
echo $$  ## 输出当前进程PID
```

![example](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/shell/example.png)

如图所示：当前进程 PID=356020 ，在运行 `bash test.sh` 时的 PID=379044 ，说明是在新进程下运行的，而运行 `source test.sh` 时， PID=356020 并未发生变化，说明是在当前进程下运行的。

## 四、基础知识

- 取用变量： `$var`、 `${var}`，例如引用环境变量：$PATH
- 删除变量： `unset var`
- 获取字符串/数组长度： `${#string}`、 `${#array[*]}`

## 五、运算符

[SHELL：运算符](https://leqing.work/language/shell/operator/)

## 六、字符串

shell 字符串可以用单引号  `''`，也可以用双引号  `“”`，也可以不用引号。

!!! tip "推荐使用双引号"

    shell 规定 **单引号禁止变量替换**，元字符 $ 和 \* 等保持其符号本身，而双引号允许元字符变量替换。

```bash
str="this is a string"

## 拼接字符串
str1="world"
str2="hello, "${str1}""

## 获取字符串长度
echo ${#str}

## 截取字符串
echo ${str:2:2}
## Ooutput：is，从下标2开始，取2个字符。

## 查找子字符串
text="hello"
echo `expr index "${text}" ll`

## Output：3，查找 ll 子字符在 hello 字符串中的起始位置。
```

## 七、数组

bash 只支持一维数组，数组下标从 0 开始。

但是[zsh 的数组下标是从 1 开始的](https://unix.stackexchange.com/questions/252368/is-there-a-reason-why-the-first-element-of-a-zsh-array-is-indexed-by-1-instead-o)，大部分 shell 的数组下标都是从 1 开始(e.g. Bourne, csh, tcsh, fish, rc, es, yash)，除了 ksh，由于 bash 是基于 ksh 的，因此它也是从 0 开始的。

[Shell：zsh bash source ./执行脚本的区别](https://leqing.work/language/shell/run-script/)

```bash
## 创建数组的不同方式
nums=([2]="dark blue" [0]=red [1]=yellow)
nums=(red yellow "dark blue")

## 访问数组的不同方式
echo ${nums[1]}

## 访问数组的所有元素
echo ${nums[*]}
echo ${nums[@]}

## 访问数组的部分元素：例如取出数组中下标1开始，长度为2的元素（即取两个元素）
echo ${nums[*]:1:2}

## 访问数组长度
echo ${#nums[*]}

## 删除数组元素，如下删除数组下标0的元素，注意删除后，nums[0]=null，nums[1]等不变
unset nums[0]
```

## 八、控制语句

!!! tip "本文中都采用 `[]` 格式，而不是 `[[]]` 格式"

### 8.1 条件语句

Bash 中的条件语句让我们可以决定一个操作是否被执行。结果取决于一个包在`[[ ]]` 或 `[]` 里的表达式，该表达式被称为 `检测命令` 或 `基元` ，这些表达式的结果是 `true|false` 。

[Shell：单中括号和双中括号的区别](https://leqing.work/language/shell/bracket/)

**注意：条件表达式要放在方括号之间，并且要有空格。**

!!! example "`[$a==$b]`  是错误的，必须写成  `[ $a == $b ]`"

#### if

```bash
if [ condition ]
then
    command1
    ...
    commandN
elif [ condition ]
	command1
	...
	commandN
else
	command1
	...
	commandN
fi

## 写成一行（适用于终端命令提示符）：
if [ condition ]; then command1;commandN; fi
if [ $(ps -ef | grep -c "ssh") -gt 1 ]; then echo "true"; fi
```

#### case

如果你需要面对很多情况，分别要采取不同的措施，那么使用 `case` 会比嵌套的 `if` 更有用。

```bash
case ${value} in
"value1")
	command1
	...
	commandN
	;;
"value2")
	command1
	...
	commandN
	;;
*)
	command1
	...
	commandN
	;;
esac
```

取值后面必须为单词 `in` ，取值可以为变量或常数，每个 case 的结束标记为 `;;` ，若无一匹配模式，使用星号 `*` 捕获该值。

### 8.2 循环语句

#### for

```bash
## 形式1
for var in value1 ... valueN
do
	command1
	...
	commandN
done

## 形式2
for (( i = 0; i < 10; i++ ))
do
		echo $i
done

## 写成一行
for var in value1 ... valueN; do command1;commandN done
```

#### while

当 `condition=true` 时，继续循环，否则退出。

```bash
while [ condition ]
do
	command1
	...
	commandN
done
```

#### until

与 `while` 相反，当 `condition=false` 时，继续循环，否则退出。

```bash
until [ condition ]
do
	command1
	...
	commandN
done
```

### 8.3 break 和 continue

和其他语言一样，单独使用：

- `break;` ：退出循环
- `continue;` ：跳过本次循环迭代

## 九、函数

### 定义及调用

linux shell 可以用户定义函数，然后在 shell 脚本中可以随便调用，注意，**请将函数放在脚本最前面**，否则无法调用！

shell 中函数的定义格式如下：

```bash
function func_name(){
	## statements
	return int
}
```

- 格式省略
  - function 存在时，()可以省略： `function func_name{}`
  - function 省略时，()不可省略： `fucn_name(){}` ，**建议使用这种方式！**
- 函数返回值
  - 只能返回 0~255 的整形数字，超过则做除余%算法(e.g. 256→1)。0 表示正确，其余错误。
  - 若不加 return 语句，shell 默认将以最后一条命令的运行结果作为函数返回值

函数调用：

```bash
## 不传递参数，直接给出函数名即可
func_name

## 传递参数，多个参数之间以空格分隔
func_name param1 param2 ... paramN
```

### 特殊参数

| 参数处理  | 说明                                                                                                           |
| --------- | -------------------------------------------------------------------------------------------------------------- |
| $0        | 当前 shell 程序的名字                                                                                          |
| $n(n>10)  | 第 n 个参数值                                                                                                  |
| $FUNCNAME | 函数名称（仅在函数内部有值）                                                                                   |
| $##       | 传递到脚本或函数的参数个数                                                                                     |
| $\*       | 分别用双引号引用所有参数                                                                                       |
| $@        | 与$\*相同，但是使用时加引号，并在引号中返回每个参数。                                                          |
| $?        | 显示最后命令的退出状态。0 表示没有错误，其他任何值表明有错误。                                                 |
| $-        | 显示 Shell 使用的当前选项，与 set 命令功能相同。                                                               |
| $!        | 后台运行的最后一个进程的 ID 号                                                                                 |
| $$        | 对于任何脚本，在运行时，它将只有一个“主”进程 ID，不论调用多少个子 shell，$$都将返回与该脚本关联的第一个进程 ID |
| $BASHPID  | bash 当前实例的进程 ID                                                                                         |

## 十、流和重定向

使用 `流`，我们能将一个程序的输出发送到另一个程序文件，因此，我们能方便地记录日志等。

`管道` 给了我们创建传送带的机会，控制程序的执行成为可能。

三个文件描述符：

| 代码 | 描述符 | 描述         |
| ---- | ------ | ------------ |
| 0    | stdin  | 标准输入     |
| 1    | stdout | 标准输出     |
| 2    | stderr | 标准错误输出 |

重定向：

- `1>` 为标准输出重定向，可以缩写为 `>`
- 同理， `2>` 为标准错误重定向
- `>>` 和 `>` 的区别在于，`>>` 是在文件后追加，而 `>` 会覆盖原内容

```bash
## 1. 什么是标准输出、标准错误？
$ ls
a.txt

$ ls a.txt b.txt
ls: cannot access 'b.txt': No such file or directory ## 标准错误
a.txt ## 标准输出

## 2. 重定向
$ ls a.txt b.txt 1>file.out 2>file.error ## 执行后没有输出，创建了两个文件

$ cat file.out
a.txt

$ cat file.error
ls: cannot access 'b.txt': No such file or directory
```

理解标准输出、标准错误和重定向之后，进一步深入：

- `2>&1` 将 `标准错误` 重定向到 `标准输出`，可以理解为合并！
- 同理， `1>&2` 将 `标准输出` 重定向到 `标准错误`
- `&>` 将标准输出和标准错误同时重定向， `&>file_name` 表示同时重定向到文件，等同于： `1>file_name 2>&1` 或 `2>file_name 1>&2`
- 注意，为什么必须添加 `&` 符号呢，因为 `2>1` 时，会把标准错误输出到文件名为 1 的文件中！

输出不仅仅只有标准输出和标准错误两种，还有很多其他类型，比如：

- `/dev/null` 文件是一个特殊的文件，写入到它的内容都会被丢弃，也无法从中读取内容。其主要用处是 `禁止输出` 。

## 十一、Debug

shell 提供了一些用于调试脚本的选项，如下所示：

| Short | Name        | Description                                                |
| ----- | ----------- | ---------------------------------------------------------- |
| -f    | noglob      | 禁止模式扩展（globbing），如~会自动扩展为家目录            |
| -i    | interactive | 让脚本以   交互   模式运行                                 |
| -x    | xtrace      | 在执行每条命令前，向 stderr 输出该命令以及该命令的扩展参数 |
| -v    | verbose     | 在执行每条命令前，向 stderr 输出该命令                     |
| -t    | —           | 执行完第一条命令后退出                                     |
| -n    | noexec      | 读取命令，但不执行（语法检查）                             |

使用这些选项有三种方法：

- 命令行提供参数： `$ sh -x ./shell_script.sh`
- 脚本开头提供参数： `#! /usr/bin/env bash -x`
- 在脚本中用 set 命令启用或禁用参数：

```bash
#! /usr/bin/env bash
if [ -z "$1" ]; then
  set -x
  echo "ERROR: Insufficient Args."
  exit 1
  set +x
fi
```

## 十二、命令

- echo
- printf
- grep
- test
- cat

## References

- [一文掌握 shell 语言 - 博客园](https://www.cnblogs.com/jingmoxukong/p/7867397.html)
- [Shell 教程 - C 语言中文网](http://c.biancheng.net/cpp/view/6994.html)
- [Bash 脚本教程 - 廖雪峰](https://wangdoc.com/bash/expansion.html#%E7%AE%80%E4%BB%8B)
- [bash-handbook-zh-CN](https://github.com/denysdovhan/bash-handbook/blob/master/translations/zh-CN/README.md#%E5%A4%A7%E6%8B%AC%E5%8F%B7%E6%89%A9%E5%B1%95)
- [Linux Tools Quick Tutorial](https://linuxtools-rst.readthedocs.io/zh_CN/latest/base/index.html#)
