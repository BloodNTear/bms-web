const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://192.168.10.211:3000',  // <-- your backend server
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': '', 
      },
    })
  );
};
