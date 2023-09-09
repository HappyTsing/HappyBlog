# Java Install

## mac

```shell
brew install java11 # openjdk

# For the system Java wrappers to find this JDK, symlink it with
  sudo ln -sfn /opt/homebrew/opt/openjdk@11/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-11.jdk

# If you need to have openjdk@11 first in your PATH, run:
  echo 'export PATH="/opt/homebrew/opt/openjdk@11/bin:$PATH"' >> ~/.zshrc

# For compilers to find openjdk@11 you may need to set:
  export CPPFLAGS="-I/opt/homebrew/opt/openjdk@11/include"

```

## ubuntu

```shell
# ubuntu
sudo apt install openjdk-8-jdk  # openjdk-11-jdk

java -version # 查看默认版本

sudo update-alternatives --config java  # 安装了多个Java版本，修改默认版本

sudo apt remove openjdk-8-jdk # 删除

# 推荐：vscode command shift p 输入：jdk，选择安装即可

# 查看javahome位置
/usr/libexec/java_home -V
```


!!! tip "推荐配置 `JAVA_HOME`"

	`JAVA_HOME`：指向 JDK 的安装目录，Eclipse/NetBeans/Tomcat 等软件就是通过搜索 JAVA_HOME 变量来找到并使用安装好的 JDK. 
	
	将 `export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64` 写入 `~/.zshrc` 即可完成配置

## java for vscode

vscode 读取 JDK 的顺序如下：

- `settings.json` 文件中的 `java.home` 配置

!!! warning "此配置可能已过时，待笔者确认后修改"

```json
# ubuntu 通过命令 sudo update-alternatives --config java 获取JDK安装路径
{
    "java.home":"/usr/lib/jvm/java-11-openjdk-amd64",
    "java.configuration.runtimes": [
		{
			"name": "JavaSE-1.8",
			"path": "/usr/lib/jvm/java-8-openjdk-amd64",
			"default": true
		},
		{
			"name": "JavaSE-11",
			"path": "/usr/lib/jvm/java-11-openjdk-amd64",
		},
	]

}
```

- the `JDK_HOME` environment variable
- the `JAVA_HOME` environment variable
- on the current system path
