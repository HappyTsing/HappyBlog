# Python Install

主要安装两个东⻄

- Python 包管理器：Pipenv、virtualenv。**两者可互为替代**，后者更低层次
- Python 版本管理器：Pyenv

首先安装 pyenv，安装某个版本的 Python，将其作为 `全局 Python`，随后安装 pipenv，用于管理单个项目的 `Python 包`

## 一、版本管理器：Pyenv

### 1.1 安装 Pyenv

```shell title="mac"
brew update
brew install pyenv
brew install openssl readline sqlite3 xz zlib
echo 'eval "$(pyenv init --path)"' >> ~/.zprofile
echo 'eval "$(pyenv init -)"' >> ~/.zshrc
```

```shell title="ubuntu"
git clone https://github.com/pyenv/pyenv.git ~/.pyenv

echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init -)"' >> ~/.zshrc
```

!!! note

    若国内网络不好，可使用 gitee 镜像：`git@gitee.com:chenshuchuan/pyenv.git`

### 1.2 使用 Pyenv 安装 Python

```shell

# ubuntu需要安装编译环境
sudo apt-get install -y make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev xz-utils tk-dev liblzma-dev

# m1 安装3.9.4，关闭vpn
pyenv install 3.8.0
pyenv versions # 查看所有安装的Python
```

### 1.3 更换 Pyenv 淘宝源

pyenv 若出现安装慢的情况，推荐使用淘宝源安装：

```shell title="将代码写入 .zshrc 中"
function pyinstall() {
    v=$1
    echo 准备使用淘宝源安装 Python $v
    curl -L https://npm.taobao.org/mirrors/python/$v/Python-$v.tar.xz -o ~/.pyenv/cache/Python-$v.tar.xz
    pyenv install $v
}
```

```shell title="淘宝源安装，并设置 Python 版本"
pyinstall 3.8.0
pyenv global 3.8.0  # 设置全局的 Python 版本，通过将版本号写入 ~/.pyenv/version 文件的方式。
pyenv local 3.8.0 # 设置 Python 本地版本，通过将版本号写入当前目录下的 .python-version 文件的方式。通过这种方式设置的 Python 版本优先级较 global 高。
```

## 二、包管理器

### Pipenv

```shell title="install"
pip install --user pipenv

# 如果无法使用，添加下述至.zshrc
export PATH="$PATH:$HOME/.local/bin"
```

```shell title="usage"
# 进入项目目录
cd my_project_folder

# 初始化
pipenv install

# 进入虚拟环境
pipenv shell

# 安装依赖（在当前项目目录下即可，不进入pipenv shell也可以的）
pipenv install requests
```

Pipenv 将在您的项目目录中安装超赞的  [Requests](https://python-requests.org/)  库并为您创建一个  [Pipfile](https://github.com/pypa/pipfile)。

 `Pipfile`  用于跟踪您的项目中需要重新安装的依赖，例如在与他人共享项目时。


!!! note

    如果国内网络不好， 推荐更换为阿里源：

    - 打开 `Pipfile` 文件
    - 修改为：`http://mirrors.aliyun.com/pypi/simple/`

现在安装了 Requests，您可以创建一个简单的  `main.py`  文件来使用它：

```python
import requests

response = requests.get('https://httpbin.org/ip')

print('Your IP is {0}'.format(response.json()['origin']))
```

然后您就可以使用  `pipenv run`  运行这段脚本：

```shell
pipenv run python main.py
```

```shell
# Remove the virtualenv.
pipenv --rm
```

### virtualenv

```shell title="install"
# 使用pip安装的是python2
pip3 install virtualenv
# 如果无法使用，将下述文件添加到.zshrc reference from(https://stackoverflow.com/questions/31133050/virtualenv-command-not-found)
PATH="$PATH:$HOME/.local/bin"
```



```shell title="step1: 为工程创建一个虚拟环境"
cd my_project_folder
virtualenv venv
python -m virtualenv env  # 使用当前python生成虚拟环境
```

`virtualenv venv`  将会在当前的目录中创建一个文件夹，包含了 Python 可执行文件， 以及  `pip`  库的一份拷贝，这样就能安装其他包了。

虚拟环境的名字（此例中是  `venv` ） 可以是任意的；若省略名字将会把文件均放在当前目录。


```shell title="step2：激活虚拟环境"
source venv/bin/activate
```

当前虚拟环境的名字会显示在提示符左侧（比如说  `(venv)您的电脑:您的工程 用户名$`） 以让您知道它是激活的。

从现在起，任何您使用pip安装的包将会放在 `venv`  文件夹中， 与全局安装的 Python 隔绝开。

```shell title="step3：安装包"
pip install requests
```

如果想在 vscode 中使用， `command shift p`输入 `Python: Select Interpreter`，选择 `venv/bin/python3.6`，然后再次`command shift p`输入 `Python: Create Terminal`，新建终端时，会默认自动调用上述的 `source venv/bin/activate`的命令。

```shell title="step4：完成工作，停用虚拟环境"
deactivate
```

这将会回到系统默认的 Python 解释器，包括已安装的库也会回到默认的。

要删除一个虚拟环境，只需删除它的文件夹，或者执行 `rm -rf venv`。

## 三、requirements.txt

想要将当前 pip list 的内容生成 `requirements.txt` ，可以使用：

```python
pip freeze > requirements.txt
```

## 四、总结

包管理器：在 pycharm 中使用默认的 virtualenv，在 vscode 中使用 Pipenv

版本管理器：pyenv，但是在实际项目中，和它无关！

注意，无论是使用 virtualenv 还是 pipenv 创建的虚拟环境，在虚拟环境的文件夹下的 bin 目录中，都存在对应的 python interpreter，也就是 python 解释器。

在实际项目内，必须使用虚拟环境的解释器，而不是 pyenv 的解释器！

## 五、vscode 为例讲解 pipenv

进入项目目录，使用 `pipenv install` 创建好虚拟环境。

`command shift p` ，输入`Python: Select Interpreter` ，选择对应创建的 pipenv 虚拟环境中的 python 解释器。

下载依赖不再使用 `pip install` 命令，而是 `pipenv install []` ，它会将依赖自动写入 `pipfile.lock` 中，此后在项目中拥有该文件的情况下，运行 `pipenv install` 命令，会自动下载该文件中记录的所有依赖。

值得注意的是，使用 `pipenv shell` 进入 shell 之后，可以使用 `pip install` 安装依赖，这种方式安装的依赖不会写入 `pipfile.lock` 中。

## Reference

- [Python 最佳实践指南](https://pythonguidecn.readthedocs.io/zh/latest/)：安装 Pipenv
- [Github | Pyenv](https://github.com/pyenv/pyenv)：安装 Pyenv
