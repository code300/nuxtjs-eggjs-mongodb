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
    <div class="upload-btn-box">
      <el-button
        type="primary"
        @click="uploadFile"
      >上传</el-button>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.bindEvents()
  },
  data() {
    return {
      file: null,
      uploadProgress: 0,
    }
  },
  methods: {
    // 提交请求 发送文件到后端
    async uploadFile() {
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
    .el-progress-bar__innerText{
      color:black
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


