# Manjaro 系统 Rtl8821ce 无线网卡连接 Wifi

## 零、背景

在笔记本安装 Manjaro 系统安装后搜索不到 WIFI，排查可知，问题是由于内核不支持 rtl8821ce 无线网卡，因此我们需要安装一个**第三方的无线网卡驱动**来实现在 Manjaro 系统上使用 WIFI。

## 一、前置准备

First of all，F2 进入 bios，进入 secure boot，关闭安全启动和快速启动。

Then，需要一个有线网，可以用 usb 手机连接电脑，然后在个人热点中开启 USB 网络共享，如果无法连接，请检查有线网卡及其驱动是否正确安装以及型号是否对应，不细说了。

接下来解决 wifi 问题，**因为这个，我重装了十几次系统，甚至半夜三点睡不着，四点气不过又起来查攻略，结果也没弄出来，九点多去上班，感觉心脏跳不动了只有字节在跳动！**

特此记录：2021.03.27 凌晨 4 点的 peking~

### ① 查看系统内核：`uname -a`

```shell
[leqing@leqing-book ~]$ uname -a
Linux leqing-book 5.4.105-1-MANJARO #1 SMP PREEMPT Thu Mar 11 18:27:58 UTC 2021 x86_64 GNU/Linux
# 可以看到系统内核已经是5.4版本，原本是5.9，但是5.9版本对RTL8821CE支持很差，因此需要修改为5.4
```

### ② 查看网卡信息

`lspci -k`

```shell
[leqing@leqing-book ~]$ lspci -k
03:00.0 Network controller: Realtek Semiconductor Co., Ltd. RTL8821CE 802.11ac PCIe Wireless Network Adapter
       Subsystem: AzureWave Device 3041
       Kernel driver in use: rtl8821ce
       Kernel modules: 8821ce
04:00.0 Ethernet controller: Realtek Semiconductor Co., Ltd. RTL8111/8168/8411 PCI Express Gigabit Ethernet Controller (rev 15)
       Subsystem: ASUSTeK Computer Inc. Device 208f
       Kernel driver in use: r8169
       Kernel modules: r8169
# 第一条数据wireless Network，也即是无线网卡型号是RTL8821CE，driver也是rtl8821ce，本教程就是为了挂载上这个驱动！
# 第二条数据是有线网卡，可以看到驱动和网卡型号不对应，但是能用，不知道为啥。
```

or `inxi -Fxxxza --no-host`

```shell
[leqing@leqing-book ~]$ inxi -Fxxxza --no-host

Network:  Device-1: Realtek RTL8821CE 802.11ac PCIe Wireless Network Adapter vendor: AzureWave driver: rtl8821ce v: N/A
          modules: 8821ce port: 4000 bus-ID: 03:00.0 chip-ID: 10ec:c821 class-ID: 0280
          IF: wlp3s0 state: up mac: <filter>
          Device-2: Realtek RTL8111/8168/8411 PCI Express Gigabit Ethernet vendor: ASUSTeK driver: r8169 v: kernel port: 3000
          bus-ID: 04:00.0 chip-ID: 10ec:8168 class-ID: 0200
          IF: enp4s0 state: down mac: <filter>
          IF-ID-1: enp0s20f0u3 state: unknown speed: N/A duplex: N/A mac: <filter>
# 蓝牙
Bluetooth: Device-1: IMC Networks Bluetooth Radio type: USB driver: btusb v: 0.8 bus-ID: 1-14:5 chip-ID: 13d3:3530
          class-ID: e001 serial: <filter>
          Report: This feature requires one of these tools: hciconfig/bt-adapter
          Device-2: Xiaomi Mi/Redmi series (RNDIS) type: USB driver: rndis_host v: kernel bus-ID: 1-3:6 chip-ID: 2717:ff80
          class-ID: 0a00 serial: <filter>
```

### ③ 下载源设置

```shell
# 换国内镜像源：
sudo pacman-mirrors -i -c China -m rank
# 设置archlinuxcn源，这个是必须的，否则rtl8821ce-dkms-git无法完全下载
sudo nano /etc/pacman.conf
# 在文件末尾添加以下内容
[archlinuxcn]
SigLevel = Optional TrustedOnly
Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch

# ctrl x退出，y确定保存

# 更新源列表
sudo pacman-mirrors -g
```

更新系统：`sudo pacman -Syyu`

## 二、内核下载

内核下载：命令行方法见参考链接

也可以在`设置-内核`中选择所需版本

重启进入 grub，选择内核 5.4，因为 5.9 会有问题（可能加入 blacklist 后可以解决，没尝试）！

## 三、grub 设置

change kernel need **grub**：

```shell
sudo pacman -S grub # 安装grub
sudo nano /etc/default/grub

# 为了让开机的时候进入grub界面，修改 GRUB_TIMEOUT_STYLE=hidden为如下内容：
GRUB_TIMEOUT_STYLE=menu

# 在 GRUB_CMDLINE_LINUX_DEFAULT的末尾加上pci=noaer
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash pci=noaer"
# 注意，pci=noaer前面的内容是因人而异的，不要动它！添加在末尾即可！
# 原因：Your distribution may come with PCIe Active State Power Management enabled by default. That may conflict with this driver

# 保存配置
sudo update-grub

# 重启
reboot
```

## 四、无线网卡驱动下载

下载匹配 linux 内核版本的 headers：

`sudo pacman -S dkms linuxXX-headers`

此处的 XX 用自己的内核版本更换，如内核版本 5.4，则 linux54-headers

`sudo pacman -S pamac-cli` 不知道有没有用，但还是安装一下！

`pamac build rtl8821ce-dkms-git`

关机，完全切断电源！再开机！一定要完全关机！

开机：挂载驱动，非常非常非常重要！

`sudo modprobe 8821ce`

`lsmod`查看是否加载内核模块`lsmod | grep 8821ce`

> 有时必须重新编译 dkms 软件包（万一发生错误（pacman 更新），通常是内核更新），
> 如果出现任何错误，只需再次运行 dkms 软件包
>
> `pamac update -a`（所有 AUR 更新）
> 或
> `pamac build rtl8821ce-dkms-git`（新的 rtl8821AUR 内部版本）

## 五、不确定有没有用的设置

### ① 确定 wifi 未被 blocked

查看你的 wifi 是否被阻止：`rfkill list all`

```shell
[leqing@leqing-book ~]$ rfkill list all
0: hci0: Bluetooth
       Soft blocked: no
       Hard blocked: no
1: phy0: Wireless LAN
       Soft blocked: no
       Hard blocked: no
```

若存在 yes，解锁：`sudo rfkill unblock all`

### ② 重启 NetworkManager

重启一下，万一行了呢？

```shell
sudo systemctl stop NetworkManager
sudo systemctl start NetworkManager
# or
sudo systemctl restart NetworkManager
```

### ③Windows 大法

有没有想过重新安装 windows 呢？

你说折腾这玩意干啥！淦！

## 六、参考链接

- grub
  - [How to Update GRUB on Arch Linux](https://linuxhint.com/update_grub_arch_linux/)
  - [GRUB Menu Not Showing On Boot, Boots into Default Kernel Instead](https://forum.manjaro.org/t/grub-menu-not-showing-on-boot-boots-into-default-kernel-instead/13410/2)
- 无线驱动安装
  - [Laptop with RTL8821CE not connecting to wifi](https://forum.manjaro.org/t/laptop-with-rtl8821ce-not-connecting-to-wifi/21221)
  - [Realtek WiFi Driver Installation (AUR)](https://archived.forum.manjaro.org/t/realtek-wifi-driver-installation-aur/85429)
  - [rtl8821ce github 仅仅参考问题解决](https://github.com/tomaspinho/rtl8821ce)
- 内核安装
  - [Manjaro Kernels - Manjaro](https://wiki.manjaro.org/index.php/Manjaro_Kernels)
- 下载源设置
  - [Manjaro Linux 更新国内镜像源 - 简书](https://www.jianshu.com/p/966017a6f251)
