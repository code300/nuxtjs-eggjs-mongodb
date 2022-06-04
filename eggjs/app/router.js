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
      const { info, register, login, verify } = controller.user

      // 登录
      router.post('/login', login)
      // 注册
      router.post('/register', register)
      // 验证用户登录态
      router.get('/verify', verify)
      // 针对需要token的页面 设置jwt,会在header获取token验证
      router.get('/info', jwt, info)
      // 登录用户详情
      router.get('/detail', jwt, info)
    }
  )
  // 文章模块
  router.group({ name: 'article', prefix: '/article' }, router => {
    const { index } = controller.article
    router.get('/', index)
  })
}
