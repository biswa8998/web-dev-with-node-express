const express = require('express');
const fortune = require('./lib/fortune-cookie.js');
const path = require('path');
const bodyParser = require('body-parser');
const formidable = require('formidable');

const app = express();

app.disable('x-powered-by');

// setup handlebars view engine
const handlebars = require('express-handlebars').create({
  defaultLayout: 'main',
  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
  },
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '/public')));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.set('port', process.env.PORT || 9000);

app.use(function (req, res, next) {
  res.locals.showTests =
    app.get('env') !== 'production' && req.query.test === '1';

  next();
});

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/about', function (req, res) {
  res.render('about', {
    fortune: fortune.fortuneCookie(),
    pageTestScript: '/qa/tests-about.js',
  });
});

app.get('/tours/hood-river', function (req, res) {
  res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', function (req, res) {
  res.render('tours/request-group-rate');
});

app.get('/headers', function (req, res) {
  res.type('text/plain');
  let s = '';
  for (const name in req.headers) {
    s += name + ':' + req.headers[name] + '\n';
  }

  res.send(s);
});

app.get('/newsletter', function (req, res) {
  res.render('newsletter', { csrf: 'CSRF token goes here' });
});

app.post('/process', function (req, res) {
  if (req.xhr || req.accepts('json', 'html') === 'json') {
    res.json({ success: true });
  } else {
    res.redirect(303, '/thank-you');
  }
});

app.get('/thank-you', function (req, res) {
  res.render('thankyou');
});

app.get('/contests/vacation-photo', function (req, res) {
  const now = new Date();
  res.render('contests/vacation-photo', {
    year: now.getFullYear(),
    month: now.getMonth(),
  });
});

app.post('/contests/vacation-photo/:year/:month', function (req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    if (err) {
      return res.redirect(303, '/error');
    }

    console.log('received fields: ');
    console.log(fields);
    console.log('received files: ');
    console.log(files);
    res.redirect(303, '/thank-you');
  });
});

// custom 404 page
app.use(function (req, res) {
  res.status(404);
  res.render('404');
});

// custom 500 page
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log(
    'Server started on http://localhost:' +
      app.get('port') +
      ', press Ctrl + C to terminate'
  );
});
