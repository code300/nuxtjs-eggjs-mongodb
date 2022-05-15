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
