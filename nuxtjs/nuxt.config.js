export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'front',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/element-ui',
    '@plugins/axios'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/proxy',
    // '@nuxtjs/axios',
  ],
  proxy: {
    "/api/": {
      target: "http://localhost:7001",
      secure: false,
      pathRewrite: {
        "^/api": ""
      }
    }
  },
  // axios: {
  //   // 开启代理 (如果需要判断线上线下环境，可以通过 process.env.NODE_ENV !== 'production' 来判断)
  //   proxy: true,
  //   // 给请求 url 加个前缀 /api，如果这项不配置，则需要手动添加到请求链接前面
  //   // 如果是多个代理的时候，则不需要配置，走手动添加代理前缀
  //   prefix: '/api',
  //   // 跨域请求时是否需要使用凭证
  //   credentials: true
  // },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
  },
}
