## 基础知识汇总

PWN：二进制漏洞挖掘与利用

exploit：用于攻击的脚本与方案，例如输入给程序一个字符串，这个字符串包含一些可执行代码的字节编码，称为攻击代码（exploit code）——csapp 197。另外，还有一些字节会用一个指向攻击代码的指针覆盖返回地址。那么，执行 ret 指令的效果就是跳转到攻击代码。

payload：攻击载荷，是精心构造的恶意数据

shellcode：调用攻击目标的 shell 的代码

二进制基础：

- 程序的编译与连接
- linux 下的可执行文件格式 ELF
- 进程虚拟地址空间
- 程序的装载与进程的执行
- x86 与 amd 汇编

## PWN 基础流程

主办方提供：服务器的 IP 与端口，该端口上执行一个有漏洞的二进制文件。该二进制文件也会提供给选手。

选手需要构建一个攻击脚本，例如 `exploit.py`，该脚本通常用于构建 `payload` ，将其发送给服务器，触发漏洞，拿到 `flag`。

## 栈溢出

ELF 格式的二进制目标文件加载进内存中时，随着指令的执行，有些数据会写入栈中。

对于基础的栈溢出利用，需要理解栈帧结构，以及布局。

本质上来说，由于栈是从高地址向低地址增长的，但是，当编译器为一个变量在栈中分配好空间后，该变量却是从低地址向高地址增长。

因此当该变量的值的大小超过分配好的空间，就会导致栈溢出。

可以看到，当变量，即图中的 `local variables` 溢出时，可以覆盖 `Return address`。

<img src="https://happytsing-figure-bed.oss-cn-hangzhou.aliyuncs.com/pwn/common-stack-frame.png" alt="common-stack-frame" style="zoom:33%;" />

**① 无保护**

在没有保护的情况下，可以直接自己构造 shellcode，然后修改 `Return address` 使程序跳转至 shellcode 执行。

具体来说，在构造输入的时候，这个输入包含 shellcode + `Return address` ，通过填充适当的内容，使得变量溢出后， `Return address` 刚好指向 shellcode。

**②NX**

但若存在 NX 保护时，上述方法就失效了，因为此时的栈将变为不可执行。

虽然栈不可执行了，但程序本身的代码仍然可以被执行，例如 libc 中的代码。

所谓 return to libc 就是利用 libc 中的 system 和 exit 函数获取 shell。

更进一步的话，就要用到 ROP：

所谓 ROP（Return Oriented Programming），其实就是面向返回编程，是通过拼接以 ret 指令结尾的代码片段来实现某些功能的技术。

以 ret 指令结尾的小端代码片段称为 ROP gadget，例如：

```
pop edx; ret;
```

**为什么 ROP gadget 可以用于构造攻击？**

上述指令首先从栈中弹出一个值，将其保存到 `%edx` 寄存器中，随后 ret 指令会再次从栈中，弹出一个地址，作为 `%eip` 的值，也就是下一条执行的指令地址。

若下一条指令的地址是另一个 ROP gadget 的地址，那么我们通过人为的拼接 ROP gadget，构造 ROP 链（ROP Chain），就可以人为的获取需要的数据。

> 例如 Return to libc 执行 system("/bin/sh") 就是一个特殊的 ROP 链例子，因为 system 和 exit 函数本质上也是以 ret 结尾的代码片段。

当然，想要构建 ROP 链，首先需要再栈上填充用于执行 ROP 链的数据，称为 ROP 载荷（ROP Payload）。

可参考：https://www.yuque.com/hxfqg9/bin/zzg02e

**③ASLR/PIE**

因为地址随机化，之前的手段已经无效，因为无法确认 gadget 的位置。

32 位机器上可以通过 nop sled 来进行强行爆破，但 64 位上就有难度了。

**④Canary**

- 泄露 Canary，因为每个线程不同函数的 Canary 都相同
- 只覆盖局部变量，不覆盖返回地址
- 修改 Thread-local Storage 中的 Canary

## 格式化字符串

## 堆溢出

https://www.bilibili.com/video/BV1LJ411n7w5/?spm_id_from=333.337.search-card.all.click&vd_source=61354e9e8f690736e47cbb79fe01421d

## IO

## 整数溢出
