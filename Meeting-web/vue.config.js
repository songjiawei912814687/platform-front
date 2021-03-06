const host = 'http://192.168.1.105';
// const host = 'http://localhost';
// const host = 'http://118.31.3.79';
// const host = 'http://10.32.250.88';


module.exports = {
  baseUrl: '/',
  outputDir: 'dist',
  devServer: {
    host: '192.168.1.105',
    port: 8083,
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/users': {
        target: `${host}:8773/`,
        changeOrigin: true,
      },
      '/api-meeting': {
        target: `${host}:8769/`,
        changeOrigin: true,
      },
      '/uploadFile': {
        target: `http://118.31.3.79:8089/`,
        changeOrigin: true,
      },
      '/upload': {
        target: `http://118.31.3.79:8762/`,
        changeOrigin: true,
      },
    },
  },
};
