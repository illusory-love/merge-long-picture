import path from 'path'
import fs from 'fs-extra'
import glob from 'glob'
import math from 'math'
import imageInfo from 'image-info'
import colors from 'colors'
import nanoid from 'nanoid'
import imagemin from 'imagemin'
import imageminPngquant from 'imagemin-pngquant'
import {forEach, map} from 'async-array-methods'
import {createCanvas, loadImage} from 'canvas'

// 获取命令执行目录
const cwd = process.cwd()

export default async function ({files, vertical} = {}) {
    // 获取所有图片信息
    const arrPictureInfo = await map(files, async (file) => await asyncImageInfo(file));
    const arrWidth       = arrPictureInfo.map((info) => info.width);
    const arrHeight      = arrPictureInfo.map((info) => info.height);

    // 获取canvas需要的一些信息
    const maxWidth     = math.max(...arrWidth);
    const maxHeight    = math.max(...arrHeight);
    const sumWidth     = arrWidth.reduce((x, y) => x + y, 0);
    const sumHeight    = arrHeight.reduce((x, y) => x + y, 0);
    const canvasWidth  = vertical ? maxWidth : sumWidth;
    const canvasHeight = vertical ? sumHeight : maxHeight;

    // 初始化canvas
    const canvas = createCanvas(canvasWidth, canvasHeight)
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'rgba(0,0,0,0)';

    let x = 0;
    let y = 0;
    // 遍历所有图片进行绘制
    await forEach(files, async (image, i) => {

        console.info(`>>> 加载图片：${image}`.cyan)
        // 加载并获取图片对象
        const img = await loadImage(image).catch(err => {
            console.log(`loadImage ${err}`.red)
            process.exit(0)
        });
        const w   = arrWidth[i];
        const h   = arrHeight[i];
        // 开始绘制
        vertical || (x += w)
        vertical && (y += h)

        ctx.drawImage(img, x, y, w, h)
    })
    console.info(`>>> 正在合成`.cyan);
    const pictureBuffer = canvas.toBuffer('image/png');
    const buildPath     = path.join(cwd, 'build');

    if (!fs.existsSync(buildPath)){
        // 如果当前目录不存在，则创建
        fs.mkdirSync(buildPath)
    }

    const outFilename   = path.join(buildPath, `image_${nanoid()}.png`)

    // 在临时文件夹生成图片
    fs.writeFileSync(outFilename, pictureBuffer);

    console.info(`>>> 图片合成成功`.green)

    console.info(`>>> 正在压缩图片`.cyan)
    await imagemin([outFilename], buildPath, {
        plugins: [imageminPngquant({
            // quality: '70',
            // optimizationLevel: 1
        })]
    })
    .catch(err => {
        console.error(`压缩失败 ${err.toString('gb2312')}`.red)
        process.exit(0)
    })

    console.info(`>>> 图片生成成功：`.green)
    console.info(`>>> 共 ${files.length} 张`.green)
    console.info(`>>> 路径：${outFilename}`.green)
}

// 获取图片信息
function asyncImageInfo(file) {
    return new Promise((resolve, reject) => {
        imageInfo(file, (err, info) => err ? reject() : resolve(info))
    })
}
