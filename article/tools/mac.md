# Cook Mac

## 一、必备设置

### 1.1 更改 OS X 截图默认保存路径

MAC `Command Shift 3` 截图时，存放在 `~/Desktop` ，会很乱，将其放到 `~/Downloads/Cache/screenshots` 。

```shell
# open ITerm2, run：
defaults write com.apple.screencapture location ~/Downloads/Cache/screenshots
killall SystemUIServer
```

!!! note "推荐将 Snipaste 的默认路径也修改为此处"

### 1.2 关闭翻盖自动开机

```shell
sudo nvram AutoBoot=%0   # 关闭
sudo nvram AutoBoot=%03  # 开启
```

### 1.3 安装 Xcode 命令行工具

```shell
xcode-select --install
```

## 二、文件管理

重要的文档和笔记均使用 OneDrive 三端同步

```shell
/OneDrive      # 云同步盘，重要信息存放处
/Documents     # 应用所存储的内容都放在这，比如zotero、MarginNote、OneDrive等
/Projects      # 项目

/Downloads     # 下载 存储下载的文件，分类放好
	/Cache       # 临时使用，可随时删除
		/screenshots
	/Package
		/Plugin

/Applications  # 应用
/Movies        # 影视
/Music         # 音乐
/Picture       # 图片
/Desktop       # 桌面，不使用！
/Library       # 无需修改
/Public        # 无需修改
```

## 三、软件推荐及配置

**免费**

- AltTab：[Github](https://github.com/lwouis/alt-tab-macos)，cmd tab 增强，**必备神器**！
- snipaste：[官网](https://www.snipaste.com/)，截图、贴图、录制屏幕。同类推荐：iShot
- ClashX：[Github](https://github.com/yichengchen/clashX)，代理。
- PicGo：[Github](https://github.com/Molunerfinn/PicGo)，图床。
- Iterm2：[官网](https://iterm2.com/)，shell。
- JetBrains Toolbox：[官网](https://www.jetbrains.com/toolbox-app/)，IDE 管理器。
- Tencent Lemon：[官网](https://lemon.qq.com/)，磁盘空间清理
- 滴答清单：[官网](https://lemon.qq.com/)，磁盘空间清理
- Hidden Bar：[官网](https://lemon.qq.com/)，定制菜单栏
- Switch Key：[官网](https://lemon.qq.com/)，磁盘空间清理
- oss browser：官网，阿里云 oss 浏览器
- medis：Apple Store，redis 可视化
- Bob：Apple Store，翻译。

!!! info "体验一般，但你可能需要"

    - 知云文献翻译
    - Notion

**收费**

- Alfred：官网。**唯一真神**。同类推荐：hapigo
- Magnet：Apple Store，分屏软件。同类推荐：moom
- keka：官网，解压。
- Popclip：官网，划词增强（配合插件，如 Bob、Alfred、Dash 等）
- New File Menu：官网，访达扩展
- MarginNote3：官网，阅读文献
- 饺子翻译：官方，划词翻译、截图翻译、OCR

!!! info "存在免费替代品"

    - DaisyDisk：官网，磁盘管理。 免费替代品：Tencent Lemon
    - Bartender 4、istat menus：收费，官网，定制菜单栏。免费替代品：Hidden Bar

### 3.1 ITerm2

#### 3.1.1 代理

!!! example "以 ClashX 为例：点击 ClashX，复制终端代理命令"

```bash
export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
```

- 临时修改：将上述命令运行即可
- 永久修改：将其写入配置文件`~/.zshrc`中

#### 3.1.2 shell 美化

[Linux Initialize Shell And Plugins](https://leqing.work/tools/linux/initialize/)

### 3.2 Alfred

#### 3.2.1 同步数据

Advanced -> 同步 -> iCloud/alfred

#### 3.2.2 `>`默认打开 ITerm

① 运行如下命令，获取脚本

```bash
curl --silent 'https://raw.githubusercontent.com/vitorgalvao/custom-alfred-iterm-scripts/master/custom_iterm_script.applescript' | pbcopy
```

② Alfred Preferences -> Features -> Terminal

③ 粘贴脚本

### 3.2.3 workflow

- Dash：直接下载 Dash 软件，进入 Intergration。
- GitHub：[官网](https://www.alfredapp.com/workflows/)
- LastPass CLI：[官网](https://www.alfredapp.com/workflows/)
- Kill Process：[Github](https://github.com/zenorocha/alfred-workflows)
- Ip address：[Github](https://github.com/zenorocha/alfred-workflows)
- Youdao Translate：[Github](https://github.com/wensonsmith/YoudaoTranslate)

### 3.2.4 search from cloud

preferences -> Features -> Fefaults Results -> Search Type -> `add cloud path`

## 3.3 Homebrew

文件安装位置：

- m1(ARM)：/opt
- X86：/usr/local

换中科大源：

```shell
# Homebrew源
echo 'export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.ustc.edu.cn/brew.git"' >> ~/.zshrc
# cask源
brew tap --custom-remote --force-auto-update homebrew/cask https://mirrors.ustc.edu.cn/homebrew-cask.git
# core源
echo 'export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.ustc.edu.cn/homebrew-core.git"' >> ~/.zshrc
# bottles源
echo 'export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.ustc.edu.cn/homebrew-bottles"' >> ~/.zshrc

brew update
brew upgrade # wait a minute
```

## 3.4 Notion

!!! note "主要介绍如何在 Notion 中嵌入流程图"

- Diagrams：[教程](https://www.diagrams.net/blog/embed-diagrams-notion)

  - File-Embed-Notion

    ![diagrams](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/mac/202111161719585.png)

  - Edit：Custom（不要选 make a copy）
  - Check：需要为 public，否则需要登录（网页版登录后可正常查看，桌面版无法登陆）
  - 使用：notion 中输入`/embed`，将链接复制进去即可。

- [whimsical](https://whimsical.com/)

## 3.5 popclip

Download From [PopClip Extensions](https://pilotmoon.com/popclip/extensions/)：

- Terminal
- Google Search
- Google Scholar
- Bob
- Alfred
- DeepL Translator
- Join Lines
- Remove Spaces
- Paste And Match
- Run Command

## 3.6 翻译

- Alfred：有道翻译工作流
- 浏览器沙拉查词：有道翻译
- Bob 安装 [DeepL Plugin](https://github.com/geekdada/bob-plugin-deepl-translate)，阿里翻译 + DeepL
- 饺子翻译：火山翻译

!!! note "API 获取"

    - [有道翻译](https://ai.youdao.com/?keyfrom=fanyi-new-nav#/)
    - [DeepL 翻译](https://www.deepl.com/translator)
    - [火山翻译](https://translate.volcengine.com/api)
    - [阿里翻译](https://translate.alibaba.com/)

# 四、环境变量

Mac 中环境变量的加载顺序如下：

```bash
/etc/profile
/etc/paths

~/.bash_profile
~/.bash_login
~/.profile

~/.bashrc
```

**系统级别：**

- `/etc/profile`：全局配置，不管哪个用户，登录时都会读取该文件。**不建议修改**。
- `/etc/paths`：将全局环境变量添加到 paths 文件中。

**用户级别**：

- `~/.bash_profile`：当该文件存在时，`~/.bash_login`和`.profile`会自动失效，即便其中存在着配置。

!!! note

    注意，如果你使用 zsh，那么需要在 `~/.zshrc` 中添加：`source ~/.bash_profile`，如果使用 bash，则无需操作，会自动生效！

    原因：`/etc/bashrc`文件中应该设置了导入`.bash_profile`配置的操作，但是`/etc/zshrc`中没有。

- `~/.bashrc` OR `~/.zshrc`

  - 如果默认 shell 是 bash，那么 shell 启动时会触发`~/.bashrc`
  - 如果默认 shell 是 zsh，那么 shell 启动时会触发`~/.zshrc`

!!! note "查看默认 shell：`echo $SHELL`"

**生效方法**

- 重启生效
- 不重启生效：`source ~/.zshrc`

**PATH 变量**

```bash
# 语法
export PATH=$PATH:<PATH 1>:<PATH 2>:...:<PATH N>

# 实例
export JAVA_HOME=/user/.../jdk/Home
export Go_HOME=/USER/local/go
export PATH=$PATH:$GO_HOME/bin:$JAVA_HOME/BIN

# 查看环境变量的值
echo $变量名
```

**总结**

- 全局的变量：`~/.bash_profile`
- shell 设置：`~/.zshrc`

## References

- [MacOS 环境变量加载顺序](https://www.cnblogs.com/meetrice/p/14204054.html)

- [少数派 \| Mac 基础教程：如何更改 OS X 截图默认保存路径](https://sspai.com/post/26327)
- [Github-Custom-alfred-iterm-scripts](https://github.com/vitorgalvao/custom-alfred-iterm-scripts)
