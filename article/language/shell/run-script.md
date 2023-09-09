# 执行脚本: zsh bash source ./


## 前提概念

- 交互模式：手动输入一些列 Linux 命令，比如 `ls` 、 `cd` 等

- 非交互模式：可以理解为执行 shell 脚本，shell 从文件或管道中读取命令并执行，当 shell 解释器执行完文件中的最后一个命令，shell 进程终止，并回到父进程。

  - 在新进程中运行 shell 脚本

    - 将脚本程序作为 **可执行程序** 运行：`./shell_script.sh` ，这种方法需要先给脚本添加执行权限： `chmod +x shell_script.sh`

    - 将 shell 脚本作为参数传递给 shell 解释器：`bash shell_script.sh` ，这种方法不需要给脚本执行权限，也不需要在脚本文件的第一行指定脚本解释器，指定了也会被忽略。

  - 在当前进程中运行 shell 脚本：`source shell_script.sh` ，这种方法会强制执行脚本文件中的全部命令，不需要给脚本执行文件。这也是为什么，当我们 `source ~/.zshrc`的时候，配置会立即生效，是因为就是在当前进程运行的！
  
    !!! note 
        通过 source 执行时，脚本文件指定脚本解释器的命令是无效的，默认使用当前 shell

## 实验分析

![test](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/shell/test.png)

如图，构建了一个数组： `nums=[red yellow green]`

- `zsh test.sh`： `#!/bin/bash` 被忽略，因此当前 shell 为 zsh，zsh 的数组从 1 开始计数，因此取出的内容为 red。
- `bash test.sh`： `#!/bin/bash` 被忽略，因此当前 shell 为 bash，bash 的数组从 0 开始计数，因此取出的内容为 yellow。
- `./test.sh` ：新开进程进行运行，`#!/bin/bash` 被运行，因此当前 shell 为 bash，bash 的数组从 0 开始计数，因此取出的内容改为 yellow。
- `source test.sh` ：在当前进程运行，当前进程的 shell 为 zsh（图中第一次 source）， `#!/bin/bash` 被忽略，当前 shell 为 zsh，因此取出的内容为 red。

  第二次运行 source 时，当前 shell 为 bash，因此取出的内容为 yellow。
