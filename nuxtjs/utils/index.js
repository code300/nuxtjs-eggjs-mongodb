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