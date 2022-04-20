const fortune = require('../lib/fortune-cookie.js');

exports.home = function (req, res) {
  res.render('home');
};

exports.about = function (req, res) {
  res.render('about', {
    fortune: fortune.fortuneCookie(),
    pageTestScript: '/qa/tests-about.js',
  });
};

exports.thankYou = function (req, res) {
  res.render('thankyou');
};
