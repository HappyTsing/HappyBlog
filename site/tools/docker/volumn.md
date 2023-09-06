# 数据管理

![docker数据管理](https://github.com/WlqFigureBed/FigureBed-one/raw/master/img/202110131622180.png)

在容器中管理数据主要有两种方式：

- 数据卷（Volumes）
  - 数据卷容器
- 挂载主机目录 (Bind mounts)

## 挂载数据卷

**一、创建、查看、详情、删除**

```bash
docker volume create <volume_name>

docker volume ls

docker volume inspect <volume_name>

docker volume rm <volume_name>

# 无主的数据卷可能会占据很多空间，使用如下命令清理：
docker volume prune
```

**二、启动一个挂载数据卷的容器**

在用`docker run`命令的时候，使用`--mount`标记来将`数据卷`挂载到容器里。一次`docker run`可以挂载多个`数据卷`。

```bash
#1. 挂载一个已经存在的数据卷
docker run -itd --name "<container_name>" --mount source=<volume_name>,target=/path/to/target <image_id>

#2. 创建并挂载数据卷
docker run -itd --name "<container_name>" -v <volume_name>:/path/to/target <image_id>

# 例
docker run -itd --name "ubuntu" --mount source=my-vol,target=/volume 01187e1edca1
docker run -itd --name "ubuntu_create" -v my-vol2:/volume 01187e1edca1
```

`数据卷`信息在`“mounts”`下

```shell
docker inspect ubuntu

"Mounts": [
    {
    "Type": "volume",
    "Name": "my-vol",
    "Source": "/var/lib/docker/volumes/my-vol/_data",
    "Destination": "/volume",
    "Driver": "local",
    "Mode": "z",
    "RW": true,
    "Propagation": ""
    }
],
```

**三、数据卷容器**

如果用户需要在多个容器之间共享一些持续更新的数据，最简单的方式是使用**数据卷容器**。数据卷容器也是一个容器，但是它的目的是专门用来提供数据卷供其他容器挂载。

```shell
docker run -itd --name "<container_name>" --volumes-from <container_name/id>
```

使用`--volumes-from`可以挂载指定容器的数据卷，可以多次使用`--volumes-from`参数来从多个容器挂载多个数据卷。

本质上来说，都是挂载数据卷罢了。

**TODO：利用数据卷容器来备份、回复、迁移数据卷**

## 挂载本地主机

**一、挂载本地主机目录**

指定`type=bind`可以挂载本地主机的目录到容器中去，本地目录必须是已经**存在的绝对路径**。

```shell
docker run -itd --name "<container_name>" --mount type=bind,source=/path/to/local,target=/path/to/target <image_id>

# 例 $HOME = /Users/happytsing
docker run -itd --name "ubuntu_bind" --mount type=bind,source=$HOME/Desktop,target=/volume 01187e1edca1
```

Update: [通过 -v 挂载](https://docs.docker.com/engine/reference/commandline/run/#volume)

```sh
docker run -v /mac:/docker -w /docker -it ubuntu bash
docker run  -v `pwd`:`pwd` -w `pwd` -it  ubuntu pwd
```

本地目录的路径必须是绝对路径，以前使用 `-v` 参数时如果本地目录不存在 Docker 会自动为你创建一个文件夹，使用 `--mount` 参数时如果本地目录不存在，docker 会报错。

`-w` 用于指定容器内的工作目录。

查看数据卷信息：

```shell
docker inspect ubuntu_bind

"Mounts": [
    {
    "Type": "bind",
    "Source": "/Users/happytsing/Desktop",
    "Destination": "/volume",
    "Mode": "",
    "RW": true,
    "Propagation": "rprivate"
    }
],
```

**二、挂载本地主机文件**

```shell
docker run -itd --name "<container_name>" --mount type=bind,source=/path/to/local_file,target=/path/to/target_file <image_id>

# Example
docker run -itd --name "ubuntu_bind_file" --mount type=bind,source=$HOME/.zshrc,target=/root/.zshrc 01187e1edca1
```

# Docker Compose

Compose 是用于定义和 **运行多容器** Docker 应用程序的工具。通过 Compose，使用 YML 文件来配置应用程序需要的所有服务。

然后，使用一个命令，就可以从 YML 文件配置中创建并启动所有服务。
