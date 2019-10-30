// const host = 'http://localhost';
const host = 'http://192.168.1.106';
// const host = 'http://118.31.3.79';

module.exports = {
  baseUrl: '/',
  outputDir: 'dist',
  devServer: {
    host: '192.168.1.106',
    port: 8085,
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/users': {
        target: `${host}:8775/`,
        changeOrigin: true,
      },
      '/api-message': {
        target: `${host}:8769/`,
        changeOrigin: true,
      },
      '/uploadFile': {
        target: `http://118.31.3.79:8089/`,
        changeOrigin: true,
      },
      '/TempFolder': {
        target: `${host}:8767/`,
        changeOrigin: true,
      },
      '/upload': {
        target: `http://118.31.3.79:8762/`,
        changeOrigin: true,
      },
    },
  },
};
