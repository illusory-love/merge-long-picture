// import merge from './libs/index'

// merge()

import program from 'commander'

import {version} from './package.json'

program
    .version(`v${version}`)
    .option('-d --dir <directory>', '图片目录')
    .option('-i --img <images>', '指定一组图片(>= 1)')
    .parse(process.argv)