'use strict'
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {
    router,
    controller,
  } = app

  const jwt = app.middleware.jwt(app)

  router.get('/', controller.home.index)
  // 验证码
  router.get('/captcha', controller.util.captcha)
  // 邮箱验证码
  router.get('/sendcode', controller.util.sendcode)
  // 文件上传
  router.post('/uploadfile', controller.util.uploadfile)
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

    router.post('/login', login)
    router.post('/register', register)
    router.get('/verify', verify)
    // 针对需要token的页面 设置jwt,会在header携带token
    router.get('/info', jwt, info)
  })


}