import path from 'path'
import glob from 'glob'
import colors from 'colors'
import {map} from 'async-array-methods'

import merge from './merge'

module.exports = async (args) => {
	// 获取当前的图片数量
	const imgs = args.split(',');
	// 是否符合成要求
	if (imgs.length < 2){
		console.error(`至少需要 2 张图片`.red);
		process.exit(0);
	}

	const notFiles = []
	const files    = await map(imgs, (img) => {
		// 匹配图片
		const file = glob.sync(`./${img}.{jp?(e)g,png,gif}`);
		// 记录不存在的图片
		file[0] || notFiles.push(img)

		return file[0];
	})

	if (notFiles.length > 0){
		console.error(`以下图片不存在：${notFiles.join(',')}`.red);
		process.exit(0);
	}

	if (files.length > 1){
		// 合成图片
		merge({files})
	}
	else{
		console.error(`filter Error: 有效图片必须大于 2 张`.red)
	}
}