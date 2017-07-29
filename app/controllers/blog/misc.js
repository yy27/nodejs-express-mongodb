var express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};
router.get('/', function (req, res, next) {
  res.redirect('/article');
});
router.get('/about', function (req, res, next) {
  res.render('blog/about', {
    title: 'about us'
  });
});
router.get('/contact', function (req, res, next) {
  res.render('blog/contact', {
    title: 'contact us'
  });
});
