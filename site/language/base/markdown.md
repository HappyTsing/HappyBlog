# Markdown

## 标题

一级标题：#[空格]标题内容

二级标题：##[空格]标题内容

## 字体

粗体：\*\*粗体内容\*\*

斜体：\*斜体内容\*

斜体加粗：\*\*\*斜体加粗内容\*\*\*

删除线：\~\~删除内容~~

## 引用

一层：>[空格]引用内容

二层：\>\>[空格]引用内容

## 列表

### 无序列表

-[空格]列表内容

+[空格]列表内容

\*[空格]列表内容

### 有序列表

1.[空格]列表内容

## 分割线

三个及以上的\*或者-

## 表格

\|表头\|表头\|表头\|

|:-|:-:|-:|

\|内容\|内容\|内容\|

\|内容\|内容\|内容\|

!!! note
    第二行分割表头和内容。

    `-` 有一个及以上都行，为了对齐，可以多加几个

    `:-` 表示文字居左（默认）

    `:-:` 表示文字居中

    `-:` 表示文字居右

## 超链接

\[超链接名](超链接地址 "超链接 title")


!!! note
	超链接 title 是超链接的标题，当鼠标移到超链接上时显示的内容，可加可不加

跳转本文中的标题：[标题名]\(#标题名)

## 图片

\!\[图片注释](图片地址 ''图片 title'')

!!! note
	图片注释就是显示在图片下面的文字，相当于对图片内容的解释。
	
	图片 title 是图片的标题，当鼠标移到图片上时显示的内容。title 可加可不加

## 代码

- 单行代码：\`单行代码内容`

- 代码块：

  \```编程语言名

  代码块内容```

## 流程图

本质即为代码段，是编程语言名为 flow 的代码段

\```flow

tag=>type:[空格]content:>url

\```

!!! note
	**type**:

    1. start
    2. end
    3. operation 操作（矩形）
    4. subroutine
    5. condition 条件判断（菱形）
    6. inputoutput 输入输出（斜距形）

    **content**: 要显示的内容

    **url**: 文本的超链接

    **元素的连接**

    - tag1-tag2-...-tagn

    - 若是 conditon 类型，则连接时应该指明是 yes/no

    	- tag_condition(yes)->tag1

    	- tag_condition(no)->tag2

````
```flow
st=>start: Start
e=>end: End
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Y or N
io=>inputoutput: catch something...
st->op1->cond(yes)->io->e
cond(no)->sub1(right)->op1
```
````

其渲染后如下(typora 可以显示）：

```flow
st=>start: Start
e=>end: End
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Y or N
io=>inputoutput: catch something...
st->op1->cond(yes)->io->e
cond(no)->sub1(right)->op1
```

## Typora 快捷键

Ctrl+1-6：一阶标题~六阶标题

ctrl+u：下环线

ctrl+b：加粗

ctrl+i：倾斜

ctrl+L：选中一行

图片插入：直接将图片拖入相应位置

超链接：

1. \<http://网址\>
2. ctrl+k

代码：```+编程语言（如 java）
表格：

1.  \|a\|b\|c\|，然后 ctrl+enter 可以创建新行

2.  ctrl+t

任务列表：\- \[ \] 任务一

有序列：数字+空格

无序列：‘-’或者‘+’+空格

数学公式：\$\$

!!! example
	- 内联公式: \$[公式内容]\$
	- 独行公式: \$\$[公式内容]\$\$

水平分割线：\*\*\*或\-\-\-

引用：>+空格
注释：要添加注释的文字[\^注释内容]

表情：‘：’+单次

背景加黑：\` 内容\`

进入源代码模式：ctrl+/

上标：使用\<sup\>\</sup\>标签包裹的部分就是上标

下标：使用\<sub\>\</sub\>标签包裹的部分就是下标
