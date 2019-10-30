// const host = 'http://10.32.250.88';
// const host = 'http://localhost';
const host = 'http://192.168.0.106';
// const host = 'http://118.31.3.79';

module.exports = {
  baseUrl: '/',
  outputDir: 'dist',
  devServer: {
    host: '192.168.0.106',
    port: 8087,
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/users': {
        target: `${host}:8776/`,
        changeOrigin: true,
      },
      '/api-feedback': {
        target: `${host}:8769/`,
        changeOrigin: true,
      },
      '/uploadFile': {
        target: `${host}:8089/`,
        changeOrigin: true,
      },
      '/TempFolder': {
        target: `${host}:8776/`,
        changeOrigin: true,
      },
      '/upload': {
        target: `${host}:8762/`,
        changeOrigin: true,
      },
    },
  },
};
