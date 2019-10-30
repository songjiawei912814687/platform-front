const host = 'http://localhost';

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
      '/users': {
        target: `${host}:8782/`,
        changeOrigin: true,
      },
      '/api-assistdecision': {
        target: `${host}:8769/`,
        changeOrigin: true,
      },
    },
  },
};
