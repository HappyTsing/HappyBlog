# Vim 及其插件和入门

## Install

!!! success "两类开箱即用的 vim 插件管理工具"

    - [vimrc](https://github.com/amix/vimrc)：推荐

    - [vimplus](https://github.com/chxuan/vimplus)

**vimrc**

```shell title="安装 vimrc"

git clone --depth=1 https://github.com/amix/vimrc.git ~/.vim_runtime
git clone --depth=1 https://gitee.com/forkhub-tsing/vimrc.git ~/.vim_runtime

sh ~/.vim_runtime/install_awesome_vimrc.sh
```

**Vimplus**

```shell title="安装 vimplus"
git clone https://github.com/chxuan/vimplus.git ~/.vimplus
git clone https://gitee.com/forkhub-tsing/vimplus.git ~/.vimplus

cd ~/.vimplus
./install.sh
```

```shell title="查看 vim 插件"
vim ~/.vimrc
# 可以看到如下内容，两个call中间的内容就是我们的插件
call plug#begin()
Plug 'preservim/NERDTree'
call plug#end()
```

```shell title="该 vimplus 插件默认安装了若干插件，如果安装失败："
# 进入vim文本编辑器
vim

# 安装所有插件
:PlugInstall

# 更新插件
:PlugUpdate

# 如果你不想更新所有的插件，你可以通过添加插件的名字来更新任何插件:
:PlugUpdate NERDTree
```

## Usage

vim 自带教程，命令行输入：vimtutor

**操作符：**

- d：删除
- c：更改，删除+插入
- y：复制

**一个简短的动作列表：**

- w - 从当前光标当前位置直到下一个单词起始处，跳过所有空格。
- e - 从当前光标当前位置直到下一个有效单词末尾，不包括空格。
- $ - 从当前光标当前位置直到当前行末。

**删除粘贴：**

- u 撤销一次，U 恢复到初始状态

- ctrl-R：redo，取消撤销 dd

- dd 删除一行后，光标移动到准备**置入的位置的上方**，使用 p 粘贴

**插入命令：**

- i，光标前方插入
- a，光标后方插入
- o，光标上新开一行
- O，光标下新开一行
- cw/ce，或者 c$等操作，都可以在删除一定的东西后进入插入状态

**替换命令：替换完毕后会自动回到 normal 状态**

- r，光标处替换一个字符
- R，光标处开始替换，按 esc 退出替换

**搜索命令**

- /，正序查询，n 下一个，N 上一个
- ?，倒叙查询
- 查询时忽略大小写：`:set ic`，ignore case，若要禁用忽略大小写：`:set noic`

**配对命令**

- 光标置于括号，%，匹配括号
- 置于某个单词，\*顺序查询相同单词，#倒叙查询

**替换命令**

- `s/old/new`，替换当前行第一个匹配串

- `s/old/new/g`，替换光标所在行的匹配串
- `#,#s/old/new/g`，#,#代表首尾两行的行号，替换这两行内的匹配串
- `%s/old/new/g`，直接替换整个文件中的每个匹配串
- `%s/old/new/gc`，会找到整个文件中的每个匹配串，并且对每个匹配串提示是否进行替换

**在 vim 内执行外部命令**

- 输入`:!`之后，再输入 shell 命令即可

**打开、保存、另存为、退出**

- `:e <path/to/file>` → 打开一个文件
- `:w` → 存盘
- `:saveas <path/to/file>` → 另存为 `<path/to/file>`
- `:x`， `ZZ` 或 `:wq` → 保存并退出 (`:x` 表示仅在需要时保存，ZZ 不需要输入冒号并回车)
- `:q!` → 退出不保存 `:qa!` 强行退出所有的正在编辑的文件，就算别的文件有更改。
- `:bn` 和 `:bp` → 你可以同时打开很多文件，使用这两个命令来切换下一个或上一个文件。（陈皓注：我喜欢使用:n 到下一个文件）

**选择性保存**

- v 进入可视模式，使用 hjkl 选择所需内容，也可通过$、%、\*/#、0 等方式选择
- 选择完毕后按 : 字符。您将看到屏幕底部会出现 :'<,'> 。
- 现在请输入 `w TEST`，其中 TEST 是一个未被使用的文件名。确认您看到了:`'<,'>w TEST` 之后按 <回车> 键。

**提取和合并文件**

- `:r 文件路径/文件名`
- 也可以`:r shell命令`
- 插入的内容出现在光标处

**补全功能**

- `CTRL-D`，输入:e 后，按 CTRL-D，会显示所有 e 开始的命令
- `tab`，只能补全命令

## References

- [Vim 练级攻略](https://coolshell.cn/articles/5426.html)
- [Github Vimplus](https://github.com/chxuan/vimplus)
