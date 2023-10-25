# Git：分支那些事儿

## git branch

显示当前分支，删除分支，新增分支，分支重命名，跟踪远程分支等。

```shell
git branch     # 显示所有本地分支。
```

**Params：**

| 参数           | 效果                                                                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| -r             | **显示所有远程分支**。因为分布式的关系，这里的远程分支，其实是本地仓库中对应远程仓库分支的本地映射，并不是指实际服务器上的分支，是通过 pull 或者 push 等来同步的。 |
| -a             | **显示所有本地分支和远程分支**。                                                                                                                                   |
| -q/--no-merged | 显示已合并/未合并到当前分支的分支。                                                                                                                                |
| -d             | **删除分支**，会检查是否已合并，如果未合并则会提示：“还未合并，无法删除”，`-D` 则会强制删除。                                                                      |
| -m             | **分支重命名**，会检查新分支名是否存在，`-M`·强制重命名。                                                                                                          |
| --track/-t     | 跟踪远程分支，与远程分支的流关联，可以 pull 或者 push。例如：git branch --track foo origin/foo，跟踪远程分支 foo。                                                 |
| -vv            | **查看本地分支和远程分支的关联关系**                                                                                                                               |

**zsh shortcut**：`gb`

## git checkout

检出某个状态，即快照：

- 文件
- 分支

| 命令                                    | 效果                                                                                                                                                |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| git checkout old-branch                 | 切换到已经存在的分支                                                                                                                                |
| git checkout -b new-branch              | 从当前分支检出新分支 new-branch                                                                                                                     |
| git checkout -b new-branch [commit/tag] | 从某个 commit 或者 tag，分支检出新分支 new-branch                                                                                                   |
| git checkout -t origin/test-branch      | 跟踪远程分支 test-branch                                                                                                                            |
| git checkout file1                      | 检出文件 file1 在 HEAD 的状态，检出的默认是暂存区，即如果暂存区有 file1，检出的是暂存区的状态。git checkout HEAD file1 则可以检出 HEAD 的文件状态。 |
| git checkout -- file1                   | 检出文件在 HEAD（暂存区有则是暂存区）的状态，即丢弃工作区的修改                                                                                     |

**zsh shortcut**：

- git checkout：`gco`
- git checkout -b：`gcb`

## git merge

合并分支。假设我当前分支是 master。

```shell
git merge branch           # 将 branch 分支合并到 master 分支，相当于git merge --ff merge branch
git merge --no-ff branch   # 创建一个新的 commit，具体见示例
git merge --squash branch  # 将 branch 合并到 master，且只有一个提交记录
```

**zsh shortcut**：`gm`

合并分支过程中可能会遇到冲突(Conflicts)，解决冲突之后 add 暂存，然后 commit 提交即可。

**gm branch 与 gm --no-ff branch**

`git merge`也可以写成`git merge --ff`，其中参数`--ff`意为`fast-forward`。该命令指的是把 HEAD 指针指向要合并分支的头，完成一次合并。

`git merge --no-ff`中的`--no-ff`意为强行关掉`fast-forward`，所以在使用这种方式后，分支合并后会生成一个新的 commit，这样，在使用`git log`从提交历史上就可以看到分支信息。

测试前提：master 分支创建了文件 a，test 分支检出，创建文件 b。

```shell
git init                    # 初始化仓库，此时分支为 master
touch a                     # 创建文件a
ga --all                    # 添加到暂存区
gcmsg "master add a"        # 提交到本地仓库
gcb test                    # 检出分支 test
touch b                     # 创建文件 b
ga --all                    # 添加到暂存区
gcmsg "test add b"          # 提交到本地仓库
gco master                  # 切换回 master 分支
```

- `git merge test`

  ![git merge test](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/git/20210915204730.png)

- `git merge --no-ff test`

  ![git merge --no-ff test](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/git/20210915204845.png)

综上可知：

- `git merge test`：会直接将 master 和 test 分支，从检出的那个提交点开始融合。
- `git merge --no-ff test`：会保留原 test 分支的信息，并且进行一个新的提交。

参考：[Git 版本控制系列：使用 git merge --no-ff 合并分支](https://blog.csdn.net/wangqingchuan92/article/details/103137960)

## git rebase

俗称“衍合”或者“变基”，与`git merge`不同，`git rebase`会将被分支的 commit **续** 到当前分支上，让 commit 历史呈现 **单线** 的状态，非常方便追溯问题和重置修改。

**注意：一定要注意协作分支或者主干分支的 rebase，因为这会改变历史，你绝对不愿意看到一个协作分支或者主干分支的历史变来变去，其他同学再来合并的时候就会显示大量的改动历史，但内容又没有修改，甚至导致其他同学无法正常拉取更新。**

示例：此时的分支状态如图，开发任务分叉到两个不同分支，又各自提交了更新。

![分叉的提交历史。](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/git/20210915211055.png)

**方案一：**

使用：`git merge --no-ff experiment` （当前分支 master），效果如图：

![通过合并操作来整合分叉了的历史。](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/git/20210915211058.png)

**方案二：**

提取在 `C4` 中引入的补丁和修改，然后在 `C3` 的基础上应用一次。 在 Git 中，这种操作就叫做 **变基（rebase）**。 你可以使用 `rebase` 命令将提交到某一分支上的所有修改都移至另一分支上，就好像“重新播放”一样。

- 首先，检出 `experiment` 分支，然后将它变基到 `master` 分支上

  ```shell
  git checkout experiment
  git rebase master # 以master为基础
  ```

  它的原理是首先找到这两个分支（即当前分支 `experiment`、变基操作的目标基底分支 `master`） 的最近共同祖先 `C2`，然后对比当前分支相对于该祖先的历次提交，提取相应的修改并存为临时文件， 然后将当前分支指向目标基底 `C3`, 最后以此将之前另存为临时文件的修改依序应用。

  ![将 `C4` 中的修改变基到 `C3` 上。](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/git/20210915211103.png)

- 最后，回到 `master` 分支，进行一次快进合并。

  ```shell
  git checkout master
  git merge experiment
  ```

  ![`master` 分支的快进合并。](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/git/20210915211107.png)

参考：[Git Docs 分支 - 变基](https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%8F%98%E5%9F%BA)

## References

- [Git 版本控制系列：使用 git merge --no-ff 合并分支](https://blog.csdn.net/wangqingchuan92/article/details/103137960)
- [Git Docs 分支 - 变基](https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%8F%98%E5%9F%BA)
- [Git：老司机上路](https://leqing.online/tools/git/base/)
- [Git：浅析远程协作](https://leqing.online/tools/git/remote/)
