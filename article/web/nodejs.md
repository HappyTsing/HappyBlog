# NodeJS

## 简介

Node.js 是一个基于Chrome V8 引擎 的JavaScript 运行时环境。

语法和JavaScript相似，单线程，后端语言。

其自带一个包管理器：npm。这也是在此学习的目的。

下载：https://nodejs.org/zh-cn/

官网代码：如下即可构建一个服务器，暴露在3000端口，和java实现的结果类似。

```js
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

使用 `npm init` 初始化一个nodejs项目，运行后会自动创建一个 `package.json` 文件，其中存放了项目的基础信息(e.g. name, version, author, license)。并且以后会存放该项目的依赖(dependencies)。

在 `npm i` 安装依赖之后，会自动再生成一个 `package-lock.json` 文件，该文件在npm5之后引入，目的是为了解决npm依赖版本不一致的问题。

注意： `npm i --save` 中的 `--save` 参数在npm5之前，会将下载的依赖添加到 `package.json` 文件中，但在此后的版本，无需该参数也会自动添加，因此不要再使用 `--save` 参数 | [参见](https://stackoverflow.com/questions/19578796/what-is-the-save-option-for-npm-install)

## cnpm

可以使用阿里定制的 cnpm 命令行工具代替默认的 npm。

```bash
npm install -g cnpm --registry=https://registry.npmmirror.com

## https://registry.npm.taobao.org 于 2022.06.30 号正式下线和停止 DNS 解析
```

此后，就可以使用 cnpm 代替 npm了。

如果cnpm下载有问题，可以使用 npm ，并加上 `--registry` 来使用淘宝源下载。

## yarn

Yarn是由Facebook、Google、Exponent 和 Tilde 联合推出了一个新的 JS 包管理工具，它弥补了npm 一些缺陷。如下载速度慢、同一个项目安装时无法保证一致性等。

yarn安装时会将依赖写入 `package.json` ，同时生成一个 `yarn.lock` 保证版本一致性。

不过在npm 5.0之后(目前以8.x)，npm安装依赖时，会生成 `package-lock.json` 文件，也能保证一致性。但由于yarn是异步下载，因此速度还是更快。

此外，npm输出杂乱，且老失败，**推荐使用yarn⭐️**。

```bash
npm install -g yarn --registry=https://registry.npmmirror.com  ## 需配置yarn的环境变量
brew install yarn  ## 推荐这种方式，此后yarn安装的全局依赖可以直接使用，无需配置环境变量
yarn config set registry registry.npmmirror.com
```

## 指令对比

| desc | yarn | npm |
| --- | --- | --- |
| 初始化package.json | yarn init [-y] | npm init [-y] |
| 根据package.json安装依赖 | yarn [install] | npm install（缩写 npm i） |
| 安装依赖（dependencies） | yarn add packageName | npm i packageName |
| 安装依赖（devDependencies） | yarn add packageName -D | npm install packageName -D |
| 全局安装依赖 | yarn global add PackageName | npm install packageName -g |
| 移除依赖 | yarn remove packageName  | npm uninstall packageName |
| 移除全局依赖 | yarn global remove packageName | npm uninstall packageName -g |
| 升级依赖 | yarn upgrade packageName | npm update packageName |
| 升级全局依赖 | yarn global upgrade packageName | npm update packageName -g |
| 查看依赖 | yarn [global] list --depth=0 | npm list [-g] --depth 0 |

## Express框架

类似于java的springboot框架，用于方便nodejs的后端开发。

```js
//express_demo.js 文件
var express = require('express');
var app = express();
 
app.get('/', function (req, res) {
   res.send('Hello World');
})
 
var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})
```

## 运行nodejs代码

```shell

node xxx.js

```