'use strict'
const svgCaptcha = require('svg-captcha')
const fse = require('fs-extra')
// const path = require('path')
const BaseController = require('./base')

class UtilController extends BaseController {
  // 验证码
  async captcha() {
    const captcha = svgCaptcha.create({
      // size: 4,
      // fontSize: 50,
      // width: 100,
      // height: 40,
      // noise: 3,
    })
    console.log('captcha=>', captcha.text)
    this.ctx.session.captcha = captcha.text
    this.ctx.response.type = 'image/svg+xml'
    this.ctx.body = captcha.data
  }

  // 需求分析：发送邮件是通用功能  发送验证码是业务功能
  async sendcode() {
    const {
      ctx,
    } = this
    const email = ctx.query.email
    const code = Math.random().toString().slice(2, 6)
    console.log('邮箱：' + email + '验证码：' + code)
    ctx.session.emailcode = code
    const subject = '邮箱验证码'
    const text = ''
    const html = `<h2><a href="www.baidu.com"><space>${code}</space></a></h2>`
    const hasSend = await this.service.tools.sendMail(email, subject, text, html)
    if (hasSend) {
      this.message('发送成功')
    } else {
      this.error('发送失败')
    }
  }

  // 文件上传
  async uploadfile() {
    console.log(this.ctx.request, '====================')
    const file = this.ctx.request.files[0]
    // const {
    //   name,
    // } = this.ctx.request.body
    await fse.move(file.filepath, this.config.UPLOAD_DIR + '/' + file.filename)
    this.success({
      url: `/public/${file.filename}`,
    })
  }
}

module.exports = UtilController
