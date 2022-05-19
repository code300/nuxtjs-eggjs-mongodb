/*
 * @Author: code300 
 * @Date: 2022-05-We 11:12:03 
 * @Last Modified by:   code300 
 * @Last Modified time: 2022-05-We 11:12:03 
 */

// @todo 读取二进制流文件(也能读取宽高) 并 转为16进制字符串
export const blobToString = async (blob) => {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = function () {
            const ret = reader.result.split('')
                .map(v => v.charCodeAt())
                .map(v => v.toString(16).toUpperCase())
                .map(v => v.padStart(2, '0')) //单个字符的用0填充空位
                .join(' ')
            resolve(ret)
        }
        reader.readAsBinaryString(blob)
    })
}
// @todo 16进制字符串截取 图片表头前位数 判断图片格式
export const isPng = async (file) => {
    const ret = await blobToString(file.slice(0, 8))
    const ispng = (ret == "89 50 4E 47 0D 0A 1A 0A")
    return ispng
}

export const isJpg = async (file) => {
    const len = file.size
    const start = await blobToString(file.slice(0, 2))
    const end = await blobToString(file.slice(-2, len))
    const isjpg = (start == "FF D8") && (end == "FF D9")
    return isjpg
}

export const isGif = async (file) => {
    const ret = await blobToString(file.slice(0, 6))
    const isgif = (ret == "47 49 46 38 39 61") || (ret == "47 49 46 38 37 61")
    return isgif
}

/**
 * @description: 
 * @param file 上传的文件
 * @param CHUNK_SIZE 文件片段的大小即颗粒度
 * @return {*}
 */
// 将上传的大文件切片,创建文件片段 即颗粒度
export const createFileChunk = (file, size) => {
    const chunks = []
    let cur = 0
    while (cur < file.size) {
        chunks.push({
            index: cur,
            file: file.slice(cur, cur + size)
        })
        cur += size
    }
    return chunks
}
/**
 * @description: 
 * @param chunks    文件片段
 * @param hashProgress 计算的hash值进度条
 * @return {*}
 */
//  BGL 利用浏览器空闲时间 重新创建一个进程web-Worker计算md5的Hash值
export const calculateHashWorker = async (chunks = [], hashProgress = 0) => {
    return new Promise(resolve => {
        const worker = new Worker('./hash.js')
        worker.postMessage({
            chunks: chunks
        })
        worker.onmessage = e => {
            const {
                progress,
                hash
            } = e.data
            hashProgress = Number(progress.toFixed(2))
            if (hash) {
                resolve(hash)
            }
        }
    })
}
//  React中Fiber原理 时间切片方式计算md5的hash值
export const calculateHashIdle = async (sparkMD5, chunks = [], hashProgress = 0) => {
    return new Promise(resolve => {
        const spark = new sparkMD5.ArrayBuffer()
        let count = 0
        const appendToSpark = async file => {
            return new Promise(resolve => {
                const reader = new FileReader()
                reader.readAsArrayBuffer(file)
                reader.onload = e => {
                    spark.append(e.target.result)
                    resolve()
                }
            })
        }
        const workLoop = async (deadline) => {
            while (count < chunks.length && deadline.timeRemaining() > 1) {
                // 空闲时间 有任务时
                await appendToSpark(chunks[count].file)
                count++
                if (count < chunks.length) {
                    hashProgress = Number((100 * count) / chunks.length).toFixed(2)
                } else {
                    hashProgress = 100
                    resolve(spark.end())
                }
            }
            window.requestIdleCallback(workLoop)
        }
        window.requestIdleCallback(workLoop)
    })
}
// 抽样方式计算MD5hash值
export const calculateHashSample = (sparkMD5, file, hashProgress) => {
    return new Promise(resolve => {
        const spark = new sparkMD5.ArrayBuffer()
        const reader = new FileReader()
        // const file = file
        const size = file.size
        const offset = 2 * 1024 * 1024
        // 第一个2M 最后一个区块数据全要
        let chunks = [file.slice(0, offset)]
        let cur = offset
        while (cur < size) {
            // 中间的，取前中后各两个字节
            if (cur + offset >= size) {
                // 最后一个区块
                chunks.push(file.slice(cur, cur + offset))
            } else {
                // 中间的区块
                const mid = cur + offset / 2
                const end = cur + offset
                chunks.push(file.slice(cur, cur + 2))
                chunks.push(file.slice(mid, mid + 2))
                chunks.push(file.slice(end - 2, end))
            }
            cur += offset
        }
        reader.readAsArrayBuffer(new Blob(chunks))
        reader.onload = e => {
            spark.append(e.target.result)
            hashProgress = 100
            resolve(spark.end())
        }
    })
}