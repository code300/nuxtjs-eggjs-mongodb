<template>
  <div class="kkb-container">
    <UserDisplay :user="article.author">
      <el-button
        v-if="isFollow"
        type="success"
        @click="cancelfollow"
      >
        已关注
      </el-button>
      <el-button v-else @click="follow">
        关注
      </el-button>
    </UserDisplay>

    <el-divider />
    <div class="article" v-html="article.article_html" />
    <el-divider />
    <el-button :type="likeStatus ? 'success' : 'default'" @click="likeAction">
      <i class="el-icon-thumb">{{ article.like }}</i>
    </el-button>
  </div>
</template>

<script>
import UserDisplay from '~/components/UserDisplay.vue'
export default {
  components: { UserDisplay },
  data () {
    return {
      isFollow: false,
      likeStatus: false,
      dislikeStatus: false,
      article: {
        title: '',
        author: {}
      }
    }
  },
  mounted () {
    const { id } = this.$route.params
    this.id = id
    this.getArticle()

    // 用户已登录
    const token = localStorage.getItem('KKB_USER_TOKEN')
    this.token = token
  },
  methods: {
    async getLikeStatus () {
      // 修改likeStatus
      const ret = await this.$http.get('/user/article/' + this.id)
      if (ret.code == 0) {
        this.likeStatus = ret.data.like
        this.dislikeStatus = ret.data.dislike
      }

      // if(ret.code==0){
      // this.likeStatus = ret.data.like
      // this.dislikeStatus = ret.data.dislike
      // }
    },
    async likeAction () {
      // 点赞和取消
      const type = this.likeStatus ? 'delete' : 'put'

      const ret = await this.$http[type]('/user/likeArticle/' + this.id)
      if (ret.code == 0) {
        // 取巧，简单粗暴
        this.getArticle()
        // this.getLikeStatus()
        this.$notify({
          title: ret.message,
          type: 'success'
        })
      }
    },

    async getArticle () {
      const ret = await this.$http.get('/article/' + this.id)
      this.article = ret.data
      if (this.token) {
        this.checkFollowStatus()
        this.getLikeStatus()
      }
    },
    async checkFollowStatus () {
      // 获取关注状态
      const ret = await this.$http.get('/user/follow/' + this.article.author._id)
      if (ret.code == 0) {
        this.isFollow = ret.data.isFollow
      }
    },
    async follow () {
      const ret = await this.$http.put('/user/follow/' + this.article.author._id)
      this.checkFollowStatus()
    },
    async cancelfollow () {
      const ret = await this.$http.delete(
        '/user/follow/' + this.article.author._id
      )
      this.checkFollowStatus()
    }
  }
}
</script>

<style>
.article {
	padding: 10px;
}

.rotate {
	transform: rotate(180deg);
}
</style>
