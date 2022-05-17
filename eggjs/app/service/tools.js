'use strict'
const {
  Service,
} = require('egg')
const nodemailer = require('nodemailer')

const userEmail = 'code300@126.com'
const transporter = nodemailer.createTransport({
  service: '126',
  secureConnection: true,
  auth: {
    user: userEmail,
    // pass: '3325070366Zcl'
    pass: 'PZYBDRZRMHBRAWUY', // 邮箱设置开启imap/smtp 或 pop3/smtp获得授权码
  },
})


class ToolService extends Service {
  async sendMail(email, subject, text, html) {
    console.log(email, subject, text, html)
    const mailOptions = {
      from: userEmail, // sender address
      cc: userEmail, // list of receivers
      to: email,
      subject,
      text,
      html,
    }
    try {
      await transporter.sendMail(mailOptions)
      return true
    } catch (err) {
      console.log('email error', err)
      return false
    }
  }
}

module.exports = ToolService
