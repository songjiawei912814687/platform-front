const host = 'http://192.168.1.105';
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
    host: '192.168.1.105',
    port: 8083,
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/api-system': {
        target: `${host}:8769/`,
        changeOrigin: true,
      },
      '/users': {
        target: `${host}:8770/`,
        changeOrigin: true,
      },
      '/upload': {
        target: `http://10.32.250.84:8762/`,
        changeOrigin: true,
      },
    }, // string | Object
  },
};
