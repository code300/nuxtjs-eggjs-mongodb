'use strict'
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  // const conn = app.mongooseDB.get('db1')
  // 连接数据库的校验规范
  const UserSchema = new Schema({
    __v: {
      type: Number,
      select: false,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    nickname: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
      default: '/user.png',
    },
  }, {
    timestamps: true,
  })
  // 第三个参数不写默认是User的复试，具体写入到的数据库表名称
  return mongoose.model('User', UserSchema, 'User')
}
