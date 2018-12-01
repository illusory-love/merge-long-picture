import fs from 'fs-extra'
import path from 'path'
import glob from 'glob'
import colors from 'colors'
import {map} from 'async-array-methods'

import merge from './merge'


module.exports = async (folder) => {

	let cwd = process.cwd();
	let directory = '';
	// 判断当前目录是否存在
	if (fs.existsSync(folder)){
		directory = './' + folder;
	} 
	// 以命令执行目录为准，查询是否存在此目录
	else if (fs.existsSync(path.join(cwd, folder))){
		directory = path.join(cwd, folder);
	}

	if (directory){
		// 图片查找
		const files = glob.sync(`${directory}/*.{jp?(e)g,png,gif}`);

		if (files.length > 0){
			// 合成图片
			merge({files})
		} else {
			console.warn(`>>> 目录 ${folder} 中没有任何图片`.yellow);
		}
	} else {
		console.error(`>>> 目录 ${folder} 不存在`.red);
	}
}