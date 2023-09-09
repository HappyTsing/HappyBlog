# Linux 初始化 Shell 及插件

!!! note "食用指南"

    本笔记基于 **Ubuntu** 撰写，食用前推荐换源：

    - [清华源](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/)
    - [中科大源](https://mirrors.ustc.edu.cn/help/ubuntu.html)

## zsh

```shell
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install -y zsh wget curl git autojump
cat /etc/shells # 查看所有安装的shell
chsh -s $(which zsh) #修改默认shell为zsh   或者输入chsh后回车，再输入/bin/zsh
echo $SHELL # 查看修改后的使用shell
```

!!! note

    修改默认 shell 后，需要重启机器方可生效！

## oh-my-zsh

### plugin

!!! note

    提供了 Github 官方链接和笔者 fork 下来的 Gitee 镜像链接

```shell title="oh-my-zsh：zsh美化"

sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
sh -c "$(curl -fsSL https://gitee.com/forkhub-tsing/ohmyzsh/raw/master/tools/install.sh)"
```

```shell title="zsh-syntax-highlighting：提供命令高亮"

git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
git clone https://gitee.com/forkhub-tsing/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

```shell title="autosuggestions：记住你之前使用过的命令"

git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://gitee.com/forkhub-tsing/zsh-autosuggestions.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

```shell title="配置 .zshrc 启动插件"
vim ~/.zshrc
## 找到plugins=(git)，修改为：
plugins=(git autojump zsh-syntax-highlighting zsh-autosuggestions sudo extract)
# sudo是ohmyzsh自带的插件，功能是在你输入的命令的开头添加sudo ，方法是双击Esc
# extract也是自带插件，不用再去记不同文件的解压命令，方法是extract +你要解压的文件名

# 绑定~为接受建议，在文件末尾添加如下内容：
bindkey '`' autosuggest-accept

# 使用如下shell代码一键配置
sed -i '/plugins=(git)/ c plugins=(git autojump zsh-syntax-highlighting zsh-autosuggestions sudo extract)' ~/.zshrc
if [ ! `grep -c "bindkey .* autosuggest-accept" $HOME/.zshrc` -ne "0" ];then
    sed -i '$a bindkey '"'"'`'"'"' autosuggest-accept' ~/.zshrc
fi
```

### theme

!!! note "推荐主题"

    - powerlevel10k
    - pure

#### Powerlevel10k

!!! warning "请确保已安装字体 [MesloLGS NF Regular](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS NF Regular.ttf)"

```shell
git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

# vim ~/.zshrc 找到ZSH_THEME，修改为：ZSH_THEME="powerlevel10k/powerlevel10k"
# 通过命令一键配置：
sed -i '/ZSH_THEME="/ c ZSH_THEME="powerlevel10k/powerlevel10k"' ~/.zshrc
```

重启 shell，若选择了 p10k 主题，此时会进入主题设置，按引导进行即可，如果设置后不满意：

```shell title="重新配置主题"
p10k configure
```

#### Pure

```sh
git clone https://gitee.com/forkhub-tsing/pure.git "$HOME/.zsh/pure"

# 参见 https://github.com/sindresorhus/pure#install
# 通过命令一键配置：

# 新增配置
echo 'fpath+=($HOME/.zsh/pure)' >> ~/.zshrc
echo 'autoload -U promptinit; promptinit' >> ~/.zshrc
echo 'prompt pure' >> ~/.zshrc
```

```shell title="删除主题配置"

# 删除p10k及pure的旧配置
sed -i '/fpath.*pure/d' ~/.zshrc
sed -i '/autoload.*promptinit/d' ~/.zshrc
sed -i '/prompt pure/d' ~/.zshrc

# Set ZSH_THEME="" in your .zshrc to disable oh-my-zsh themes.
sed -i '/ZSH_THEME="/ c ZSH_THEME=""' ~/.zshrc
```

## other plugin

- [bat](https://github.com/sharkdp/bat)，更好用的 cat

- tig，更好用的 gitlog

- thefuck

- htop, 更好用的 top

- ydict，翻译

## shortcuts

- bat 代替 cat，可以高亮显示代码

- j 文件名，可以快速跳转到某个目录，而不需要输入这个目录的前序目录
- d，可以查看已经去过的目录，然后输入对应数字进入对应目录
- 出现提示时，输入~或者方向右键应用提示
- 删除 shell 中的一行内容。首先 ctrl+a 移动到行首，再 ctrl+k 删除一行的内容
- r，重复上一条命令
- code filename 命令，使用 vscode 打开某文件
- .zshrc 中配置了 plugins=(sudo)后，连续按两下 esc 键即在命令前加上 sudo
- fuck，安装了 thefuck 后输入即可纠正错误

## Reference

- [Github powerlevel10k](https://github.com/romkatv/powerlevel10k#meslo-nerd-font-patched-for-powerlevel10k)
- [iterm2 和 zsh 终端体验优化](https://bytedance.feishu.cn/docs/doccn6xXJnUTedx2roBjKAMX2Gf#)
- [程序员内功系列-iTerm2 与 Zsh 篇](https://xiaozhou.net/learn-the-command-line-iterm-and-zsh-2017-06-23.html)
- [程序员内功系列-常用命令行工具推荐](https://xiaozhou.net/learn-the-command-line-tools-md-2018-10-11.html)
- [oh my zsh 插件推荐](https://hufangyun.com/2017/zsh-plugin/)
