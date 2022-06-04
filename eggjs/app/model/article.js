'use strict'
// 建立数据库模型

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const ArticleSchema = new Schema(
    {
      _v: { type: Number, select: false },
      title: { type: String, required: true },
      article: { type: String, required: true, select: false },
      article_html: { type: String, required: true },
      author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      views: {
        type: Number,
        required: true,
        default: 0,
      },
      like: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    { timestamp: true }
  )
  return mongoose.model('Article', ArticleSchema, 'Article')
  // article 数据库表名称  ArticleSchema数据库数据
}
