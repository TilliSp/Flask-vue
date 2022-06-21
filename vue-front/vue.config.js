const { VuetifyLoaderPlugin } = require('vuetify-loader')

module.exports = {
    chainWebpack: config => {
      config.plugin('VuetifyLoaderPlugin').use(VuetifyLoaderPlugin).tap(args => [{
        progressiveImages: false
      }])
    }
  }