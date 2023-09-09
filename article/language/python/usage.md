# Python 使用

## Python 基础

关键记忆：

sort()函数对列表进行 **永久** 排序

sorted()函数对列表进行 **临时** 排序

reverse()反转列表

len()获取列表长度

**列表：[]**

append(value)

insert(index,value)

remove(value) 按值删除

pop() 弹出最新值,或指定索引

del list[index] 按索引删除

clear() 删除所有元素

列表生成式：list = [`x 的表达式` for x in `list/mp 等`]

**元组：()，元组就是不可变的列表**

**字典（映射，map）：{key:value , key:value}**

添加\修改字典元素：map[key]=value

删除

1. clear() 删除字典内所有元素
2. pop() 删除头部，或者指定值
3. popitem() 随机返回并删除一对键值对
4. del 全局方法，del map[index] 删除索引，del map 清空字典
5. .items() 返回可遍历的键值对元祖数组
6. .values() 可遍历的值

**for 循环：**

```
for x in xs :
  循环内容（注意缩进）

ict = {'Google': 'www.google.com', 'Runoob': 'www.runoob.com', 'taobao': 'www.taobao.com'}

print "字典值 : %s" %  dict.items()

# 遍历字典列表
for key,values in  dict.items():
    print key,values
```

**while 循环：**

```
while x:
  循环内容
```

**if 语句：**

```
if x :
  if内容
elif x :
  elif内容
else :
  else内容
```

**if 优化：**

**在条件判断中使用 all() / any()**

`all()` 和 `any()` 两个函数非常适合在条件判断中使用。这两个函数接受一个可迭代对象，返回一个布尔值，其中：

- `all(seq)`：仅当 `seq` 中所有对象都为布尔真时返回 `True`，否则返回 `False`
- `any(seq)`：只要 `seq` 中任何一个对象为布尔真就返回 `True`，否则返回 `False`

- `url.startswith('http')`
  返回一个 bool 类型的值，顾名思义，判断 url 是否以 http 开头

**文档注释**

```
def 函数x
"""
summary 简要的概述

Args: 说明参数
    :param1：
    :param2：

Returns：说明返回值

Raises:列出与接口有关的所有异常

"""
```

## 特殊文件

`__init__.py`文件用于标识当前文件夹是一个包，该文件中的内容在导入这个包的时候会运行

`egg-info`文件夹一般用于存放源信息，比如 Python 版本信息等

初始化参数：`def fuc(age:int=10)`

即：age 是一个 int 类型，若没有指定传入，则这个值默认为 10

## `_foo` `__foo` `__foo__`

- `__foo__`: 定义的是特殊方法，一般是系统定义名字 ，类似 `__init__()` 之类的.
- `_foo`: 以单下划线开头的表示的是 protected 类型的变量，即保护类型只能允许其本身与子类进行访问，不能用于 **from module import \***
- `__foo`: 双下划线的表示的是私有类型(private)的变量, 只能是允许这个类本身进行访问了。

## json

- json.dumps()：将 dict 搞成 json 字符串
- json.dump()：
- json.load(r’path/to/file.json’)
- json.loads()：加载 json 格式的字符串为 dict

## 伪全局变量

想定义一些全局参数时，可以建立一个文件 `[const.py](http://const.py)` ，其中存放变量，如：

```python
// const.py
AUTHOR="HappyTsing"

// main.py
from const.py import AUTHOR
print(AUTHOR)
```

此后，只需要导入，就可以直接使用。也可以直接 `from [const.py](http://const.py) import *` 。

# pymysql

https://www.cnblogs.com/chenhuabin/p/11241195.html
