'use strict'
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {
    router,
    controller,
  } = app
  // 针对需要token的页面 设置jwt,会在header携带token
  const jwt = app.middleware.jwt(app)
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
  // 后端检测前端要上传的文件是否在后端存在
  router.post('/checkfile', controller.util.checkfile)


  // prefix: '/user' 路由前缀
  router.group({
    name: 'user',
    prefix: '/user',
  }, router => {
    const {
      info,
      register,
      login,
      verify,
    } = controller.user

    // 登录
    router.post('/login', login)
    // 注册
    router.post('/register', register)
    // 验证用户登录态
    router.get('/verify', verify)
    // 针对需要token的页面 设置jwt,会在header获取token
    router.get('/info', jwt, info)
  })


}