<template>
  <div class="upload">
    <div
      class="drag"
      ref="drag"
    >
      <input
        type="file"
        ref="uploadInput"
        @change="handleFileChange"
      >
    </div>
    <div class="progress-box">
      <el-progress
        :text-inside="true"
        :percentage="uploadProgress"
        :stroke-width="26"
      ></el-progress>
    </div>
    <div class="progress-hash">
      <p>计算hashProgress</p>
      <el-progress
        :text-inside="true"
        :percentage="hashProgress"
        :stroke-width="26"
      ></el-progress>
    </div>
    <div class="upload-btn-box">
      <el-button
        type="primary"
        @click="uploadFile"
      >上传</el-button>
    </div>
  </div>
</template>

<script>
import {
  isGif,
  isPng,
  isJpg,
  createFileChunk,
  calculateHashWorker,
  calculateHashIdle,
  calculateHashSample,
} from '../utils'
import sparkMD5 from 'spark-md5'
// 文件切成单片的颗粒度
// const CHUNK_SIZE = 10 * 1024 * 1024   //10M/片
const CHUNK_SIZE = 0.1 * 1024 * 1024 //0.1M/片
export default {
  mounted() {
    this.bindEvents()
  },
  data() {
    return {
      file: null,
      uploadProgress: 0,
      hashProgress: 0,
      chunks: [],
    }
  },
  methods: {
    // 根据业务需求 增加图片格式的判断
    async isImage(file) {
      return (await isGif(file)) || (await isPng(file)) || (await isJpg(file))
    },
    // 提交请求 发送文件到后端
    async uploadFile() {
      // const isImage = await this.isImage(this.file)
      // if (!isImage) {
      //   console.log('格式错误')
      // } else {
      //   console.log('格式正确')
      // }
      // 上传同一个文件 web-worker/时间切片/抽样等方式计算的md5的hash值一样 证明计算方式没问题
      // 文件切片 可以控制文件片段的颗粒度大小CHUNK_SIZE
      this.chunks = createFileChunk(this.file, CHUNK_SIZE)
      // web-worker方式计算md5的hash值
      const hashWorker = await calculateHashWorker(
        this.chunks,
        this.hashProgress
      )
      // 时间切片方式计算md5的hash值
      const hashIdle = await calculateHashIdle(
        sparkMD5,
        this.chunks,
        this.hashProgress
      )
      // 抽样方式计算md5的hash值
      const hashSample = await calculateHashSample(
        sparkMD5,
        this.file,
        this.hashProgress
      )
      console.log(this.chunks, 'chunks')
      console.log('hashWorker:', hashWorker)
      console.log('hashIdle:', hashIdle)
      console.log('hashSample:', hashSample)
      return
      const form = new FormData()
      form.append('name', 'file')
      form.append('file', this.file)
      await this.$http
        .post('/uploadfile', form, {
          onUploadProgress: (progress) => {
            this.uploadProgress = Number(
              ((progress.loaded / progress.total) * 100).toFixed(2)
            )
          },
        })
        .then((res) => {
          this.uploadProgress = 0
          this.file = null
          this.$refs.uploadInput.value = ''
          //上传成功回调-清理工作
          this.$message({
            message: res.data.message ? res.data.message : '上传成功',
            type: 'success',
          })
        })
        .catch((err) => {
          this.$message.error(err ? err : '上传失败')
        })
    },
    // 监听文件上传  点击文件上传功能实现
    handleFileChange(e) {
      const [file] = e.target.files
      if (!file) return
      this.file = file
    },
    // 拖拽文件上传功能实现
    bindEvents() {
      const drag = this.$refs.drag
      drag.addEventListener('dragover', (e) => {
        drag.style.borderColor = 'red'
        e.preventDefault()
      })
      drag.addEventListener('dragleave', (e) => {
        drag.style.borderColor = '#eee'
        e.preventDefault()
      })
      drag.addEventListener('drop', (e) => {
        const fileList = e.dataTransfer.files
        drag.style.borderColor = '#eee'
        this.file = fileList[0]
        e.preventDefault()
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.upload {
  padding: 30px;
  .drag {
    width: 100%;
    height: 150px;
    border: 2px dashed #eee;
    text-align: center;
    line-height: 150px;
    // &:hover {
    //   border-color: red;
    // }
  }
  /deep/ .el-progress {
    .el-progress-bar__innerText {
      color: black;
    }
    margin-top: 20px;
  }
  .upload-btn-box {
    text-align: center;
    button {
      width: 100px;
      margin-top: 20px;
    }
  }
}
</style>


