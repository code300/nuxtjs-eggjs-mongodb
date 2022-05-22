'use strict'
const {
  Service,
} = require('egg')
const path = require('path')
const fse = require('fs-extra')
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
  // 给注册邮箱发邮件验证码，验证邮箱有效性
  async sendMail(email, subject, text, html) {
    // console.log(email, subject, text, html)
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
  // 合并切片文件
  async mergeFiled(filepPath, filehash, size) {
    // console.log(filepPath, filehash, size);
    // filepPath 即所有切片合并后的整图路径 /app/public/hash.png
    // size 切片chunk单片的尺寸
    // chunkdDir 以hash命名 存放切片chunk的文件夹 
    const chunkdDir = path.resolve(this.config.UPLOAD_DIR, filehash)
    if (!fse.existsSync(chunkdDir)) {
      await fse.mkdir(chunkdDir)
    }
    // console.log(999);
    // console.log(name,file);
    // await fse.move(file.filepath, `${chunkPath}/${name}`)
    // chunks是存放了N个切片的数组
    let chunks = await fse.readdir(chunkdDir)
    chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1])
    chunks = chunks.map(cp => path.resolve(chunkdDir, cp))
    await this.mergeChunks(chunks, filepPath, size)
  }
  // dest目标
  async mergeChunks(files, dest, size) {
    const pipStream = (filePath, writeStream) => new Promise(resolve => {
      const readStream = fse.createReadStream(filePath)
      readStream.on('end', () => {
        // 删除所有切片文件
        // fse.unlinkSync(filePath)
        resolve()
      })
      readStream.pipe(writeStream)
    })
    await Promise.all(
      files.map((file, index) => {
        // file 切片文件(二进制流文件) eggjs/app/public/hash/hash-index 文件
        // 将切片file写入到目标位置dest
        // size === CHUNK_SIZE === 1*1024*1024(1M/片)
        pipStream(file, fse.createWriteStream(dest, {
          start: index * size,
          end: (index + 1) * size,
        }))
      })
    )
  }
}

module.exports = ToolService