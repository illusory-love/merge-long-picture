# 介绍

主要功能为将多张图片拼接成一张长图

用于 css animation steps 使用


# 安装

```bash
$ npm i merge-long-picture -g
```


# 使用

## 命令

merge <cmd> <params>

- <cmd>: img   指定一组图片（图片名称），以 "," 分隔
- <cmd>: dir   指定一个文件夹，将读取此文件夹内所有的图片（仅取第一层）

```bash
$ merge img 001,002,003
$ merge dir foldername
```

## 输出

合成的图片输出至当前目录的 `build` 文件夹



