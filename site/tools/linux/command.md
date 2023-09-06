# Linux 实用命令

## 查看系统信息

```bash
uname -a
cat /etc/issue
lsb_release -a

# 查看当前文件夹的大小
du -sh
# 查看当前文件夹下每个子文件夹分别多大
du -h --max-depth=1

# 以人类能看懂的单位显示文件大小
ls -lh

# 查看cpu
lscpu

# 查看内存硬件
dmidecode -t memory

# 查看内存使用情况
free -g
htop
top

# 查看进程
ps -ef | grep <xxx>
```

## wget：下载文件

```bash
wget -c http://https://github.com/xxx/example/v1.whl
```

参数：

- O：将文件下载到指定目录中
- c：断点续传，如果下载中断，那么连接恢复时会从上次断点开始下载

## tar：解压缩

| 参数 | 解释                                                                               |
| ---- | ---------------------------------------------------------------------------------- |
| z    | 通过 gzip 支持的压缩或解压缩。还有其他的压缩或解压缩方式，比如 j 表示 bzip2 的方式 |
| x    | 解压缩                                                                             |
| v    | 在压缩或解压缩过程中显示正在处理的文件名                                           |
| f    | f 后面必须跟上要处理的文件名                                                       |

## ssh：远程连接

### 基础使用

```bash
ssh -p <port> user@ip
# ssh root@47.108.147.2
```

### 免密登录

```shell title="1. 查看是否存在秘钥，若存在，则跳过下面的步骤"
ls -al ~/.ssh
```

```shell title="2. 创建秘钥对，复制公钥"
ssh-keygen -t ed25519 -C "your_email@example.com"
# 注：如果您使用的是不支持 Ed25519 算法的旧系统，请使用以下命令：
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
# 回车三次

cd ~/.ssh
cat id_ed25519.pub # 复制
```

```shell title="3. 登录远程主机，并粘贴公钥至 ~/.ssh/authorized_keys"
ssh ubuntu@101.43.55.140
vim ~/.ssh/authorized_keys # 粘贴
```

### 配置远程主机名称

通过配置 `~/.ssh/config` 文件，可以实现通过主机名来连接远程主机，配置如下：

```
Host CustomName
  HostName 1.2.3.4
  User HappyTsing
  Port 22
```

此后可以通过 `ssh CustomName` 来直接进行 ssh 连接，而不用输入 `user@ip` 的形式，更加好用。

### 跳板机

ssh 可以通过 `ProxyCommand` 和 `ProxyJump` 来实现通过跳板机远程连接，二者不可同时配置，`ProxyCommand` 是更古老的协议，推荐使用更安全的 `ProxyJump`。

通过配置 `~/.ssh/config` 或者 `/etc/ssh/ssh_config` 来实现跳板机，首先介绍 `ProxyCommand` 的方法：

```

Host jumpbox
HostName 192.168.1.112
User wangleqing

Host target_server
HostName 192.168.2.157
User happytsing
Port 22
ProxyCommand ssh -W %h:%p jumpbox

```

`%h` 和 `%s` 用于动态的获取 `HostName` 和 `Port`，当然也可以写死。`-W` 是为了实现 nc 命令建立连接。

更推荐采用 `ProxyJump` 的方式进行跳转：

- `ssh -J jumpbox@host:port target@host -p port` 注意可以无限嵌套
- 通过配置文件：

  ```
  Host jumpbox
  HostName 192.168.1.112
  User wangleqing

  Host target_server
  HostName 192.168.2.157
  User happytsing
  Port 22
  ProxyJump jumpbox

  ```

配置完毕后，通过 `ssh target_server` 即可直接通过跳板机登录。

此外，可以通过 `-v` 参数打印调试信息

## scp：上传/下载文件

```bash
# 1. 上传
scp  /path/filename  username@serverIp:/path

# 2. 下载
scp ubuntu@101.43.55.140:/path/filename   ~/local_dir（本地目录）
```
