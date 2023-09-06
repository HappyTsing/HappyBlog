# 创建镜像

创建镜像的方法有三种：

- 基于本地模板导入
- 基于已有镜像的容器创建
- 基于 Dockerfile 创建

## 基于本地模板

**一、导出容器**

如果要导出本地某个容器，可以使用`docker export`命令。

```shell
# docker ps -a
------------------------------------------------------------------------------------------------------------
CONTAINER ID   IMAGE          COMMAND      CREATED          STATUS                        PORTS     NAMES
3ee1f9d5ea75   01187e1edca1   "/bin/zsh"   43 minutes ago   Exited (130) 15 minutes ago             Ethereum
------------------------------------------------------------------------------------------------------------

docker export 3ee1f9d5ea75 > Ethereum.tar
```

在上例中，成功将导出容器的快照到本地文件 `Ethereum.tar` 中。

**二、导入容器**

可以使用`docker import`从容器快照文件中再导入为镜像，例如

```shell
docker import Ethereum.tar test/ethereum:v1

# docker images
------------------------------------------------------------------------------------------------------------
REPOSITORY          TAG             IMAGE ID       CREATED          SIZE
test/ethereum       v1              22a8ea6d529c   23 seconds ago   776MB
------------------------------------------------------------------------------------------------------------
```

也可以通过指定 URL 或者某个目录来导入，例如

```shell
docker import http://example.com/exampleimage.tgz example/imagerepo
```

!!! tip

	类似的，通过 `docker save [IMAGE]` 将 **镜像** 保存成 tar 归档文件，然后使用 `docker load` 将该归档文件加载为镜像。

## 基于已有镜像的容器

**联合文件系统**：一种 **分层**、轻量级并且高性能的文件系统，它支持对文件系统的修改作为一次提交来一层层的叠加，同时可以将不同目录挂载到同一个虚拟文件系统下。

联合文件系统是 **Docker** **镜像的基础**。镜像可以通过分层来进行继承，基于基础镜像（没有父镜像），可以制作各种具体的应用镜像。

重点：**不同** **Docker** **容器就可以共享一些基础的文件系统层**，同时 **再加上自己独有的改动层**，大大提高了存储的效率。

**示例前提：**

```shell
docker images
------------------------------------------------------------------------------------------------------------
REPOSITORY           TAG       IMAGE ID       CREATED         SIZE
happytsing/ubuntu    latest    52199afd43c7   2 hours ago     813MB
------------------------------------------------------------------------------------------------------------

docker ps -a
------------------------------------------------------------------------------------------------------------
CONTAINER ID   IMAGE          COMMAND      CREATED          STATUS                       PORTS     NAMES
918d193c8d90   52199afd43c7   "/bin/zsh"   50 minutes ago   Up 50 minutes                          Ethereum
------------------------------------------------------------------------------------------------------------
```

**一、查看镜像信息**：`docker inspect <image_id>`

```shell
docker inspect 52199afd43c7
"RootFS": {
            "Type": "layers",
            "Layers": [
                "sha256:350f36b271dee3d47478fbcd72b98fed5bbcc369632f2d115c3cb62d784edaec",
                "sha256:0fbc1855e4122f25bd204ca5360de1012afc1bff6dfbd374611db4a71d33e623"
            ]
},
```

**二、基于容器生成镜像**：`docker commit <container_id> <images_name>:<tag_name>`

| 参数                            | 效果                                                        |
| ------------------------------- | ----------------------------------------------------------- |
|-a|作者信息|
|-m|注释信息|
|-p|提交时暂停容器运行|
|-c|提交时执行 Dockerfile 指令|

```shell
# 源镜像是一个ubuntu镜像，基于该镜像的容器又安装了go语言等内容。在此保存一个镜像。
docker commit 918d193c8d90 ubuntu-go:latest

docker images
--------------------------------------------------------------------
REPOSITORY           TAG       IMAGE ID       CREATED         SIZE
ubuntu-go            latest    4e63f5675a43   7 minutes ago   2.2GB
happytsing/ubuntu    latest    52199afd43c7   2 hours ago     813MB
--------------------------------------------------------------------

docker inspect 4e63f5675a43
"RootFS": {
            "Type": "layers",
            "Layers": [
                "sha256:350f36b271dee3d47478fbcd72b98fed5bbcc369632f2d115c3cb62d784edaec",
                "sha256:0fbc1855e4122f25bd204ca5360de1012afc1bff6dfbd374611db4a71d33e623",
                "sha256:9637643a394e6c9dbee2236798898cad7def58fc18bc8d87f13d6eedeec78d45"  # 容器层
            ]
},
```

Docker 镜像都是只读的，当容器启动时，一个新的可写层被加载到镜像的顶部，该层称为容器层。

![docker commit 容器层 镜像层](https://github.com/WlqFigureBed/FigureBed-one/raw/master/img/20201124104727.png)


!!! warning

	`docker commit` 命令除了学习之外，还有一些特殊的应用场合，比如被入侵后保存现场等。

	但是，**不要使用 `docker commit` 定制镜像**，定制镜像应该使用 Dockerfile 来完成。

## 基于 Dockerfile

> 2021.10.12 更新

### 重要命令

[Dockerfile 命令](https://yeasy.gitbook.io/docker_practice/image/dockerfile/label)

**FROM 指定基础镜像**

所谓定制镜像，那一定是以一个镜像为基础，在其上进行定制，FROM 命令正是起到这个作用，因此一个 Dockerfile 中 FROM 是必备的指令，并且**FROM 必须是第一条指令**。

Docker 还存在一个特殊的镜像，名为 scratch。这个镜像是虚拟的概念，并不实际存在，它表示一个空白的镜像。

```dockerfile
FROM ubuntu:latest
```

**Label 添加元数据**

一般用来申明镜像的作者、文档地址等

```Dockerfile
LABEL All_rights_reserved="wangleqing.00@qq.com"
```

使用 docker inspect 查看容器或镜像信息时，可以看到：

![labels](https://github.com/WlqFigureBed/FigureBed-one/raw/master/img/202110131651399.png)

**RUN 执行命令**

用来执行命令行命令的，其格式有两种：

- shell 格式：`RUN <命令>`，就像直接在命令行中输入的命令一样
- exec 格式：`RUN ["可执行文件", "参数1", "参数2"]`，这更像是函数调用中的格式。

在 Dockerfile 中，每一个指令就会建立一层，RUN 也不例外，因此我们尽量一次 RUN 指令执行完所有命令，使用 `&&` 或者 `;` 分隔命令，且支持行尾添加`\`来实现换行。

PS: 在学习官方的 DockerFile 中发现使用的`;`的居多。

**CMD 容器启动命令**

```dockerfile
CMD <命令>
CMD ["可执行文件", "参数1", "参数2"...] # 推荐使用，注意必须是双引号
CMD ["参数1", "参数2"...] # 在指定了 ENTRYPOINT 指令后，用 CMD 指定具体的参数。
```

已知 Docker 不是虚拟机，容器就是进程。既然是进程，那么在启动容器的时候，需要指定所运行的程序及参数。

`CMD` 指令就是用于指定默认的容器主进程的启动命令的。

**ENTRYPOINT 入口点**

```dockerfile
ENTRYPOINT ["/bin/zsh"]
```

如果不设置该句，则使用命令：`docker run -it <镜像id>`时，默认为 bash 进入，设置后则为/bin/zsh

`ENTRYPOINT` 的目的和 `CMD` 一样，都是在指定容器启动程序及参数。

当指定了 `ENTRYPOINT` 后，`CMD` 的含义就发生了改变，不再是直接的运行其命令，而是将 `CMD` 的内容作为参数传给 `ENTRYPOINT` 指令，换句话说实际执行时，将变为：

```dockerfile
<ENTRYPOINT> "<CMD>"
```

**SHELL 指定 shell**

```dockerfile
SHELL ["executable", "parameters"]
```

`SHELL` 指令可以指定 `RUN` `ENTRYPOINT` `CMD` 指令的 shell，Linux 中默认为 `["/bin/sh", "-c"]`

!!! note

	`-c` 参数允许将字符串当做指令执行：`/bin/sh -c "ls"`，但 `/bin/sh "ls"` 会报错。

**COPY/ADD 复制文件**

**① COPY**

```dockerfile
COPY [--chown=<user>:<group>] <源路径>... <目标路径>
COPY [--chown=<user>:<group>] ["<源路径1>",... "<目标路径>"]

# example
COPY package.json /usr/src/app/
```

与 RUN 类似，有两种格式。

加上 `--chown=<user>:<group>` 选项来改变文件的所属用户及所属组。

**② ADD**

ADD 的 `<源路径>` 可以是一个 `URL`，此外，如果 `<源路径>` 为一个 `tar` 压缩文件的话，压缩格式为 `gzip`, `bzip2` 以及 `xz` 的情况下，`ADD` 指令将会自动解压缩这个压缩文件到 `<目标路径>` 去。

因此，如果不希望解压缩的话，不要使用 ADD。

**ENV 设置环境变量**

```dockerfile
ENV <key> <value>
ENV <key1>=<value1> <key2>=<value2>...
```

ENV 设置的环境变量，可在后续命令中使用，node 的官方 dockerfile：

```dockerfile
ENV NODE_VERSION 7.2.0
RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz"
```

**VOLUME 定义匿名卷**

!!! tip

	[Dockerfile 最佳实践](https://yeasy.gitbook.io/docker_practice/appendix/best_practices)：`VOLUME` 指令用于暴露任何数据库存储文件，配置文件，或容器创建的文件和目录。强烈建议使用 `VOLUME` 来管理镜像中的可变部分和用户可以改变的部分。

todo

**WORKDIR 指定工作目录**

使用 `WORKDIR` 指令可以来指定工作目录（或者称为当前目录），以后各层的当前目录就被改为指定的目录，如该目录不存在，`WORKDIR` 会帮你建立目录。

如果你的 `WORKDIR` 指令使用的相对路径，那么所切换的路径与之前的 `WORKDIR` 有关：

```dockerfile
WORKDIR /a
WORKDIR b
WORKDIR c
RUN pwd
```

`RUN pwd` 的工作目录为 `/a/b/c`。

为了清晰性和可靠性，你应该总是在 `WORKDIR` 中使用绝对路径。

### ubuntu

本 Dockerfile 指在构建一个易用的 ubuntu：

- 换源
- zsh 及其插件 zsh-syntax-highlighting、zsh-autosuggestions、autojump
- oh-my-zsh 及其主题 powerlevel10k
- vim、vimplus
- bat 代替 cat
- 时区

同时，完成了所有配置文件的修改，是一个开箱即用的 ubuntu 镜像。

#### 一、拆分步骤版

拆分步骤版便于调试使用，由于缓存的存在，可以高效的定位到错误步骤。

```dockerfile
FROM ubuntu:18.04
LABEL All_rights_reserved="wangleqing.00@qq.com"

# 换源
RUN sed -i 's/ports.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list

RUN apt update -y && apt upgrade -y
RUN apt install -y sudo
RUN apt install -y vim
RUN apt install -y zsh
RUN apt install -y git
RUN apt install -y autojump
RUN apt install -y curl
#RUN apt install -y bat  #在20.04版本，通过apt安装的bat，命令为batcat，因此需要添加alias。

# 该软件提供了所用 apt 存储库的抽象。它使您可以轻松管理您的发行版和独立软件供应商软件源。
RUN apt install -y software-properties-common

# OH-MY-ZSH、插件：zsh-syntax-highlighting、zsh-autosuggestions、主题：powerlevel10k
RUN yes|sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" \
	&& git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting \
	&& git clone git://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions \
	&& git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

#配置.zshrc文件
RUN cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
RUN sed -i '/ZSH_THEME="/ c ZSH_THEME="powerlevel10k/powerlevel10k"' ~/.zshrc
RUN sed -i '/plugins=(git)/ c plugins=(git autojump zsh-syntax-highlighting zsh-autosuggestions sudo extract)' ~/.zshrc
RUN sed -i '$a bindkey '"'"'`'"'"' autosuggest-accept' ~/.zshrc

# RUN sed -i '$a alias bat=batcat' ~/.zshrc

# 设置时区
RUN export DEBIAN_FRONTEND=noninteractive && apt install -y tzdata && ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 设置vim
RUN git clone --depth=1 https://github.com/amix/vimrc.git ~/.vim_runtime
RUN sh ~/.vim_runtime/install_awesome_vimrc.sh

# 精简镜像
RUN export SUDO_FORCE_REMOVE=yes \
	&& sudo apt autoremove -y \
	&& sudo apt clean -y \
	&& rm -rf /var/lib/apt/lists/*

# 设置入口
ENTRYPOINT ["/bin/zsh"]
```

#### 二、合并步骤版

该版本用于最终生成镜像，可以精简镜像大小。

```dockerfile
FROM ubuntu:18.04
LABEL All_rights_reserved="wangleqing.00@qq.com"
RUN set -x; buildDeps='sudo vim zsh git autojump curl tzdata' \
		&& sed -i 's/ports.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list \
		&& export DEBIAN_FRONTEND=noninteractive \
    && export SUDO_FORCE_REMOVE=yes \
		&& apt-get update -y \
		&& apt-get upgrade -y \
		&& apt install -y software-properties-common \
		&& apt-get install -y $buildDeps \
		&& ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
		&& yes|sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" \
		&& git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting \
		&& git clone git://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions \
		&& git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k \
		&& cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc \
		&& sed -i '/ZSH_THEME="/ c ZSH_THEME="powerlevel10k/powerlevel10k"' ~/.zshrc \
		&& sed -i '/plugins=(git)/ c plugins=(git autojump zsh-syntax-highlighting zsh-autosuggestions sudo extract)' ~/.zshrc \
		&& sed -i '$a bindkey '"'"'`'"'"' autosuggest-accept' ~/.zshrc \
		#&& sed -i '$a alias bat=batcat' ~/.zshrc \
		&& git clone --depth=1 https://github.com/amix/vimrc.git ~/.vim_runtime \
		&& sh ~/.vim_runtime/install_awesome_vimrc.sh \
		&& sudo apt autoremove -y \
		&& sudo apt clean -y \
		&& rm -rf /var/lib/apt/lists/*
ENTRYPOINT ["/bin/zsh"]
```

Tips: 其他最小化层数无非就是把构建项目的整个步骤弄成一条 RUN 指令不过多条命令合并可以使用 && 或者 `;`

在学习官方的 DockerFile 中发现使用的`;`的居多。

```dockerfile
RUN set -x; \
		buildDeps='sudo vim zsh git autojump curl tzdata' ;\
		sed -i 's/ports.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list ;\
		export DEBIAN_FRONTEND=noninteractive ;\
		...
```

> [Dockerfile - Mysql](https://github.com/docker-library/mysql/blob/1bfa4724fe112b4246672ed2b3c42142f17d5636/8.0/Dockerfile.debian)

此外，`set -eux` 常出现在头部，其作用为：

- -e 　若指令传回值不等于 0，则立即退出 shell。
- -u 　当执行时使用到未定义过的变量，则显示错误信息。
- -x 　执行指令后，会先显示该指令及所下的参数。

### Dockerfile 文件讲解

**参数说明：**

- `ln -fs`：强制添加软连接
- `yes|./install.sh`：运行./install.sh 脚本，并且每个选项都自动选择 yes
- `apt install -y`：安装，并且跳出的选项选择 yes
- `DEBIAN_FRONTEND="noninteractive"`：修改安装参数，为自动化安装。注意，不要直接修改 ENV，而是在 RUN 命令中临时使用。开启这个后在安装 tzdata 时才不用手动选择。
- `SUDO_FORCE_REMOVE=yes`：强制删除

**时区设置**

`tzdata`，默认为 UTC，将其修改为 CST，可使用`date`命令查看：

- CST：中国标准时间

- UTC：世界标准时间，CST = UTC + 8
- GMT：格林尼治标准时间

**sed：利用脚本指令编辑文本文件**

- `-i`：表示应用修改，不加-i 不会真的修改文件
- `c`：匹配（或者行数），并替换
- `$a`：正则表达式，匹配最后一行($)，并且追加内容(a)
- **参考：**
  - [简单教程-sed](https://www.twle.cn/c/yufei/sed/sed-basic-change-command.html)
  - [bash - 用 sed 插入单引号](https://www.coder.work/article/2571729)
  - [sed linux 命令 在线中文手册](http://linux.51yip.com/search/sed)

### Dockerfile 文件使用

[docker build 命令参数](https://www.runoob.com/docker/docker-build-command.html)

| 参数       | 作用                                                                                           |
| ---------- | ---------------------------------------------------------------------------------------------- |
| -f         | 指定使用的 dockerfile 路径，默认为当前目录。`docker build -f /path/to/Dockerfile .`            |
| --no-cache | 创建镜像的过程中不使用缓存。如果有缓存，在第二次生成镜像时，无需重新进行下载等操作。默认有缓存 |
| -q         | 安静模式，成功后只输出镜像 ID                                                                  |
| --squash   | 将 Dockerfile 中所有的操作压缩为一层                                                           |
| -t         | 镜像的名字及标签，通常 name:tag 或者 name 格式；可以在一次构建中为一个镜像设置多个标签         |

**一、构建镜像**

```shell
#1. 创建一个文件夹，如果用到ADD等命令，将文件放在该文件夹下
mkdir Dockerfile

#2. 创建并编辑Dockerfile文件，将上述脚本粘贴即可
vim Dockerfile

#3. 在Dockerfile文件夹下运行以下命令构建镜像
docker build -t ubuntu:v5 .

#4. 查看镜像
docker images

--------------------------------------------------------------------
REPOSITORY   TAG             IMAGE ID       CREATED             SIZE
ubuntu       v4              ccc494e4188d   26 minutes ago      771MB
--------------------------------------------------------------------
```

在`docker build -t ubuntu:v5 .`指令的末尾有一个`.`，它是指上下文路径，此处使用`.`表示当前目录。

docker 在构建镜像时，有时候想要使用本机的文件（比如复制），如果未说明，则默认上下文路径就是 Dockerfile 文件所在的位置。

**何时使用上下文路径**：Dockerfile 中还存在`COPY`、`ADD`等指令，会用到该路径。

**二、创建容器**

```shell
docker run -it --name "ubuntu" ccc494e4188d
# 由于Dockerfile中设置了ENTRYPOINT ["/bin/zsh"]，因此会直接以/bin/zsh打开，否则以/bin/bash打开。

# ctrl + d 退出容器时，容器会自动关闭。

# 启动容器
docker start ccc494e4188d

docker run -itd --name "ubuntu" ccc494e4188d
# 此时不会直接进入容器，容器处于运行状态，但是由于参数-d的存在，在后台运行
# 注意，如果此处不使用-it，而是只使用-d，则容器永远无法启动。

# 进入容器
docker exec -it ubuntu /bin/zsh
```

**参考：**

- [Docker 镜像安装配置 zsh](https://lisz.me/tech/docker/docker-zsh.html)
- [Docker—从入门到实践](https://yeasy.gitbook.io/docker_practice/image/build)

## 上传镜像

① 进入 Docker Hub，注册账号(docker id：happytsing)

② 给镜像打标签

```shell
docker images

------------------------------------------------------------------------
REPOSITORY          TAG             IMAGE ID       CREATED        SIZE
ubuntu              v5              01187e1edca1   15 hours ago   771MB
------------------------------------------------------------------------

docker tag ubuntu:v1 happytsing/ubuntu:20.04c

------------------------------------------------------------------------
REPOSITORY          TAG             IMAGE ID       CREATED        SIZE
happytsing/ubuntu   20.04c          01187e1edca1   15 hours ago   771MB
------------------------------------------------------------------------
```

③ 上传镜像

```shell
docker push happytsing/ubuntu:20.04c
```

上述镜像已经上传，有需要可以[自取](https://hub.docker.com/r/happytsing/ubuntu)：

```shell
docker pull happytsing/ubuntu:20.04c
```

