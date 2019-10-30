// const host = 'http://192.168.2.130';
//
// const host = 'http://118.31.3.79';
const host = 'http://10.32.250.88';
// const host = 'http://localhost';

module.exports = {
  baseUrl: '/',
  outputDir: 'dist',
  devServer: {
    host: 'localhost',
    port: 8086,
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/getToken': {
        target: `${host}:8769/`,
        changeOrigin: true,
      },
      '/api-api': {
        target: `${host}:8769/`,
        changeOrigin: true,
      },
      '/uploadFile': {
        target: `http://10.32.250.84:8089/`,
        changeOrigin: true,
      },
      '/TempFolder': {
        target: `${host}:8767/`,
        changeOrigin: true,
      },
      '/upload': {
        target: `http://10.32.250.84:8762/`,
        changeOrigin: true,
      },
      /*'/screen-api': {
        target: `${host}:8777/`,
        changeOrigin: true,
        pathRewrite: {
          '^/screen-api': '/'
        }
      },*/
    },
  },
};

