# 环境变量

## 1. 读取环境变量

- `export`：显示所有环境变量
- `echo $name`：输出某个具体环境变量的值，比如`echo $PATH`

## 2. 设置环境变量

**export name=value**

- 生效时间：立即生效
- 生效期限：当前终端有效，窗口关闭后无效
- 生效范围：仅针对当前用户有效

**~/.bashrc**

- 生效时间：交互式、non-login 方式进入 bash 运行时就会生效，或者手动`source ~/.bashrc`生效。若是 zsh ，修改 `~/.zshrc`
- 生效期限：永久有效
- 生效范围：仅针对当前用户有效

**~/.bash_profile**

- 生效时间：交互式、login 方式进入 bash 运行，执行一次。或者手动 source。通常`~/.bash_profile`会调用`~/.bashrc`
- 生效期限：永久有效
- 生效范围：仅针对当前用户有效

**~/.profile**

- 感觉和.bash_profile 类似，如果使用 zsh 的话，修改.profile 即可。

**/etc/bashrc、/etc/profile**

- 生效范围：对所有用户有效
