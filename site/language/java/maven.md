# Maven从入门到实践

# 简介

Apache Maven is a software project management and comprehension tool. Based on the concept of a project object model (POM), Maven can manage a project's build, reporting and documentation from a central piece of information.

项目管理工具，基于 POM，可以管理一个项目的构建、报告和文档。

![maven_setting](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/maven/setting.png)

# 安装

```bash
# 1. 检查JAVA_HOME环境变量
echo $JAVA_HOME

# 2. 安装并检查maven
sudo apt install maven
brew install maven
mvn -v
```

# Maven 仓库

当我们执行 Maven 构建命令时，Maven 开始按照以下顺序查找依赖的库：

- **步骤 1** － 在本地仓库中搜索，如果找不到，执行步骤 2，如果找到了则执行其他操作。
- **步骤 2** － 在中央仓库中搜索，如果找不到，并且有一个或多个远程仓库已经设置，则执行步骤 4，d 如果找到了则下载到本地仓库中以备将来引用。
- **步骤 3** － 如果远程仓库没有被设置，Maven 将简单的停滞处理并抛出错误（无法找到依赖的文件）。
- **步骤 4** － 在一个或多个远程仓库中搜索依赖的文件，如果找到则下载到本地仓库以备将来引用，否则 Maven 将停止处理并抛出错误（无法找到依赖的文件）。

## 本地仓库

```bash
cd ~/.m2/repository
```

## 中央仓库

- 由 Maven 社区管理，其中包含了大量常用库
- 不需要配置
- 需要通过网络才能访问

Maven 默认的仓库：[https://repo.maven.apache.org/maven2](https://repo.maven.apache.org/maven2)，更换阿里云镜像仓库以加速下载。

默认镜像配置在 Super POM 中可以查看。

```xml
vim ~/.m2/settings.xml

<settings>
    <mirrors>
        <mirror>
            <id>alimaven</id>
            <mirrorOf>central</mirrorOf>
            <name>aliyun maven</name>
            <url>https://maven.aliyun.com/repository/public</url>
        </mirror>
    </mirrors>
</settings>
```

## 远程仓库

如果中央仓库中也找不到依赖信息，会停止构建过程并输出错误信息到控制台。

由此，Maven 提供了远程仓库的概念，它是开发人员自己定制的仓库，包含了所需要的代码库或其他工程中用到的 jar 文件。

```xml
<dependencies>
    <dependency>
        <groupId>com.companyname.common-lib</groupId>
        <artifactId>common-lib</artifactId>
        <version>1.0.0</version>
	</dependency>
<dependencies>
<repositories>
    <repository>
        <id>companyname.lib1</id>
        <url>http://download.companyname.org/maven2/lib1</url>
    </repository>
    <repository>
        <id>companyname.lib2</id>
        <url>http://download.companyname.org/maven2/lib2</url>
    </repository>
</repositories>
```

# Maven 坐标

Maven 的坐标主要由三个部分组成：

- groupId：公司或组织的唯一标志
- artifactId：项目的唯一 ID，一个 groupId 下可能有多个项目，通过 artifactId 来区分
- version：版本

坐标的作用主要有两个：

- 对于依赖(dependency)和插件(plugin)，以下面的 `flacoco` 为例，Maven 会先在本地仓库 `~/.m2/com/github/sponlabs/flacoco/1.0.1` 下寻找是否存在，如果不存在，回去 Maven 远程仓库下载。
- 对于当前项目，运行 `mvn install` ，会在 `~/.m2/fr/inria/gforge/spirals/nopol/0.2-SNAPSHOT` 下生成一个 JAR 包及其配置信息。

```xml
<?xml version="1.0" encoding="utf-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <!-- 1.当前项目坐标-->
  <groupId>fr.inria.gforge.spirals</groupId>
  <artifactId>nopol</artifactId>
  <version>0.2-SNAPSHOT</version>
  <!-- 2.项目所需依赖-->
  <dependencies>
    <dependency>
      <groupId>com.github.spoonlabs</groupId>
      <artifactId>flacoco</artifactId>
      <version>1.0.1</version>
    </dependency>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.13.2</version>
    </dependency>
  </dependencies>
  <!-- 3.插件-->
  <build>
    <pluginManagement>
      <plugins>
        <plugin>
          <groupId>org.codehaus.mojo</groupId>
          <artifactId>javacc-maven-plugin</artifactId>
          <version>${javacc-maven-plugin.version}</version>
        </plugin>
      </plugins>
    </pluginManagement>
  </build>
</project>

```

# Maven 生命周期

Maven 共有三套相互独立的生命周期(clean、build、site)，每个生命周期内部包含多个有序阶段(phase)，后面的阶段依赖于前面的阶段，因此不同的阶段执行具有先后顺序。

## clean：清理项目

clean 生命周期包含 3 个阶段：

| Phrase     | Description                     |
| ---------- | ------------------------------- |
| pre-clean  | 执行一些 clean 前需要完成的工作 |
| clean      | 清理上一次构建生成的文件        |
| post-clean | 执行一些 clean 后需要完成的工作 |

## site：建立和发布项目站点

site 生命周期包含 3 个阶段：

| Phrase      | Description                              |
| ----------- | ---------------------------------------- |
| pre-site    | 执行一些在生成项目站点之前需要完成的工作 |
| site        | 生成项目站点文档                         |
| site-deploy | 将生成的项目站点发布到服务器上           |
| post-site   | 执行一些在生成项目站点之后需要完成的工作 |

## build：构建项目

亦称为 default 生命周期，包含 23 个阶段，详见：[Maven | Introduction to the Build Lifecycle](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)

下面列出 23 个阶段中较为重要的阶段：

| Phrase       | Description                                                           |
| ------------ | --------------------------------------------------------------------- |
| validate     | 验证项目是否正确并且所有必要信息都可用                                |
| compile      | 编译项目的源代码                                                      |
| test-compile | 编译测试源代码到测试目标目录                                          |
| test         | 使用合适的单元测试框架(e.g. JUnit)运行测试 , 测试代码不会被打包或部署 |
| package      | 将编译后的代码打包成可分发的格式(e.g. JAR)                            |
| verify       | 对集成测试的结果进行检查，以保证质量达标                              |
| install      | 安装打包的项目到本地仓库，以供其他 maven 项目使用                     |
| deploy       | 拷贝最终的工程包到远程仓库中，以共享给其他开发人员和 maven 项目使用   |

# MVN 命令

当我们调用 `mvn` 命令时，其实在调用 maven 的生命周期阶段。

命令格式： `mvn phrase1 [phrase2] ... [phraseN]`

```bash
# 1. 调用clean生命周期的clean阶段，实际会执行clean生命周期中的pre-clean和clean阶段
mvn clean

# 2. 调用clean生命周期的clean阶段和build生命周期的install阶段(及二者之前的所有阶段)
mvn clean install
```

# Maven 插件

已知 Maven 定义了三个抽象的生命周期，每个生命周期包括多个阶段。

由此引出 Maven 插件，插件以独立的构建形式存在，通过将生命周期的阶段与插件目标绑定，完成生命周期阶段的任务，可以通过 `mvn phrase` 来执行与该阶段绑定的插件目标。

插件的每个功能叫做插件的目标(Plugin Goal)，每个插件可能有 1 个及以上的目标。

## 内置绑定

为了让用户几乎不用任何配置就能构建 maven 项目，maven 为一些主要的生命周期阶段绑定好了插件目标，当我们通过命令调用生命周期阶段时，绑定的插件目标就会执行对应的任务。

详见：[Maven | Introduction to the Build Lifecycle](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)

# 自定义绑定

设置 `<build>` 标签。

# 核心文件：pom.xml

当执行 maven 任务时，maven 会在当前目录查找 `pom.xml` ，从中获取所需的配置信息：

- 项目基础信息：坐标、版本、开发者、邮件、许可证...
- 项目构建信息
- 项目部署信息：mvn deploy

## Super POM

Super POM 是 Maven 默认的 POM，所有的 POM 都继承自一个父 POM，使用以下命令来查看 Super POM 的默认配置：

```bash
mvn help:effective-pom
```

执行完毕后，会直接在控制台显示 Super POM 的内容，包括远程仓库、默认工程源码目录结构、输出目录、插件、仓库等配置。

## 标签讲解

详见：[菜鸟 \| Maven POM](https://www.runoob.com/maven/maven-pom.html)

```xml
<?xml version="1.0" encoding="utf-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <!-- 父项目的坐标。如果项目中没有规定某个元素的值，那么父项目中的对应值即为项目的默认值。 -->
  <parent>
    <groupId/>
    <artifactId/>
    <version/>
    <!-- 父项目的pom.xml文件的相对路径。相对路径允许你选择一个不同的路径。默认值是../pom.xml。Maven首先在构建当前项目的地方寻找父项
            目的pom，其次在文件系统的这个位置（relativePath位置），然后在本地仓库，最后在远程仓库寻找父项目的pom。 -->
    <relativePath/>
  </parent>
  <!-- 声明项目描述符遵循哪一个POM模型版本。模型本身的版本很少改变，虽然如此，但它仍然是必不可少的，这是为了当Maven引入了新的特性或者其他模型变更的时候，确保稳定性。 -->
  <modelVersion>4.0.0</modelVersion>
  <!-- 当前项目的坐标 -->
  <groupId>fr.inria.gforge.spirals</groupId>
  <artifactId>nopol-server</artifactId>
  <version>0.2-SNAPSHOT</version>
  <!--项目产生的构件类型，例如jar、war、ear、pom。插件可以创建他们自己的构件类型，所以前面列的不是全部构件类型 -->
  <packaging>jar</packaging>
  <!-- 项目的名称，Maven产生的文档用 -->
  <name>No-Pol-server</name>
  <!-- 项目的主页的URL，Maven产生的文档用 -->
  <url>http://www.baidu.com/banseon</url>
  <!-- 项目的详细描述-->
  <description>Java Program Repair via Conditional Expression Replacement</description>
  <!-- 项目创建年份，4位数字。当产生版权信息时需要使用该值 -->
  <inceptionYear>2013</inceptionYear>
  <!--  其他信息：邮件、开发者、其他贡献者、许可证、组织-->
  <mailingList/>
  <developer/>
  <contributors/>
  <licenses/>
  <organization/>
  <!-- 项目持续集成信息 -->
  <ciManagement/>
  <!-- 项目的问题管理系统 -->
  <issueManagement/>
  <!--SCM(Source Control Management)标签允许你配置你的代码库，供Maven web站点和其它插件使用。 -->
  <scm/>
  <!-- 构建该项目或使用该插件所需的Maven的最低版本 -->
  <prerequisites>
    <maven>3.0</maven>
  </prerequisites>
  <!-- 模块，亦成为子项目 -->
  <modules>
    <module>指向该子模块的目录的相对路径</module>
  </modules>
  <!-- 远程仓库列表:依赖和扩展、 插件。  -->
  <repositories/>
  <pluginRepositories/>
  <!-- 构建项目需要的信息 在Super POM有默认配置-->
  <build>
    <!-- 文件位置(相对pom.xml文件的相对路径)：源码、脚本源码、单元测试源码、编译后程序class文件目录、编译后测试calss文件目录 -->
    <sourceDirectory>src/main/java</sourceDirectory>
    <scriptSourceDirectory>src/main/srcipts</scriptSourceDirectory>
    <testSourceDirectory>/src/test/java</testSourceDirectory>
    <outputDirectory>/target/classes</outputDirectory>
    <testOutputDirectory>/target/test-classes</testOutputDirectory>
    <!-- 资源路径：项目资源路径、测试资源路径 -->
    <resources>
      <resource>
        <directory>/src/main/resources</directory>
      </resource>
    </resources>
    <testResources>
      <testResource>
        <directory>/src/test/resources</directory>
      </testResource>
    </testResources>
    <!-- 输出设置：构建产生的所有文件的目录 -->
    <directory>/target</directory>
    <!-- 产生的构建文件名，默认为：${artifactId}-${version} -->
    <finalName/>
    <!-- 类似dependencyManagement，子POM再次声明才会引入 -->
    <pluginManagement>
      <plugins>
        <plugin/>
      </plugins>
    </pluginManagement>
    <!--使用的插件列表 -->
    <plugins>
      <!--plugin元素包含描述插件所需要的信息。 -->
      <plugin>
        <groupId/>
        <artifactId>maven-clean-plugin</artifactId>
        <version>2.5</version>
        <!--是否从该插件下载Maven扩展（例如打包和类型处理器），由于性能原因，只有在真需要下载时，该元素才被设置成enabled。 -->
        <extensions/>
        <!--在构建生命周期中执行一组目标的配置。每个目标可能有不同的配置。 -->
        <executions>
          <!--execution元素包含了插件执行需要的信息 -->
          <execution>
            <!--执行目标的标识符，用于标识构建过程中的目标，或者匹配继承过程中需要合并的执行目标 -->
            <id>default-clean</id>
            <!--绑定了目标的构建生命周期阶段，如果省略，目标会被绑定到源数据里配置的默认阶段 -->
            <phase>clean</phase>
            <!--配置的执行目标 -->
            <goals>
              <goal>clean</goal>
            </goals>
          </execution>
        </executions>
        <!--项目引入插件所需要的额外依赖 -->
        <dependencies>
          <dependency/>
        </dependencies>
        <!--任何配置是否被传播到子项目 -->
        <inherited/>
        <!--作为DOM对象的配置 -->
        <configuration>
          <encoding>UTF-8</encoding>
        </configuration>
      </plugin>
    </plugins>
  </build>
  <!-- 构建profile，如果被激活，会修改构建处理 -->
  <profiles/>
  <!--该元素描述了项目相关的所有依赖。 这些依赖组成了项目构建过程中的一个个环节。它们自动从项目定义的仓库中下载。要获取更多信息，请看项目依赖机制。 -->
  <dependencies>
    <dependency>
      <groupId>org.apache.maven</groupId>
      <artifactId>maven-artifact</artifactId>
      <version>3.8.1</version>
      <!-- 依赖类型，默认类型是jar。一些类型的例子：jar，war，ejb-client和test-jar。 -->
      <type>jar</type>
      <!--依赖范围。在项目发布过程中，帮助决定哪些构件被包括进来。欲知详情请参考依赖机制。
                - compile ：默认范围，用于编译
                - provided：类似于编译，但支持你期待jdk或者容器提供，类似于classpath
                - runtime: 在执行时需要使用
                - test: 用于test任务时使用
                - system: 需要外在提供相应的元素。通过systemPath来取得
                - systemPath: 仅用于范围为system。提供相应的路径
                - optional: 当项目自身被依赖时，标注依赖是否传递。用于连续依赖时使用 -->
      <scope>test</scope>
      <!--当计算传递依赖时， 从依赖构件列表里，列出被排除的依赖构件集。即告诉maven你只依赖指定的项目，不依赖项目的依赖。此元素主要用于解决版本冲突问题 -->
      <exclusions>
        <exclusion>
          <artifactId>spring-core</artifactId>
          <groupId>org.springframework</groupId>
        </exclusion>
      </exclusions>
      <!--可选依赖，如果你在项目B中把C依赖声明为可选，你就需要在依赖于B的项目（例如项目A）中显式的引用对C的依赖。可选依赖阻断依赖的传递性。 -->
      <optional>true</optional>
    </dependency>
  </dependencies>
  <!--该元素描述使用报表插件产生报表的规范。当用户执行"mvn site"，这些报表就会运行。 在页面导航栏能看到所有报表的链接。 -->
  <reporting/>
  <!-- dependency中的依赖默认被子项目继承，会自动引入，但是
         dependencyManagement中的依赖并不会自动导入，仍旧需要在子项目的pom.xml中的dependency标签中声明，只是此时只需要提供：groupId、artifactID两个信息即可。-->
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
        <version>${slf4j.version}</version>
      </dependency>
      <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>jul-to-slf4j</artifactId>
        <version>${slf4j.version}</version>
      </dependency>
    </dependencies>
  </dependencyManagement>
  <!-- 标签内声明变量，在整个pom.xml中可都以使用该变量 -->
  <properties>
    <slf4j.version>1.7.5</slf4j.version>
  </properties>
  <!--项目分发信息，在执行"mvn deploy"后表示要发布的位置。有了这些信息就可以把网站部署到远程服务器或者把构件部署到远程仓库。 -->
  <distributionManagement>
    <repository>
      <id>internal-repo</id>
      <name>Temporary Staging Repository</name>
      <url>file://${project.build.directory}/mvn-repo/releases</url>
    </repository>
    <snapshotRepository>
      <id>internal-snapshot-repo</id>
      <name>Temporary Staging Snapshot Repository</name>
      <url>file://${project.build.directory}/mvn-repo/snapshots</url>
    </snapshotRepository>
    <!-- 若只部署本地，则下面的配置都不需要！ -->
    <!--部署项目的网站需要的信息-->
    <site>
      <!--部署位置的唯一标识符，用来匹配站点和settings.xml文件里的配置 -->
      <id>banseon-site</id>
      <!--部署位置的名称 -->
      <name>business api website</name>
      <!--部署位置的URL，按protocol://hostname/path形式 -->
      <url>scp://svn.baidu.com/banseon:/var/www/localhost/banseon-web</url>
    </site>
  </distributionManagement>
</project>
```

# Maven 实践

## 单元测试

Maven 本身没有单元测试框架，其 default 生命周期的 test 阶段绑定了 maven-surefire-plugin 插件，该插件可以调用 Junit3、Junit4、TestNG 等 Java 流行测试框架完成单元测试。

在默认情况下，maven-surefire-plugin 的 test 目标会自动执行测试源码路径（默认为 src/test/java/）下所有符合一组命名模式的测试类。这组模式为：

- `*/Test*.java`：任何子目录下所有命名以 Test 开头的 Java 类。
- `*/*Test.java`：任何子目录下所有命名以 Test 结尾的 Java 类。
- `*/*TestCase.java`：任何子目录下所有命名以 TestCase 结尾的 Java 类。

### 跳过测试

**1.** 要跳过测试，在 package 时加入参数 `skipTests` 即可

```bash
mvn package -DskipTests
```

**2.** 有时不仅需要跳过测试运行，还要跳过测试代码的编译：

```bash
mvn package -Dmaven.test.skip=true
```

**3.** 上述二者都可以通过配置 `pom.xml → build → plugin`实现

```xml
<plugin>
    <groupId>org.apache.maven.plugin</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <skip>true</skip>
    </configuration>
</plugin>
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <configuration>
        <skip>true</skip>
    </configuration>
</plugin>
```

## 动态指定要运行的测试用例

maven-surefire-plugin 提供了一个 test 参数让 Maven 用户能够在命令行指定要运行的测试用例。如：

```bash
mvn test -Dtest=RandomGeneratorTest
# 可以使用通配符
# 逗号分隔多个测试用例
mvn test -Dtest=Random*Test,AccountCaptchaServiceTest
```
