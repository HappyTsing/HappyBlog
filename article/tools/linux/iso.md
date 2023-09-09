# 烧录 ISO

## 1. 下载 iso（[中科大源](http://mirrors.ustc.edu.cn/ubuntu-releases/16.04/)）

## 2. 格式化 u 盘

```bash
# 查看挂载的u盘，一般是 /dev/sdd1、/dev/sdb
df -h
sudo fdisk -l  # 更详细

# 格式化之前，先卸载u盘
umount /dev/sdd1

# 格式化，三种格式，选择其中一种（一般第三种）
sudo mkfs.ntfs /dev/sdd1
sudo mkfs.ext4 /dev/sdd1
sudo mkfs.vfat /dev/sdd1
```

## 3. 制作启动文件

```bash
sudo dd if=/path/to/ubuntu.isoi of=/dev/sdd bs=4M status=progress && sync
```

- bs=4M 设置一次读写 BYTES 字节,status=progress 显示烧录进度
- 注意，of=/dev/sdd，而不需要加上分区号（sdd1）
- sync 用于将缓存同步到 u 盘中

## 4. 文件分区

| 目录  | 建议大小                                       | 格式     | 描述                                                                                                      |
| ----- | ---------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| /boot | 1G 左右                                        | ext4     | 空间起始位置   分区格式为 ext4 /boot 建议：应该大于 400MB 或 1GB Linux 的内核及引导系统程序所需要的文件。 |
| swap  | 物理内存两倍，内存大的话，和物理内存一样大即可 | swap     | 交换空间：交换分区相当于 Windows 中的“虚拟内存”。                                                         |
| /     | 150G-200G                                      | ext4/xfs | 根目录                                                                                                    |
| /tmp  | 5G 左右                                        | ext4     | 系统的临时文件，一般系统重启不会被保存。（建立服务器需要，家庭用也可不挂载)                               |
| /home | 剩余所有                                       | ext4/xfs | 用户工作目录；个人配置文件，如个人环境变量等；所有账号分配一个工作目录。                                  |
