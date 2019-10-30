const host = 'http://localhost';
// const host = 'http://10.32.250.88';
// const host = 'http://192.168.2.249';

module.exports = {
  baseUrl: '/',
  outputDir: 'dist',
  devServer: {
    host: 'localhost',
    port: 8088,
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/users': {
        target: `${host}:8778/`,
        changeOrigin: true,
      },
      '/api-knowledge': {
        target: `${host}:8769/`,
        changeOrigin: true,
      },
      '/uploadFile': {
        target: `${host}:8089/`,
        changeOrigin: true,
      },
      '/TempFolder': {
        target: `${host}:8767/`,
        changeOrigin: true,
      },
      '/upload': {
        target: `${host}:8762/`,
        changeOrigin: true,
      },
    },
  },
};
