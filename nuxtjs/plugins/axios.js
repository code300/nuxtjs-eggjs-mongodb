import Vue from 'vue'
import axios from 'axios'
import {
  MessageBox
} from 'element-ui'
let service = axios.create({
  timeout: 5000,
  // api前缀
  baseURL: '/api'
})

export default ((store, redirect) => {
  // const TOKEN_KEY = 'USER_TOKEN'
  // 请求拦截  主要做token的管理
  service.interceptors.request.use(
    config => {
      const token = window.localStorage.getItem('token')
      if (token) {
        // 'Bearer '空格
        config.headers.common['Authorization'] = 'Bearer ' + token
      }
      return config
    }
  )
  // 响应拦截
  service.interceptors.response.use(
    async response => {
      let {
        data
      } = response
      if (data.code === -666) {
        MessageBox.confirm('登录已过期', '过期', {
          confirmButtonText: '登录',
          showCancelButton: false,
          type: 'warning',
        }).then(() => {
          localStorage.removeItem('token')
          redirect({
            path: 'login'
          })
        })
      }
      return data
    }
  )
})



Vue.prototype.$http = service

export const http = service