# git：老司机上路

!!! note

    笔者使用的是 zsh，其默认配置许多高效的 Git 快捷键，有关 zsh 的安装可以参见：[Linux 初始化 Shell 及插件](https://leqing.work/tools/linux/initialize/)

## git config

**Common Usage**

```shell
git config user.name <namevalue>
git config user.email <emailvalule>

git config --global --edit   # 直接编辑配置文件
git config --list            # 查看当前配置
```

**git config levels and files**

- **--local**：仓库级别，配置存放在当前仓库的`.git/config`
- **--global**：计算机系统用户级别，存放在家目录的`~/.gitconfig`
- **--system**：机器级别，涵盖所有计算机用户和所有仓库，[详见](https://www.atlassian.com/git/tutorials/setting-up-a-repository/git-config)

优先级`local > global > system`，大部分情况下使用`--global` 选项配置配置用户名和邮箱即可，`--local` 可以用来配置对不同仓库以不同身份提交。

**Other config**

```shell
git config --global color.ui auto         # 如果 Git 红色和绿色等颜色有点奇怪，可以试试配置这个，还有其他的 color 选项
git config --global core.editor vim       # 使用 vim 当作 Git 的默认编辑器，提交等情况下 Git 需要使用编辑器。
git config --global core.ignorecase false # 文件大小写敏感。
```

**What does it do?**

- **Github email address**：`123456@example.com`

- **user.email**：`123456@example.com`

当`Github email address`与`user.email`相等时，`git push`之后，显示的 commit 的 Github 用户就是对应邮箱的用户，如果`user.email`是没有注册 Github 的邮箱，那么就不会显示具体的 Github 用户，而是一个随机空白帐号提交。

- **user.name**：经过测试，`user.name`就算和`Github username`相同，似乎也无法识别！

## git init

初始化仓库，执行 git init 之后，目录中会生成 **.git** 目录，就表示这是一个 git 仓库。

**Params：**

- **--bare**：初始化 **裸仓库** ，裸仓的使用常见于 Git 仓库服务器，裸仓没有创建 working tree，所以除了 git 记录外，不含有任何文件，也因此不能在裸仓中执行任何 git 操作，可以避免污染。

## git add

将修改的文件添加到暂存区：

```shell
git add <filename>

git add -A            # 提交所有文件
git add --all         # 提交所有文件
git add -u            # 提交modified、deleted，不提交new
git add .             # 提交modified、new，不提交deleted
```

**zsh shortcuts**：`ga`

## git commit

将暂存区的修改提交到本地仓库：

```shell
git commit [<options>] [--] <pathspec>...

git commit                     # 提交改动，会打开默认的编辑器，用于编写提交的 message，保存之后完成提交
git commit -m "<message info>" # 不打开编辑器直接输入 message info 进行提交。
git commit -a：                # 将工作区的内容一并提交。就是 git add --all 和 git commit 的组合。

git commit --amend                # 将此次提交追加到上次提交上
git commit --amend --reset-author # 重置提交作者，并且修改最近一次提交的内容
```

**zsh shortcuts**：`gcmsg "<message info>"`

## git status

查看工作区状态：未被 add 的文件会显示 Untracked，未提交显示 Change to be committed，所有文件提交则显示 nothing to commit。

**zsh shortcuts**：`gst`

## git log

查看提交历史，可以看到之前所有的 commit 信息，包括 commit 的 Hash、日期、人员、日志。

## git diff

对比和显示 commit 之间、工作区（红色）或者暂存区（绿色）等详细的修改内容。

```shell
git diff                     # 工作区和暂存区对比，即你即将要 git add 的内容
git diff --cached            # 暂存区和 commit 之间的对比，即你即将要 git commit 的内容
git diff <commit>            # 工作区和指定的 commit 对比
git diff --cahced <commit>   # 暂存区和指定的 commit 对比
git diff <commit1> <commit2> # 显示 commit2 对比 commit1 修改内容
```

**zsh shortcuts**：

- git diff：`gd`
- git diff --cached：`gdca`

## git show

详细的显示某次提交的修改内容，用来查看某个 commit 的具体改动内容，默认情况下 git show 显示的是 HEAD 的改动。

```shell
git show          # 显示上次 commit 的修改内容
git show <commit> # 显示某一次 commit 的修改内容
```

## git restore

撤销修改，用于未 commit 的修改：

```shell
git restore <filename>          # 修改文件，但没有 git add 该文件，可恢复最新 commit 的提交情况
git restore --staged <filename> # 修改文件，且 git add 该文件，可恢复到未 git add 的情况
```

## git reset

撤销修改

```shell
git reset HEAD <filename>       # 同git restore --staged <filename>
```

版本回退，用于已 commit 的修改，**将该次提交之后的所有提交都丢弃**。

```shell
git reset --hard HEAD^                 # 回退到上一个版本，如果是 HEAD^^ 则回退到上上个版本，以此类推
git reset --hard HEAD~n                # 回退到上 n 个版本
git reset --hard HEAD <commit id>      # 定位到commit id（版本号）处

# 获取commit id,两种方法：
git log
git reflog
```

!!! note

    如果是已经推入远程仓库的分支，**禁止** 使用 `git reset`，除非你非常清楚的知道自己在做什么，否则 **人民会痛恨你，野狗会追咬你**，这种情况下试试 `git revert`。

除上述用法之外，`git reset` 还有 `--mixed` 和 `--soft` 等参数，具体可以自己 Google 了解。

示例：

![before git reset](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/git/20210915145829.png)

运行命令`git reset`回退版本到第二次提交（add b)：

```shell
~ git reset --hard  fc442e084dd0a9b70c41bac313b2bc3a7c148a5b
HEAD is now at fc442e0 add b
```

再次运行`git log`

![after git reset](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/git/20210915145914.png)

可以看到，已经回到了第二次提交，且之后的提交都已经被删除！

## git revert

撤销某一次提交。将某一次提交的修改恢复回去。

```shell
git revert <commit id>  # 将指定 commit id 的提交修改的内容恢复，对其他所有提交没有影响！
```

再次创建一个文件 c，提交：

![before git revert](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/git/20210915150130.png)

运行命令`git revert`来撤销第二次修改（add b）：

```shell
git revert fc442e084dd0a9b70c41bac313b2bc3a7c148a5b
# 此时会跳出一个commit界面
Removing b
[master eea53e9] Revert "add b"
 1 file changed, 1 deletion(-)
 delete mode 100644 b
```

再次运行`git log`：

![after git revert](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/git/20210915150540.png)

运行`ls`命令查看当前文件：

```shell
~ ls
a c
```

综上可以得出结论：

- `git revert`是 HEAD 继续前进，只是新的 commit 的内容和要 revert 的内容正好相反，以此抵消修改。在本例中，抵消了第二次修改（add b）
- `git revert`仅仅针对指定的提交进行恢复，不会影响其余任何提交！比如本例中`add a`和`add c`两次提交都没有影响！

**git revert 和 git reset 的区别**

- `git revert <commit id>`：再次创建一个提交，本次提交的修改和`<commit id>`提交的修改相反，来实现撤销的效果。
- `git reset --hard HEAD <commit id>` ：直接回退到`<commit id>`，删除之后的所有修改！

使用`git reflog`查看所作的所有操作：

![git reflog](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/git/20210915151050.png)

## git tag

标签管理

```shell
git tag <-d> <tagname>    # 给该分支打上标签，注意一定要先使用git checkout切换到你所要添加标签的分支，加上-d则为删除该标签
git tag <tagname> <commit id>  # 给已经提交的版本打上标签，则需要在后面加上他的版本号，查询版本号可以使用git reflog
git show <tagname>             # 可以查看该标签名的版本的具体信息
```

注：所有标签都只存储在本地，不会推送到远程仓库，若要推送某个标签到远程仓库，则使用：

```shell
git push origin <tagname>      # 推送标签到远程仓库
git push origin --tag          # 推送所有tag
git push origin --all          # 推送所有分支和tag
```

某个标签已经推送到远程仓库，则除了需要`git tag -d <tagname>`删除之外，还需要：`git push origin :refs/tags/<tagname>`来删除一个远程标签。

## References

- [Linux 初始化 Shell 和插件](https://leqing.work/tools/linux/initialize/)
- [Git：分支那些事儿](https://leqing.work/tools/git/branch/)
- [Git：浅析远程协作](https://leqing.work/tools/git/remote/)
