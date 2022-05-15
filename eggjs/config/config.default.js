/* eslint valid-jsdoc: "off" */

'use strict'
const path = require('path')
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  // controller里app.config来获取
  const config = exports = {}
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  // =========config开始============
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1652347812115_9210'
  // add your middleware config here
  config.middleware = []
  // 前端post 后端是否做安全校验
  config.security = {
    csrf: {
      enable: false,
    },
  }
  // egg-mongoose插件配置
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1:27017/kkbhub',
      options: {
        // mongos: true,
        // user: 'root',
        // pass: 'root',
        // dbName: 'kkbhub',
      },
      // easymock: {
      //   url: 'mongodb://localhost:27017/easy-mock',
      //   options: {
      //     useNewUrlParser: true,
      //   },
      // }
    },
  }
  // 登录密码md5加密的盐
  config.jwt = {
    secret: 'balabala',
  }
  // 设置白名单 任何文件都能传方便测试
  config.multipar = {
    mode: 'file',
    whitelist: () => true,
  }
  // 前端上传图片的保存路径
  config.UPLOAD_DIR = path.resolve(__dirname, '..', 'app/public')
  // ==========config结束===========

  // egg-sequelize 和 egg-mongoose 默认都是加载 app/model 下的文件
  // egg-mongoose 是不能配置的，源码里面写死了指定的 model 路径， egg-sequelize 是可以的
  // config.sequelize = {
  //   baseDir: 'my_model', // load all models to `app[delegate]` and `ctx[delegate]`, default to `model`
  //   delegate: 'myModel', // load all models to `app[delegate]` and `ctx[delegate]`, default to `model`
  //   dialect: 'mysql',
  //   host: process.env.MYSQL_HOST,
  //   port: 3306,
  //   database: process.env.MYSQL_DATABASE,
  //   username: process.env.MYSQL_USER,
  //   password: process.env.MYSQL_PASSWORD
  // }
  return {
    ...config,
    ...userConfig,
  }
}
