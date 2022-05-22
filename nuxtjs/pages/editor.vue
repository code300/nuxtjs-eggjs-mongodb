<template>
  <div class="my-editor">
    <div class="submit-container">
      <el-button
        type="primary"
        @click="submit"
      >提交</el-button>
    </div>
    <el-row>
      <el-col :span="12">
        <textarea
          class="markdown-editor"
          ref="editor"
          value="content"
          @input="update"
        ></textarea>
      </el-col>
      <el-col :span="12">
        <div
          class="markdown-display"
          v-html="compiledContent"
        ></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import marked from 'marked'
export default {
  data() {
    return {
      content: `# kkb`,
    }
  },
  mounted() {
    this.timer = null
    this.bindEvents()
  },
  computed: {
    compiledContent() {
      return marked(this.content, {})
    },
  },
  methods: {
    bindEvents(){
      this.$refs.editor.addEventListener('paste',async (e)=>{
        // console.log(e);
        const files = e.clipboardData.files
        // console.log(files,'files');
      })
      this.$refs.editor.addEventListener('drop',(e)=>{
        // console.log(e);
        const files = e.dataTransfer.files
        console.log(files,'files');
        e.preventDefault();
      })
    },
    // lodash/debounce
    update(e) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.content = e.target.value
      }, 350)
    },
    submit() {},
  },
}
</script>

<style lang="scss" scoped>
.my-editor {
  .submit-container {
    button {
      position: fixed;
      top: 10px;
      right: 30px;
      z-index: 100;
    }
  }
  .markdown-editor {
    width: 100%;
    height: 100vh;
    outline: none;
  }
}
</style>