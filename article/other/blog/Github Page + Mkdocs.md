# Blog = Github Page + Mkdocs

## 框架选择

目前可以渲染 Markdown 的框架很多：

- GitBook
- Docsify
- VuePress
- Jekyll
- MkDocs

此前笔者曾使用 Jekyll 作为框架，但由于复杂的开发方式，后面就没动力更新了。

为了整洁方便，不需要太多变动原始 Markdown 文件就上传到网站，笔者最终选择了 MkDocs。

本教程中，我们将使用 `Material for MkDocs` 进行开发。

!!! note "框架优劣对比可参考: [框架选择](https://www.zhihu.com/question/465048044/answer/2534255228)"

## 配置 mkdocs

```shell title="安装 mkdocs-material"
pip install mkdocs-material
```

```shell title="创建新项目"
mkdir my-site && cd my-site
mkdocs new .
```

```shell title="本地调试"
mkdocs serve
```

此时，会自动生成 `mkdocs.yaml` 文件，只需要在其中进行相应配置即可。

!!! note

	推荐直接复制即可，对照项目文件食用体验更佳：[HappyBlog](https://github.com/HappyTsing/HappyBlog)

```yaml title="mkdocs.yaml"
site_name: HappyBlog
site_description: "这里是乐乐的个人博客，希望与你共同进步！"
site_url: "https://leqing.work/"
site_author: "HappyTsing"
repo_name: "HappyBlog"
repo_url: "https://github.com/HappyTsing/HappyBlog"
edit_uri: "https://github.com/HappyTsing/HappyBlog/blob/master/article"
copyright: "Copyright &copy; 2023 HappyTsing"
docs_dir: "article" # 源文件目录
site_dir: "site_build" # 生成静态文件目录，感觉没啥用

# 具体文章位置
nav:
  - Home: index.md
    # - BlockChain:
    # - Computer:
  - Section1:
      - sub_section1: "/path/to/file.md"

theme:
  name: material
  custom_dir: custom # 自定义文件夹
  language: zh
  features:
    # - announce.dismiss        # 通知关闭
    - content.action.edit # 编辑操作
    - content.action.view # 查看操作
    - content.code.annotate # 代码注释
    - content.code.select # 代码注释
    - content.code.copy # 复制代码
    - content.tabs.link # 标签链接
    - content.tooltips # 工具提示
    # - header.autohide         # 自动隐藏头部
    # - navigation.expand       # 展开导航
    - navigation.indexes # 导航索引
    - navigation.instant # 即时导航
    # - navigation.prune        # 导航修剪
    # - navigation.sections     # 导航节
    - navigation.tabs # 导航标签
    # - navigation.tabs.sticky  # 固定导航标签
    - navigation.top # 导航顶部
    - navigation.footer # 导航底部
    - navigation.tracking # 导航跟踪
    - search.highlight # 搜索高亮
    - search.share # 搜索分享
    - search.suggest # 搜索建议
    - toc.follow # 目录跟随
    # - toc.integrate           # 目录整合
  palette:
    - scheme: default
      primary: white
      # accent: indigo
      toggle:
        icon: material/weather-sunny
        name: Switch to dark mode
    - scheme: slate
      primary: grey
      # accent: indigo
      toggle:
        icon: material/weather-night
        name: Switch to light mode
  font:
    text: Noto Sans SC
    code: Fira Code
  favicon: img/logo/1.png
  logo: img/logo/2.png
  icon:
    logo: logo
    repo: fontawesome/brands/github
    edit: material/file-edit-outline

extra:
  disqus: "open"
  social:
    # - icon: fontawesome/brands/twitter
    #   link: https://twitter.com/xxx
    - icon: fontawesome/brands/github
      link: https://github.com/HappyTsing
    - icon: fontawesome/brands/bilibili
      link: https://space.bilibili.com/176452398/
    - icon: fontawesome/solid/paper-plane
      link: mailto:<wangleqing00@gmail.com> #联系方式
  generator: false
  analytics:
    provider: google
    property: G-JDXN8V33QR

# Plugins
plugins:
  - search
  # - tags # 标签参见: https://squidfunk.github.io/mkdocs-material/setup/setting-up-tags/

# Extensions
markdown_extensions:
  - abbr
  - admonition
  - attr_list
  - def_list
  - footnotes
  - md_in_html
  - toc:
      permalink: true # 固定标题位置为当前位置
  - pymdownx.arithmatex: # latex
      generic: true
  - pymdownx.betterem: # 代码块高亮
      smart_enable: all
      # linenums: true # 显示行号
      # auto_title: true # 显示编程语言名称
  - pymdownx.caret
  - pymdownx.details
  # - pymdownx.emoji:
  #     emoji_index: !!python/name:materialx.emoji.twemoji
  #     emoji_generator: !!python/name:materialx.emoji.to_svg
  - pymdownx.highlight:
      anchor_linenums: true
      use_pygments: true
  - pymdownx.inlinehilite
  - pymdownx.snippets
  - pymdownx.superfences:
      custom_fences:
        - name: mermaid
          class: mermaid
          format: !!python/name:pymdownx.superfences.fence_code_format
  - pymdownx.keys
  # - pymdownx.magiclink:
  #     repo_url_shorthand: true
  #     user: squidfunk
  #     repo: mkdocs-material
  - pymdownx.mark
  - pymdownx.smartsymbols
  - pymdownx.tabbed:
      alternate_style: true
  - pymdownx.tasklist:
      custom_checkbox: true
  - pymdownx.tilde

# 自定义 js 文件
extra_javascript:
  - js/baidu-analytics.js
```

## 配置 Github Page

为了实现上传 Github 时自动部署发布，需要配置 `ci.yaml`，如下：

```yaml title="ci.yaml"
name: ci
on:
  push:
    branches:
      - master
permissions:
  contents: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: 3.x
      - run: echo "cache_id=$(date --utc '+%V')" >> $GITHUB_ENV
      - uses: actions/cache@v3
        with:
          key: mkdocs-material-${{ env.cache_id }}
          path: .cache
          restore-keys: |
            mkdocs-material-
      - run: pip install mkdocs-material
      - run: mkdocs gh-deploy --force
```

## 集成评论 giscus

!!! reference

    [Giscus integration](https://squidfunk.github.io/mkdocs-material/setup/adding-a-comment-system/?h=giscus#giscus-integration)