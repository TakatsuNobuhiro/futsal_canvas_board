export default {
  publicRuntimeConfig: {
    API_KEY : process.env.API_KEY,
    AUTH_DOMAIN : process.env.AUTH_DOMAIN,
    DATABASE_URL : process.env.DATABASE_URL,
    PROJECT_ID : process.env.PROJECT_ID,
    STORAGE_BUCKET : process.env.STORAGE_BUCKET,
    MESSAGING_SENDER_ID : process.env.MESSAGING_SENDER_ID,
    APP_ID : process.env.APP_ID,
    MEASUREMENT_ID : process.env.MEASUREMENT_ID,
  },
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'フットサル戦術ボード',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'フットテック式web版フットサル戦術ボード' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/image/board.png' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/firebase.js']
  ,

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt'
  ],
  generate: {
    dir: 'public'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
}
