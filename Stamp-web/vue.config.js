const host = 'http://127.0.0.1';
// const host = 'http://118.31.3.79';
// const host = 'http://10.32.250.88';

module.exports = {
  baseUrl: '/',
  outputDir: 'dist',
  transpileDependencies: [
    /\/node_modules\/vue-echarts\//,
    /\/node_modules\/resize-detector\//
  ],
  devServer: {
    host: 'localhost',
    port: 8083,
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/api-stamp': {
        target: `${host}:8769/`,
        changeOrigin: true,
      },
      '/users': {
        target: `${host}:8783/`,
        changeOrigin: true,
      },
      '/uploadFile': {
        target: `http://118.31.3.79:8089/`,
        changeOrigin: true,
      },
      
      '/TempFolder': {
        target: `http://127.0.0.1:8780/`,
        changeOrigin: true,
      },
      '/upload': {
        target: `http://118.31.3.79:8763/`,
        changeOrigin: true,
      },
    }, // string | Object
  },
};
