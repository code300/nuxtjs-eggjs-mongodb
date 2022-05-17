'use strict'
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const BaseController = require('./base')

const HashSalt = 'balabala'
const createRule = {
  nickname: {
    type: 'string',
  },
  email: {
    type: 'email',
  },
  captcha: {
    type: 'string',
  },
  password: {
    type: 'string',
  },
}
class UserController extends BaseController {
  // 登录校验
  async login() {
    // this.message('token')
    // this.success({name:'kkb'})
    // this.error('参数校验失败', -1, e.errors)
    const {
      ctx,
      app,
    } = this
    const {
      email,
      password,
      captcha,
    } = ctx.request.body
    // 验证码是否是后端随机生成的
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')
    }
    // 密码是否存在数据库
    const user = await ctx.model.User.findOne({
      email,
      password: md5(password + HashSalt),
    })
    if (!user) {
      return this.error('邮箱或密码错误')
    }
    // 将用户信息加密成token返回
    const token = jwt.sign({
      _id: user._id,
      email,
    }, app.config.jwt.secret, {
      expiresIn: '1h',
    })
    this.success({
      token,
      email,
      nickname: user.nickname,
    })
  }

  // 注册校验
  async register() {
    const {
      ctx,
    } = this
    try {
      // 校验传递的参数
      ctx.validate(createRule)
    } catch (e) {
      return this.error('参数校验失败', -1, e.errors)
    }
    const {
      email,
      password,
      captcha,
      nickname,
      emailcode,
    } = ctx.request.body

    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')
    }

    // 邮箱验证码
    if (emailcode !== ctx.session.emailcode) {
      return this.error('邮箱验证码错误')
    }

    if (await this.checkEmail(email)) {
      this.error('邮箱已注册')
    } else {
      const res = await ctx.model.User.create({
        email,
        nickname,
        password: md5(password + HashSalt),
      })
      if (res._id) {
        this.message('注册成功')
      }
    }
    // this.success({name:'kkb'})
  }
  // 检查邮箱是否已注册
  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({
      email,
    })
    return user
  }

  async verify() {
    console.log(99)
  }

  async info() {
    const {
      ctx,
    } = this
    const {
      email,
    } = ctx.state
    const user = await this.checkEmail(email)
    this.success(user)
  }


}

module.exports = UserController
