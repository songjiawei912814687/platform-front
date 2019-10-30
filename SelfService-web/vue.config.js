const host = 'http://192.168.2.130';

module.exports = {
  baseUrl: '/',
  outputDir: 'dist',
  devServer: {
    host: 'localhost',
    port: 8087,
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      /*'/user_guide':{
        target: `${host}:8779`,
        changeOrigin: true,
      },*/
      '/openquestion':{
        target: `${host}:8778/`,
        changeOrigin: true,
      },
      '/users': {
        target: `${host}:8779/`,
        changeOrigin: true,
      },
      '/api-selfservice': {
        target: `${host}:8769/`,
        changeOrigin: true,
      },
      '/uploadFile': {
        target: `${host}:8089/`,
        changeOrigin: true,
      },
      '/TempFolder': {
        target: `${host}:8779/`,
        changeOrigin: true,
      },
      '/upload': {
        target: `${host}:8762/`,
        changeOrigin: true,
      },
    },
  },
};
