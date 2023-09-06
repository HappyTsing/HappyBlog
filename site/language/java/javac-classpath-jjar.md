# javac/java、classpath、jar

# Java命令行

`javac` 是编译器，将整个 `.java` 文件编译成 `.class` 文件。

```bash
javac <options> <source files>
options:
				-d <directory>                    指定编译生成的类文件的输出目录
				-cp <path> , -classpath <path>    指明了.java文件里import的类的位置
				-sourcepath <path>                指定源文件位置
				-verbose                          输出有关编译器正在执行的操作的消息
```

`java` 是解释器，逐个解释运行 `.class` 文件。

```bash
java [-options] class [args...]           执行类
java [-options] -jar jarfile [args...]    执行jar文件

options:
				-cp <path>, -calsspath <path>     class文件所需要的所有类的package路径
				-D<name>=<value>                  设置系统变量
```

# classpath

什么是 `classpath` ？

顾名思义：类路径，`classpath`是JVM用到的一个环境变量，它用来指示JVM如何搜索`class`。

已知Java是编译型语言： `source.java → javac.class → java_execute`

因此，JVM需要知道，如果要加载一个 `package abc.xyz` 的类 `helloworld`，应该去哪里搜索对应的 `helloworld.class` 文件。

所以， `classpath` 是一组目录的集合：

```bash
# 1. windows，分号;分隔，带空格的目录用双引号""括起来
C:\work\project1\bin;C:\shared;"D:\My Documents\project1\bin"

# 2. Liunx，冒号:分隔
/usr/shared:/usr/local:~/Projects
```

设置完 `classpath` 后，当JVM在加载时，会依次查找：

- `/usr/shard/abc/xyz/helloworld.class`
- `/usr/local/abc/xyz/helloworld.class`
- `~Projects/abc/xyz/helloworld.class`

如果查找到目标，就停止搜索，如果所有路径下都没有找到，就报错。

`classpath`的设定方法有两种：

- 在系统环境变量中设置`classpath`环境变量，不推荐；
- 在启动JVM时设置`classpath`变量，推荐。

```java
package abc.xyz;
class helloworld{
    public static void main(String[] args) {
        System.out.println("helloworld");
    }
}

~/Projects
└── abc
    └── xyz
        ├── helloworld.class
        └── helloworld.java

~/Projects$ java abc.xyz.helloworld
~$ java -cp ~/Projects abc.xyz.helloworld
```

# jar

如果有多个 `.class` 文件，散落在各层目录中，肯定不方便管理。

因此，引出jar包(Java Archive File)的概念，本质上jar包就是一个zip格式的压缩文件。但是，jar包存在一个特殊的 `META-INF/MANIFEST.MF` 纯文本文件，它可以指定 `Main-Class` 和其他信息。

JVM会自动读取该文件，如果存在`Main-Class` ，我们就不必在命令行指定启动的类名，而是直接运行jar包即可：

```java
java -jar helloworld.jar
```

如果未指定 `Main-Class` ，则无法直接调用，而是通过 `-cp`参数实现：

```java
jar -cp helloworld.jar abc.xyz.helloworld
```

jar命令：

```shell
# 1. 打包
jar -cvf helloworld.jar abc/xyz/helloworld.class

jar -cvfm helloworld.jar META-INF/MANIFEST.MF  abc/xyz/helloworld.class

# 2. 查看jar包的文件结构
jar -tf helloworld.jar
```
