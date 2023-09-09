# 科学上网

!!! note

    本笔记用于无图形化界面的情况下，通过 Clash 实现科学上网

**1. 查看是否已经翻墙**

```shell
curl -v https://www.google.com
```

**2. 下载安装 Clash**

```shell
cd ~ && mkdir clash && cd clash
wget https://github.com/Dreamacro/clash/releases/download/v1.8.0/clash-linux-amd64-v1.8.0.gz
gzip -d clash-linux-amd64-v1.8.0.gz
mv clash-linux-amd64-v1.8.0 clash  # 重命名为clash
chmod +x clash
```

**3. 配置 `config.yaml`**

```shell
cd ~/clash
vim config.yaml # 配置文件请自行获取
```

此时 `~/clash` 文件夹下有两个文件：

- 可执行文件：clash
- 配置文件：config.yaml

**4. 运行 clash：使用 `-d` 指定配置所在的文件夹，本次指定为当前文件夹 `~/clash`**

```shell
cd ~/clash && ./clash -d .
```

此时会多出两个文件：

- 缓存文件：cache.db
- Country.mmdb

!!! tip "若存在网络问题，可直接下载 Country.mmdb"

    ```shell
    wget -O Country.mmdb https://cdn.jsdelivr.net/gh/Dreamacro/maxmind-geoip@release/Country.mmdb
    ```

**5. 启动命令行代理**

```shell
export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
```

!!! note

    通过在终端运行上述命令，可临时修改，重启终端即失效

    如果需要永久修改，可将其写入配置文件`~/.zshrc`中，但不推荐。

此时，已经可以正常使用，但为了精益求精，接下来需要解决两个问题：

- [如何开机默认启动？](https://github.com/Dreamacro/clash/wiki/clash-as-a-daemon)
- [如何切换代理？](https://clash.gitbook.io/doc/restful-api/proxies)默认使用的是 `config.yaml → first of proxies`

**6. 开机默认启动：clash as a daemon**

移动文件 `~/clash` 中的文件到指定位置：

```shell
cd ~/clash
sudo mkdir /etc/clash/
sudo cp clash /usr/local/bin
sudo cp config.yaml /etc/clash/
sudo cp Country.mmdb /etc/clash/

# 清理无用文件
rm -rf ~/clash
```

Create the systemd configuration file at `/etc/systemd/system/clash.service`：

```shell
sudo vim /etc/systemd/system/clash.service
[Unit]
Description=Clash daemon, A rule-based proxy in Go.
After=network.target

[Service]
Type=simple
Restart=always
ExecStart=/usr/local/bin/clash -d /etc/clash

[Install]
WantedBy=multi-user.target
```

设置在系统启动时启动 clash：

```shell
sudo systemctl enable clash
```

立即启动、重启 clash：

```shell
sudo systemctl start clash
sudo systemctl restart clash
```

使用以下命令检查 Clash 的运行状态和日志：

```shell
systemctl status clash
journalctl -xe
```

**7. 切换代理：RESTful API**

> 网页：[http://clash.razord.top/#/proxies](http://clash.razord.top/#/proxies)

首先，检查并编辑 `/etc/clash/config.yaml`

```shell
# 监听在 127.0.0.1 的 9090 端口
external-controller = 127.0.0.1:9090

# 你可以加入 secret 进行 API 鉴权
secret = 081008
# 鉴权的方式为在 Http Header 中加入 Authorization: Bearer ${secret}
curl -H "Authorization: Bearer 081008"

# 如有修改，重启：
systemctl restart clash
```

!!! warning

    此处为了使用方便，我们不设置 secret，但如果想要保证安全性，还是推荐设置一下。

如下 `/etc/clash/config.yaml`中的部分设置所示， Proxy 中记录了可选择的服务器列表：

```yaml
- name: Proxy
  type: select
  proxies:
    - "台湾TW"
    - "新加坡SG"
```

如果我们也可以通过 API 知道 Proxy 中可选哪几个服务器，以及目前正选择的是那个服务器：

```shell
curl -i -X GET  http://127.0.0.1:9090/proxies/Proxy
```

如果要选择其他服务器：

```shell
curl -X PUT http://127.0.0.1:9090/proxies/Proxy --data "{\"name\":\"新加坡SG\"}"
```

!!! tip

    可以通过直接将 mac 上选择好的配置 config.yaml 直接复制到对应的 linux 的 clash 的配置文件处，重新启动即可。

**8. 配置 ubuntu 网络代理**

依次点击：设置-网络-网络代理

选择手动（manual）

HTTP 代理：127.0.0.1:7890

Socks 主机：127.0.0.1:7891
