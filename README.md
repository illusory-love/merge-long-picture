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


# 其它说明

- 在 `windows` 下，如果图片名为中文，则可能无法合成
- 在图片合成时，长图尺寸有上限
    - 目前测试：当宽度为 750px, 大于 42 时合成失败 750px * 42 = 31500px


# 历史更新

## v1.0.2

- `fixed` 修复缺少依赖项 `glob` 导致的报错

## v1.0.1

- `fixed` 修改错误的包依赖项