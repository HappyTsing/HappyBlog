# 插件

## Common

- IntelliJ IDEA Keybindings
- Docker
- Material Icon Theme：图标更好看
- Path Intellisense：自动提示路径
- Todo-Tree：支持 BUG、TODO、FIXME、HACK 四个标签。
- Remote -SSH：ssh 连接服务器
- GitLens：增强 GIT，看提交记录
- CodeGeeX：AI 协助
- Prettier - Code formatter：格式化
- Tabnine ：代码智能提示

```sh
Tabnine Extension was unable to download its dependencies
解决办法: <https://github.com/codota/tabnine-vscode/issues/447>
use clash: 7890
host_ip=$(cat /etc/resolv.conf |grep "nameserver" |cut -f 2 -d " ")
echo $host_ip
vscode -> 设置 -> 输入proxy，修改Proxy为：http://host_ip:7890
如果Initializing失败，删除修改，或将其修改为http://127.0.0.1:7890
```


## Language

- Java：Extension Pack for Java
- C/C++：C/C++ Extension Pack
- Python：Python Extension Pack
- Markdown：Markdown All in One
- Rust：Rust Extension Pack
- Move：move-analyzer
- TOML：Even Better TOML
- XML：XML Language Support by Red Hat，仅安装这个即可，无需安装 xml tools！
- YAML：YAML Language Support by Red Hat

## 前端插件

基础必备

- JavaScript(ES6) code snippets
- HTML CSS Support：HTML CSS Support 和 IntelliSense for CSS class names in HTML 是功能差不多两个扩展，我更推荐使用前者，原因是它的贡献者中有 VSCode 的核心开发人员。

流畅书写

- Auto Rename Tag：当修改一个标签时，会对应修改其对应闭合标签。
- Auto Close Tag：自动闭合标签
- ESLint：js 代码检测技术，tslint 已被弃用，整合到 eslint 了。
- prettier：beautify 是 vscode 内置的，但目前前端最流行 prettier

```java
// settings.json
// 保存时格式化
"editor.formatOnSave": true,
// vscode的默认美化软件修改为prettier
"editor.defaultFormatter": "esbenp.prettier-vscode",
```

框架 vue

- vue：vue 语法高亮
- vue 3 snippets：常用代码片段，如写 java 时输入 psvm 可自动扩展
- vetur

调试

- Live server