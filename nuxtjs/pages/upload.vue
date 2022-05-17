<template>
  <div>
    <input
      type="file"
      @change="handleFileChange"
    >
    <el-button
      type="primary"
      @click="uploadFile"
    >上传</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      file: null,
    }
  },
  methods: {
    // 提交文件到后端
    async uploadFile() {
      const form = new FormData()
      form.append('name', 'file')
      form.append('file', this.file)
      console.log(form, 'form')
      await this.$http
        .post('/uploadfile', form)
        .then((res) => {
          this.$message({
            message: '上传成功',
            type: 'success',
          })
        })
        .catch((err) => {
          this.$message.error(err ? err : '上传失败')
        })
    },
    // 监听文件上传
    handleFileChange(e) {
      const [file] = e.target.files
      console.log(e.target.files,1111);
      console.log([file], 'file')
      if (!file) return
      this.file = file
    },
  },
}
</script>


