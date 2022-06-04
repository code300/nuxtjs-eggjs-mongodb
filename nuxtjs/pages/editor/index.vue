<template>

  <div class="my-editor">
    <!-- <el-row contenteditable="true">
      嘻嘻嘻
    </el-row>
    document.execCommand('') -->
    <!-- 1.刚开始第三方的
    tinyMce, wangEditor
    2.开源的定制 slate.js
    3.有专门的编辑器开发团队，自己定制，非常复杂 word在线版
    计算位置，定位，样式，实现一个简单的浏览器工作量差不多的 -->
    <el-row class="submit-container">
      <el-button type="primary" @click="submit">提交</el-button>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12" class="markdown-editor-container">
        <textarea class="markdown-editor" ref="editor" value="content" @input="update"></textarea>
      </el-col>
      <el-col :span="12" class="markdown-display-container">
        <div class="markdown-display" v-html="compiledContent"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import marked from 'marked'
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/monokai-sublime.css'
export default {
  data() {
    return {
      content: `
      # kkb
      `
    }
  },
  mounted() {
    this.timer = null
    this.bindEvents()

    // 编辑器中代码高亮显示 还有其他扩展功能
    marked.setOptions({
      rendered: new marked.Renderer(),
      highlight(code) {
        return hljs.highlightAuto(code).value
      }
    })
  },
  computed: {
    compiledContent() {
      return marked(this.content, {})
    },
  },
  methods: {
    bindEvents() {
      this.$refs.editor.addEventListener('paste', async (e) => {
        // console.log(e);
        const files = e.clipboardData.files
        console.log(files, 'files');
        // @todo直接上传
      })
      this.$refs.editor.addEventListener('drop', async (e) => {
        // console.log(e);
        const files = e.dataTransfer.files
        console.log(files, 'files');
        // @todo 文件上传
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
    async submit() {
      // 文章列表，点赞， 关注， 草稿
      // user => article 一对多
      let res = await this.$http.post('article/create', {
        // selected: false //默认不显示
        content: this.content,
        compiledContent: this.compiledContent
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.my-editor {
  .submit-container {
    padding: 10px;
    display: flex;
    justify-content: right;
  }
  .markdown-editor-container {
    // height: calc(100vh - 70px);
    margin: 0;
    padding: 0;
    .markdown-editor {
      outline: none;
      width: 100%;
      // width: calc(100% - 10px);
      border: 1px solid #eee;
      background: red;
      height: calc(100vh - 71px);
      // padding: 0 10px;
    }
  }
  .markdown-display-container {
    .markdown-display {
      word-break: break-all;
      // width: calc(100% - 10px);
      height: calc(100vh - 67px);
      border: 1px solid #eee;
      // padding: 0 10px;
      background: orange;
    }
  }
}
</style>