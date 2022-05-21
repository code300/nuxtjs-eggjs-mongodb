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
      <p>整个文件一次上传</p>
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
    <div>
      <!-- 
      chunk.progress<0 报错 显示红色
      chunk.progress==100 成功
      别的数字 方块高度显示
       -->
      <!-- 尽可能让方块进度条看起来像正方形10=4*4 9=3*3 -->
      <!-- <pre>
        {{chunks | json}}
      </pre> -->
      <div
        class="cube-container"
        :style="{width:cubeWidth+'px'}"
      >
        <!-- <pre>
        {{chunks}}
      </pre> -->
        <div
          class="cube"
          v-for="chunk in chunks"
          :key="chunk.name"
        >
          <div
            :class="{
            'uploading':chunk.progress>0 && chunk.progress<100,
            'success':chunk.progress==100,
            'error':chunk.progress<0
          }"
            :style="{height:chunk.progress+'%'}"
          >
            <i
              class="el-icon-loading"
              style="color:#f56c6c"
              v-if="chunk.progress>0 && chunk.progress<100"
            ></i>
          </div>
        </div>
      </div>
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
const CHUNK_SIZE = 1 * 1024 * 1024   //1M/片
// const CHUNK_SIZE = 0.1 * 1024 * 1024 //100K/片
export default {
  mounted() {
    this.bindEvents()
  },
  data() {
    return {
      file: null,
      // uploadProgress: 0,
      hashProgress: 0,
      chunks: [],
      hash: '',
    }
  },
  computed: {
    cubeWidth() {
      return Math.ceil(Math.sqrt(this.chunks.length)) * 16
    },
    // 实现网格进度条
    uploadProgress() {
      if (!this.file || this.chunks.length) {
        return 0
      }
      const loaded = this.chunks.map(
        // 累加
        (item) =>
          item.chunk.size + item.progress.reduce((acc, cur) => acc + cur, 0)
      )
      return Number(((loaded * 100) / this.file.size).toFixed(2))
    },
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
      // await this.uploadUnchunks()
      await this.uploadChunks()
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
    // 文件上传方案2--切片方式
    async uploadChunks() {
      // 上传同一个文件 web-worker/时间切片/抽样等方式计算的md5的hash值一样 证明计算方式没问题

      // 准备工作：文件切片 可以控制文件片段的颗粒度大小CHUNK_SIZE
      const chunks = createFileChunk(this.file, CHUNK_SIZE)
      // 计算切片hash值方案1：web-worker创建一个浏览器新进程计算md5的hash值
      // const hashWorker = await calculateHashWorker(
      //   chunks,
      //   this.hashProgress
      // )
      // 计算切片hash值方案2：利用浏览器空闲时间计算md5的hash值
      // const hashIdle = await calculateHashIdle(
      //   sparkMD5,
      //   chunks,
      //   this.hashProgress
      // )
      // 计算切片hash值方案3：抽样方式计算md5的hash值
      // 特点：抽样hash不算全量，损失一小部分的精度，换取效率（布隆过滤器）
      const hashSample = await calculateHashSample(
        sparkMD5,
        this.file,
        this.hashProgress
      )
      console.log('chunks', chunks)
      // console.log('hashWorker:', hashWorker)
      // console.log('hashIdle:', hashIdle)
      console.log('hashSample:', hashSample)
      this.hash = hashSample
      // 建议：抽样hash不算全量的缺点，可采用两个hash配合的方式
      // chunks数据重组
      this.chunks = chunks.map((chunk, index) => {
        // 切片的 name = this.hash + index 命名
        const name = this.hash + '-' + index
        // return还可以加文件type, 手动添加属性和默认值progress: 0
        return { name, hash: this.hash, index, chunk: chunk.file, progress: 0 }
      })
      // 发请求
      const requests = this.chunks
        // 获取formData数据
        .map((chunk, index) => {
          // 转成promise
          const form = new FormData()
          form.append('name', chunk.name)
          form.append('hash', chunk.hash)
          form.append('index', chunk.index)
          form.append('chunk', chunk.chunk)
          form.append('chunkIndex',chunk.index)
          return form
        })
        // 每个切片的进度条
        .map((form, index) => {
          this.$http.post('/uploadfile', form, {
            onUploadProgress: (progress) => {
              // 是每个切片的进度条，整体的进度条需要计算出来
              // console.log(this.chunks)
              // console.log(progress)
              this.chunks[index].progress = Number(
                ((progress.loaded / progress.total) * 100).toFixed(2)
              )
            },
          })
        })
      // @todo 并发量控制
      await Promise.all(requests)
      await this.mergeRequest()
    },
    // 文件上传方案1--正常整文件上传
    async uploadUnchunks() {
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
          // this.uploadProgress = 0
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
    async mergeRequest() {
      await this.$http.post('/mergefile', {
        ext: this.file.name.split('.').pop(),
        size: CHUNK_SIZE,
        hash: this.hash,
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
  .cube-container {
    .cube {
      width: 14px;
      height: 14px;
      line-height: 12px;
      border: 1px black solid;
      background: #eee;
      float: left;
      .success {
        background: #67c23a;
      }
      .uploading {
        background: #409eff;
      }
      .error {
        background: #f56c6c;
      }
    }
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


