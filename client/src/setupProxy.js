const createProxyMiddleware = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    ['/users','/companies','/invoices','/products','/employee'],
    createProxyMiddleware({
      target: 'http://localhost:5000',
    })
  );
};