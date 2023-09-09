# Log

## 框架介绍

java 领域存在多种日志框架，目前常用的日志框架如下：

### 记录型日志框架(日志实现）

#### Log4j、Log4j2

!!! note "配置文件名称及其存放位置"

    - Log4j：`log4j.properties`
    - [Log4j2](https://logging.apache.org/log4j/2.x/manual/configuration.html)：`log4j2.properties`、`log4j2.xml`、`log4j2.json`、`log4j2.yaml`
    - 文件位置：添加到 classpath 中，若为 maven 项目，则存放至 `/src/main/resources`

```xml title="log4j2 Maven 依赖"
<dependencies></dependencies>
  <dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-api</artifactId>
    <version>2.15.0</version>
  </dependency>
  <dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.15.0</version>
  </dependency>
</dependencies>
```

当然，也可以单独使用，不过推荐通过门面日志框架调用！故而在此先不介绍！

#### Jul(Java Util Logging)

jul 无需依赖即可调用，因此如果是写小文件的话可以用用这个，写项目不建议使用。

!!! note "默认配置文件位置：`$JAVA_HOME/jre/lib/logging.properties`"

```java title="Jul Usage"
import java.util.logging.Logger;
Logger logger = Logger.getGlobal();
logger.info("log")
```

#### Logback

!!! note "配置文件名称及其存放位置"

    依次在classpath中寻找：logback-test.xml → logback.groovy → logback.xml

    将配置文件 logback.xml 和 logback-test.xml 按照以下层次结构添加到项目中：

    ```title="项目结构示意"
    src
    ├── main
    │   └── resources
    │       └── logback.xml
    └── test
        └── resources
            └── logback-test.xml
    ```

```xml title="logback Maven 依赖"
<!-- https://mvnrepository.com/artifact/ch.qos.logback/logback-classic -->
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.2.3</version>
</dependency>


```

!!! note

    导入上述依赖后，会自动导入如下三个依赖：

    - logback-classic
    - logback-core（由于会自动导入，因此无需我们自己再手动导入该依赖了
    - slf4j-api(该依赖一般自己导入，因此无需管他）

### 门面型日志框架(日志接口)

#### JCL(Jakarta Commans Logging)

```xml title="JCL Maven 依赖"
<dependency>
    <groupId>commons-logging</groupId>
    <artifactId>commons-logging</artifactId>
    <version>1.2</version>
</dependency>
```

```java title="JCL Usage"

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

// 1. 如果在静态方法中引用Log，通常直接定义一个静态类型变量
public class Test {
    static final Log log = LogFactory.getLog(Test.class);

    static void staticFunc() {
        log.info("static function");
    }
}

// 2. 如果在实例方法中引用Log，通常定义一个实例变量
public class Test {
		// 可被子类继承
    protected final Log log = LogFactory.getLog(getClass());

    void func() {
        log.info("function");
    }
}
```

#### SLF4J

```xml title="SLF4J Maven 依赖"
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.30</version>
</dependency>

<!-- 简单实现的桥接器，无需配置即可输出(https://mvnrepository.com/artifact/org.slf4j/slf4j-simple) -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-simple</artifactId>
    <version>1.7.30</version>
</dependency>

<!-- 桥接Java Util Logging(https://mvnrepository.com/artifact/org.slf4j/slf4j-jdk14) -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-jdk14</artifactId>
    <version>1.7.30</version>
    <scope>test</scope>
</dependency>

<!-- 桥接log4j 1.2版本(https://mvnrepository.com/artifact/log4j/log4j) -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-log4j12</artifactId>
    <version>1.7.30</version>
</dependency>

<!-- 桥接log4j2 (https://mvnrepository.com/artifact/org.apache.logging.log4j/log4j-slf4j-impl)  -->
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-slf4j-impl</artifactId>
    <version>2.15.0</version>
</dependency>
```

```java title="SLF4J Usage"
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
final Logger logger = LoggerFactory.getLogger(o.class);

//特殊用法,可以直接用括号占位符替代值
int age=18;
String name="happytsing";
logger.info("name{} age{}",name,age);
```

## 配置文件详解

### Log4j2（TODO）

TODO！

### logback

![logback](http://logback.qos.ch/manual/images/chapters/configuration/basicSyntax.png)

#### 根节点<configuration>

包含下面三个属性：

- scan: 当此属性设置为 true 时，配置文件如果发生改变，将会被重新加载，默认值为 true。
- scanPeriod: 设置监测配置文件是否有修改的时间间隔，如果没有给出时间单位，默认单位是毫秒。当 scan 为 true 时，此属性生效。默认的时间间隔为 1 分钟。
- debug: 当此属性设置为 true 时，将打印出 logback 内部日志信息，实时查看 logback 运行状态。默认值为 false。

#### 子节点<property>

包含下面两个属性：

- name：变量名
- value：变量值

定义变量，通过<property>定义的变量会被插入到 logger 上下文中，可以使“${}”来使用变量。

#### 子节点<appender>

目的地，是负责写日志的组件，即日志的输出目标。

包含两个必要属性：

- name：appender 的 name，随意取
- class：appender 的全限定名
    - `ch.qos.logback.core.ConsoleAppender`
    - `ch.qos.logback.core.FileAppender`
    - `ch.qos.logback.core.rolling.RollingFileAppender`

**一、ConsoleAppender**

把日志输出到控制台，有以下子节点：

- <encoder\>：对日志进行格式化
- <target\>：字符串 System.out(default)或者 System.err，一般无需调整

**二、FileAppender**

把日志输出到文件，有以下子节点：

- <encoder\>
- <file\>：被写入的文件名，可以是相对目录，也可以是绝对目录
- <append\>：
  - true(default)：日志被添加到文件结尾
  - false：清空现存文件
- <prudent\>：安全写入，默认为 false，一般无需调整

**三、RollingFileAppender**

滚动记录文件，先将日志记录到指定文件，当符合某条件时，将日志记录到其他文件，子节点：

  - <encoder\>
  - <file\>
  - <append\>
  - <rollingPolicy\>：发生滚动时，决定 RollingFileAppender 的行为，设计文件移动和重命名，其有属性 class，定义具体的滚动策略类：

    - `<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">`
    - `<rollingPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">`

!!! warning

    未完成，[参见](https://www.cnblogs.com/warking/p/5710303.html)

#### 子节点<logger>

用于设置某一个包或具体的某一个类的：

- 日志打印级别
- 指定 Appender

有如下属性：

- name：指定的包/类
- level：日志级别(大小写无关)，ALL、OFF、TRACE、DEBUG(default)、INFO、WARN、ERROR
- additivity：是否向上级 logger 传递打印信息，true/false(default)

有如下标签：

- <appender-ref ref="appender_name"

```xml
<logger name="org.hibernate.SQL" level="debug" additivity="false">
  <appender-ref ref="appender_name">
</logger>

<logger name="org.hibernate" level="debug" additivity="true">
  <appender-ref ref="appender_name1">
  <appender-ref ref="appender_name2">
</logger>
```

如上例， `name="org.hibernate"` 是 `name="org.hibernate.SQL"` 的上级，但是由于 `additivity="false"` ，因此不会上传到上级 `name="org.hibernate"` ,更传不到 `root logger` ，因此仅仅执行该 logger 设置的 appender。

除了 `org.hibernate.SQL` 这个类之外的 `org.hibernate` 中的其他所有类，都会运行 logger `name="org.hibernate"` ，又由于它设置了 `additivity="true"` ，因此在执行了该 logger 设置的 appender 之后，还会上传到 `root logger` ，再次执行 `root logger` 中设置的 appender。

#### 子节点<root>

本质上也是一个<logger>元素，特殊点为它是根 logger，是所有<logger>的上级，因此它没有 additivity 属性（没有上级可以传递）。

```xml
<root level="DEBUG">
  <appender-ref ref="appender_name">
</root>
```

#### logback.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true" scanPeriod="60 seconds" debug="false">

    <!--定义日志文件的存储地址 勿在 LogBack 的配置中使用相对路径-->
    <property name="LOG_HOME" value="logback/" />

    <!--控制台日志， 控制台输出 -->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--格式化输出：%d表示日期，%thread表示线程名，%-5level：级别从左显示5个字符宽度,%msg：日志消息，%n是换行符-->
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
        </encoder>
    </appender>

    <appender name="FILE" class="ch.qos.logback.core.FileAppender">
        <file>${LOG_HOME}/output.log</file>
        <append>true</append>
        <encoder>
            <pattern>%-4relative [%thread] %-5level %logger{35} - %msg%n</pattern>
        </encoder>
    </appender>

    <logger name="aa.bb.cc" level="INFO" additivity="false">
        <appender-ref ref="STDOUT" />
    </logger>
    <logger name="org.appache" level="OFF"/>

    <!-- 日志输出级别 -->
    <root level="DEBUG">
        <appender-ref ref="FILE"/>
        <appender-ref ref="STDOUT" />
    </root>

</configuration>
```

## 实践

!!! note "阿里开发手册"

    应用中不可直接使用日志系统（log4j、logback）中的 API ，而应依赖使用日志框架 SLF4J 中的 API 。
    
    使用门面模式的日志框架，有利于维护和各个类的日志处理方式的统一。

**因此项目中推荐采用：logback+SLF4J 的组合。**

## Reference

- [廖雪峰 | Java Log](https://www.liaoxuefeng.com/wiki/1252599548343744/1264738568571776)
- [掘金 | 深入掌握 Java 日志体系](https://juejin.cn/post/6905026199722917902#heading-28) ⭐️
- [CSDN | slf4j 与 log4j、log4j2](https://blog.csdn.net/HarderXin/article/details/80422903)
- [Logback | configuration](http://logback.qos.ch/manual/configuration.html)
- [博客园 | LogBack 配置文件 logback.xml 详解](https://www.cnblogs.com/warking/p/5710303.html)
- [CSDN | LogBack logger 与 root 的关系解释](https://blog.csdn.net/u012129558/article/details/79947477)
