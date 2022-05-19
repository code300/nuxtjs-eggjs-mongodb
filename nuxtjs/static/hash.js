/**
 * @description:
 * npm install --save spark-md5
 * 将module中的spark-md5.min.js复制到静态文件夹static中
 * webWorker方式引入文件到hash.js
 */
self.importScripts('spark-md5.min.js')
/**
 * @description: // 读取文件 接受的主线程传递的数据
 * @param FileReader 来自 node
 * @return {*}
 */
self.onmessage = e => {
    const {
        chunks
    } = e.data
    const spark = new self.SparkMD5.ArrayBuffer()
    let progress = 0
    let count = 0
    const loadNext = index => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(chunks[index].file)
        reader.onload = e => {
            count++
            spark.append(e.target.result)
            if (count == chunks.length) {
                self.postMessage({
                    progress: 100,
                    hash: spark.end()
                })
            } else {
                progress += 100 / chunks.length,
                    self.postMessage({
                        progress
                    })
                loadNext(count)
            }
        }
    }
    loadNext(0)
}