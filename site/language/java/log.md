# Go

## Installation

```bash

# mac
brew install go
# 设置GOROOT、GOPATH、GOBIN

# ubuntu
sudo add-apt-repository ppa:longsleep/golang-backports
sudo apt update

# 每个ppa都会在/etc/apt/sources.list.d 目录下创建一个list文件。
# 换源：http://ppa.launchpad.net -> http://launchpad.proxy.ustclug.org

# 注释掉第一行，第二行修改如下：
#deb http://ppa.launchpad.net/longsleep/golang-backports/ubuntu bionic main
deb https://launchpad.proxy.ustclug.org/longsleep/golang-backports/ubuntu bionic main

# 更新软件列表
sudo apt-get update

# 安装最新版本
sudo apt install golang-go
# 指定版本
sudo apt install golang-1.17-go

# 必须要设置，否则使用go安装的东西无法使用。go env 查看信息。
vim ~/.zshrc
export GOROOT=/usr/lib/go-1.17 # 记得修改版本
export GOPATH=$HOME/go
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH

# 刷新配置
source ~/.zshrc
```

说明：

- `GOROOT`：安装目录（go语言安装目录）。
- `GOPATH`：工程目录（自己工程项目目录），包含三个目录：
    - `bin`目录：可执行文件
    - `pkg`目录：编译好的库文件，主要是*.a文件
    - `src`目录：源文件
- `GOBIN`：可执行文件目录
- `PATH`：将go可执行文件加入PATH中，使GO命令与我们编写的GO应用可以全局调用

参考：

- [Go的新手安装](https://zh-tw.coderbridge.com/@Jemmy1234/59d6b40fb69a4461b40ae72a030c509a)