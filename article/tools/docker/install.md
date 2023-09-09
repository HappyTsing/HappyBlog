# Docker 简介及安装

## 容器与虚拟机

**一、什么是 Docker**

**Docker** 是世界领先的软件 **容器** 平台

**容器**：容器就是将软件打包成标准化单元，以用于开发、交付和部署。

当使用容器来打包应用、解耦应用和运行平台，意味着迁移的时候，只需要在新的服务器上启动所需要的容器即可，无论新旧服务器是否是同一类型的平台，都不会出错，即 **Docker 容器是对进程进行封装隔离，属于操作系统层面的虚拟化技术。**

**二、容器与虚拟机**

容器和虚拟机具有相似的资源隔离和分配优势，但功能有所不同，因为 **容器虚拟化的是操作系统**，而 **虚拟机虚拟化的是硬件**，因此容器更容易移植，效率也更高。

注：虚拟机和容器可以并存，即一个虚拟操作系统中可以有多个容器。

## 三大核心：镜像、容器、仓库

**一、镜像**

Docker 镜像是一个特殊的 **只读** 文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）

**二、容器**

容器是基于 **镜像** 创建的应用运行 **实例**。容器可以被创建、启动、停止、删除、暂停等。

各个容器之间都是彼此隔离、互不可见的。

可以把容器看做是一个简易版的 Linux 系统。

**三、仓库**

一个 注册服务器（Docker Registry） 中可以包含多个仓库（Repository）：**每一个仓库对应一类镜像**！

每个仓库可以包含多个标签（Tag）：**每个标签对应一个镜像版本**，**标签只标注版本信息，不标识镜像内容！**

镜像仓库是 Docker 用来集中存放镜像文件的地方类似于我们之前常用的代码仓库。

![Registry示意图](https://github.com/WlqFigureBed/FigureBed-one/raw/master/img/20201124095251.png)

## Docker Hub Registry

一个 Registry（注册服务器）可以存放多个 Repository（仓库）

!!! example

    仓库地址：private-docker.com/ubuntu:latest

    - private-docker.com：注册服务器地址

    - ubuntu：仓库名

    - latest：镜像版本

登陆 Docker Hub：docker login

搜索：docker search

拉取：docker pull

## 安装并换源

- 方法一：直接下载 [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- 方法二：linux 平台可安装 [Docker Engine](https://docs.docker.com/engine/install/)

!!! note

    2022 年 5 月推出了 Linux 版本的 Docker Desktop，此前只能通过安装 Docker Engine 来使用，此外推荐安装 **Docker Compose**，用于多容器应用。

为了加快镜像下载速度，首先进行换源，国内的镜像源有

- docker 官方中国区 `https://registry.docker-cn.com`
- 网易 `http://hub-mirror.c.163.com`
- ustc `http://docker.mirrors.ustc.edu.cn`
- 阿里云 `http://<你的ID>.mirror.aliyuncs.com`

!!! note

    - 配置 `registry-mirrors` 务必使用 `http`，而不要用 `https`，否则会显示 `No certs for egitstry.docker.com`
    - 配置 `insecure-registries` 不要任何`http`头，否则失败

- Windows，启动 Docker 图形化界面，如下图修改。

- Mac，类似 Windows，在 Docker Engine 中添加 registry-mirrors 即可

- Linux，编辑`/etc/docker/daemon.json`，修改完重启。

修改完毕后，通过`docker info`查看是否存在 Registry Mirrors。

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn/",
    "http://hub-mirror.c.163.com",
    "https://registry.docker-cn.com"
  ]
}
```

![Windows](https://github.com/WlqFigureBed/FigureBed-one/raw/master/img/20201124104257.png)


