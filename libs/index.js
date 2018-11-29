import path from 'path'
import fs from 'fs-extra'
import glob from 'glob'
import math from 'math'
import imageInfo from 'image-info'
import moment from 'moment'
import imagemin from 'imagemin'
import imageminPngquant from 'imagemin-pngquant'
import {forEach, map} from 'async-array-methods'
import {createCanvas, loadImage} from 'canvas'

import 'colors'

// 获取命令执行目录
const cwd = process.cwd()

export default async function (opts = {}) {
    // 获取当前默认的图片目录路径
    const gPath = path.join(cwd, `/images/person/*.{jp?(e)g,gif,png}`);
    // 获取对应的文件
    const files = glob.sync(gPath).slice(0, 10);
    
    // 获取所有图片信息
    const arrPictureInfo = await map(files, async (file) => await asyncImageInfo(file));
    const arrWidth       = arrPictureInfo.map((info) => info.width);
    const arrHeight      = arrPictureInfo.map((info) => info.height);

    // 获取canvas需要的一些信息
    const maxWidth     = math.max(...arrWidth);
    const maxHeight    = math.max(...arrHeight);
    const sumWidth     = arrWidth.reduce((x, y) => x + y, 0);
    const sumHeight    = arrHeight.reduce((x, y) => x + y, 0);
    const canvasWidth  = opts.vertical ? maxWidth : sumWidth;
    const canvasHeight = opts.vertical ? sumHeight : maxHeight;

    // 初始化canvas
    const canvas = createCanvas(canvasWidth, canvasHeight)
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'rgba(0,0,0,0)';

    let x = 0;
    let y = 0;
    // 遍历所有图片进行绘制
    await forEach(files, async (image, i) => {
        // 加载并获取图片对象
        const img = await loadImage(image).catch(err => console.log(`[${image}]: ${err}`.red));
        const w   = arrWidth[i];
        const h   = arrHeight[i];
        // 开始绘制
        opts.vertical || (x += w)
        opts.vertical && (y += h)

        ctx.drawImage(img, x, y, w, h)
    })

    const pictureBuffer = canvas.toBuffer('image/png');
    const outFilename   = path.join(cwd, `build/merge-pic${moment().format('mmssms')}.png`)
    // 在临时文件夹生成图片
    fs.writeFileSync(outFilename, pictureBuffer);

    const imageminResult = await imagemin([outFilename], 'build', {
        plugins: [imageminPngquant({
            // quality: '70',
            // optimizationLevel: 1
        })]
    })
    .catch(err => fs.writeFileSync('./error.log', err))

    // console.log(imageminResult)


    // fs.writeFileSync(outFilename, imageminResult);

    console.log('>>> 图片生成成功'.cyan)
}



// 获取图片信息
function asyncImageInfo(file) {
    return new Promise((resolve, reject) => {
        imageInfo(file, (err, info) => err ? reject() : resolve(info))
    })
}