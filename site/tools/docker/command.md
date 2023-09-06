# Docker 命令

所有命令可以在官方文档的 [Reference](https://docs.docker.com/reference/)下的 command-line reference 中查看具体使用方法

或直接在命令行中输入：`docker 命令 --help`，快速查看命令的 **格式** 和 **可选项**

查看 docker 占用空间：`docker system df`，会分别显示镜像、容器、数据卷、构建缓存的占用空间

## 镜像命令

### ① 获取镜像

`docker pull NAME[:TAG]`

该命令直接从 dockers hub 镜像源来下载镜像

- NAME 是镜像仓库的名称

- TAG 是镜像的标签：用于标识版本信息，省略时，默认标签为 latest

!!! example

    - docker pull ubuntu:14.04

    - 若不是在 Docker Hub 官方仓库下载，则需要指定镜像源：docker pull hub.c.163.com/pubilc/ubuntu:14.04

### ② 查看镜像信息

`docker images` = `docker image ls`

| 参数 | 效果         |
| ---- | ------------ |
| -a   | 显示详细信息 |

### ③ 添加镜像标签

`docker tag NAME[:TAG] NAME[:TAG]`

!!! example

    docker tag ubuntu:latest myubuntu:latest

### ④ 查看镜像详细信息

`docker inspect NAME[:TAG]`

### ⑤ 查看镜像历史

`docker history NAME[:TAG]`

### ⑥ 搜寻镜像

`docker search NAME[:TAG]`

其作用和直接在 docker hub 上搜索相似！

### ⑦ 删除镜像

`docker rmi ID`

`docker rmi NAME[:TAG]`

### ⑧ 创建镜像

`docker commit -a "作者名" -m "注释" 原镜像id 新镜像id:版本信息tag`

| 参数 | 效果                       |
| ---- | -------------------------- |
| -a   | 作者信息                   |
| -m   | 注释信息                   |
| -p   | 提交时暂停容器运行         |
| -c   | 提交时执行 Dockerfile 指令 |

### ⑨ 提交镜像

`docker push NAME:TAG`

## 容器命令

在此之前，我们首先需要有相应的镜像，容器是镜像的实例！

### 一、创建容器

**① 新建容器**：`docker create 参数 NAME[:TAG]`

该命令参数繁多，一般用到如下

| 参数                            | 效果                                                        |
| ------------------------------- | ----------------------------------------------------------- |
| -d                              | 是否在后台运行容器，默认为否，加上-d 表示在后台运行         |
| -i                              | 保持标准输入打开，默认为否                                  |
| -t                              | 是否分配一个伪终端，默认为否，一般与-i 联合使用，即-it      |
| --name "别名"                   | 指定容器的别名                                              |
| -p 主机端口：容器端口（小写 p） | 外网可以通过主机端口，来访问相应的容器端口                  |
| -P （大写 P）                   | 随机指定端口                                                |
| --rm                            | 容器退出后随之将其删除，测试用，一般使用 docker rm 手动删除 |

!!! tip "--name 的三种具有相同效果的用法"

    - --name=ubuntu
    - --name ubuntu
    - --name "ubuntu"

**② 启动容器**：`docker start 容器id或容器别名`

![查看运行容器](https://github.com/WlqFigureBed/FigureBed-one/raw/master/img/20201124100055.png)

查看运行中容器：`docker ps`

查看所有创建的容器：`docker ps -a`

**③ 新建并启动容器**：`docker run 参数 NAME[:TAG]`

!!! tip "通常使用如下参数"

    - --name：设置别名
    - -d：在后台运行容器
    - -p：主机端口:容器端口的映射
    - -it：输入+终端
    - -v：挂载卷

检查本地是否存在对应镜像，不存在，就从共有仓库 pull 下载

利用镜像 create 创建一个容器，并且 start 启动容器

**④ 退出容器**

退出容器并终止运行：`exit`、`ctrl+d`

退出容器但不终止运行：`ctrl+p+q`

**⑤ 获取容器日志（容器的历史使用输出信息）**：`docker logs 容器id或容器别名`

### 二、终止容器

前文已经提及，可以使用 `docker ps` 查看所有正在运行的容器，而当你使用 `exit` 或 `ctrl+d` 时会退出并终止容器，不过当你使用 `ctrl+p+q` 退出容器时，容器仍旧在后台运行。此外，当你使用 `docker run -d NAME[:TAG]` 后，容器也会在后台继续执行。

!!! example

    docker run -d --name "myubuntu" ubuntu /bin/sh -c "while true;do echo hello world;sleep 1; done"】

创建并运行容器时，容器以守护态（daemonized）在后台运行，因此需要终止命令

**① 终止容器**：`docker stop 容器id或容器别名`

**② 启动处于终止状态的容器**：`docker start 容器id或容器别名`

**③ 将一个运行态的容器先终止，再启动**：`docker restart 容器id或容器别名`

### 三、进入容器

①`docker attach 容器id或容器别名`

该命令无法进入一个未启动的容器！

![进入容器](https://github.com/WlqFigureBed/FigureBed-one/raw/master/img/20201124095948.png)

②`docker exec -it 容器id或容器别名 /bin/bash`

### 四、删除容器

命令：`docker rm 参数 容器id或容器别名`

可用于删除处于终止或退出状态的容器，使用参数-f 可强制删除运行状态的容器

| 参数                            | 效果                                                        |
| ------------------------------- | ----------------------------------------------------------- |
|-f|是否强行终止并删除一个运行中的容器|
|-l|删除容器的链接 link，但保留容器|
|-v|删除容器挂载的数据卷|