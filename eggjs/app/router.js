'use strict'
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  // 针对需要token的页面 设置jwt,会在header携带token
  const jwt = app.middleware.jwt({ app })
  // 首页
  router.get('/', controller.home.index)
  // 验证码
  router.get('/captcha', controller.util.captcha)
  // 邮箱验证码
  router.get('/sendcode', controller.util.sendcode)
  // 文件上传
  router.post('/uploadfile', controller.util.uploadfile)
  // 合并切片文件
  router.post('/mergefile', controller.util.mergefile)
  // 前端上传文件之前先询问后端文件是否已存在(存在:true，不存在:false调用文件上传接口)
  router.post('/checkfile', controller.util.checkfile)
  // 用户模块
  router.group(
    {
      name: 'user',
      prefix: '/user', // 路由前缀
    },
    router => {
      const { info, register, login, verify, updateInfo,
        isfollow,
        follow, cancelFollow,
        following, followers,
        articleStatus,
        likeArticle, cancelLikeArticle } = controller.user

      // 登录
      router.post('/login', login)
      // 注册
      router.post('/register', register)
      // 验证用户登录态
      router.get('/verify', verify)
      // 针对需要token的页面 设置jwt,会在header获取token验证
      router.get('/info', jwt, info)
      router.put('/info', jwt, updateInfo)
      // 登录用户详情
      router.get('/detail', jwt, info)

      router.get('/follow/:id', jwt, isfollow)

      router.put('/follow/:id', jwt, follow)
      router.delete('/follow/:id', jwt, cancelFollow)

      router.get('/:id/following', following)
      router.get('/:id/followers', followers)

      router.get('/article/:id', jwt, articleStatus)

      // // .put点赞，。delete取消点赞
      router.put('/likeArticle/:id', jwt, likeArticle)
      router.delete('/likeArticle/:id', jwt, cancelLikeArticle)
    }
  )
  // 文章模块
  router.group({ name: 'article', prefix: '/article' }, router => {
    const { create, detail, index } = controller.article
    router.post('/create', jwt, create)
    router.get('/:id', detail)
    router.get('/', index)
  })
}
