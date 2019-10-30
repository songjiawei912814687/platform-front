// const host = 'http://localhost';
// const host = 'http://118.31.3.79';
const host = 'http://10.32.250.88';
// const host = 'http://192.168.1.105';

module.exports = {
  baseUrl: '/',
  outputDir: 'dist',
  devServer: {
    // host: '192.168.1.105',
    port: 8081,
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/users': {
        target: `${host}:8771/`,
        changeOrigin: true,
      },
      '/api-personnel': {
        target: `${host}:8769/`,
        changeOrigin: true,
      },
      '/uploadFile': {
        target: `http://10.32.250.84:8089/`,
        changeOrigin: true,
      },
      '/TempFolder': {
        target: `${host}:8771/`,
        changeOrigin: true,
      },
      '/upload': {
        target: `http://10.32.250.84:8762/`,
        changeOrigin: true,
      },
        '/api-system': {
            target: `${host}:8769/`,
            changeOrigin: true,
        },
    },
  },
};
