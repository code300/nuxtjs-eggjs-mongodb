'use strict'
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  // const conn = app.mongooseDB.get('db1')
  // 连接数据库的校验规范
  const UserSchema = new Schema({
    __v: {
      type: Number,
      select: false,//设置false不会被查询 返回前端
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false, //设置false不会被查询 返回前端
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
  // 第三个参数不写默认是第一个参数User的复试，具体写入到数据库的表名称
  return mongoose.model('User', UserSchema, 'User')
}
