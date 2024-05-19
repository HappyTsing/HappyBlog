# 图床：Picgo + Typora + OSS

## 一、Github + Picgo

### 1.1 Github

首先构建一个仓库 FigureBed-one，随后获取[tokens](https://github.com/settings/tokens)

![Tokens-1](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/picgo/20200722121343.png)

![Tokens-2](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/picgo/20200722121356.png)
只需要勾选 repo 即可！

### 1.2 Picgo

![Github-picgo](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/picgo/20210710143025.png)

假设github 图片链接为：`https://github.com/WlqFigureBed/FigureBed-one/raw/master/img/20210710143025.png`

设置自定义域名： `https://github.com/WlqFigureBed/FigureBed-one/raw/master`

- WlqFigureBed 为用户名
- FigureBed-one 为仓库名
- **raw：用于代替 blob，否则无法正常显示！**
- master 分支名，此处写主分支即可
- 20200710132336 是时间戳命名的图片名

设定 Token：你可以从 [这里](https://github.com/settings/tokens) 获取 Github Token

**最好开启时间戳重命名：**

![时间戳重命名](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/picgo/20200722121435.png)

### 1.3 上传失败怎么办？

#### 1.3.1 检查 server 的端口是否正确

![设置server](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/picgo/20210710143428.png)

![设置server](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/picgo/20210710143426.png)

**如果不行，可以先关闭 Server，保存后再打开 Server 试试看。**

#### 1.3.2 设置代理

如果是由于被墙导致的请求超时，可通过设置代理解决：

![请求超时](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/picgo/202112021644114.png)

代理的端口可以从科学上网的工具获得，设置即可：

![设置代理和镜像地址](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/picgo/202112021640030.png)

## 二、阿里云 OSS + picgo（推荐）

Github + picgo 的方法可行，但是国内无法访问 Github，且 Gitee 引入开源审核后，无法公开图床仓库，因此无法作为 Github 的替代品。相比之下，阿里云 OSS 在付出少量金钱的前提下可以提供更好的服务，且可以上传文件。

### 2.1 阿里云 OSS

- [创建 bucket](https://oss.console.aliyun.com/bucket)：happytsing-figure-bed
- 配置用户和权限

![权限](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/picgo/权限.png)

然后创建新用户，用户登录名称 happytsing@17215\*\*112358346.onaliyun.com：

- AccessKey ID：LTAI5t7S\*\*yWJ9Yx7UR4VtYP
- AccessKey Secret：VTtibo\*\*ESVGdtGacHC1q9dCT1G8BY

进入用户管理页面，为其添加 OSS 权限。

**自定义域名**

目前已经可以通过阿里云的域名访问图片，如果想使用自己的域名的话，需要进入[传输管理](https://oss.console.aliyun.com/bucket/oss-cn-hangzhou/happytsing-figure-bed/transfer)，绑定自己的域名，但需要该域名已经备案。

### 2.2 Picgo

![picgo_config](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/picgo/picgo_config.png)

此处将指定存储路径`img/`修改为当前 markdown 的英文名，来对图片进行分类，如 git 笔记相关就将图片存放到`git/`目录下。

### 2.3 ossbrowser upload file

创建新的 bucket：happytsing-file-bed

安装并登录[ossbrowser](https://help.aliyun.com/document_detail/209974.html?spm=5176.8465980.toolkit.4.4e701450BNoqNV)，AccessKey 信息同上。

在 ossbrowser 中可以直接上传文件，此处上传 pdf 主要是为了后续在笔记中直接贴链接。

同样的，为当前 markdown 文件引用的文件放在同一个文件夹下。

## 三、Typora

使用 Typora 可以自动上传图片，简单设置如下：

![typora](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/picgo/20200722121415.png)

Congratulations and enjoy!
