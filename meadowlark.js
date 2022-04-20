const express = require('express');

const path = require('path');
const bodyParser = require('body-parser');

const credentials = require('./credentials.js');
const http = require('http');

const route = require('./route/routes.js');

// express application
const app = express();
app.disable('x-powered-by');

// logging
switch (app.get('env')) {
  case 'production':
    app.use(
      require('express-logger')({
        path: path.join(__dirname, 'log/request.log'),
      })
    );
    break;
  case 'development':
    app.use(require('morgan')('dev'));
    break;
}

// database setting
const mongoose = require('mongoose');
switch (app.get('env')) {
  case 'production':
    mongoose.connect(
      credentials.mongo.production.connectionString,
      function () {
        console.log('Production database connected');
      }
    );
    break;
  case 'development':
    mongoose.connect(
      credentials.mongo.development.connectionString,
      function () {
        console.log('Development database connected');
      }
    );
    break;
  default:
    throw new Error('Unknown execution environment: ' + app.get('env'));
}

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

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());

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

app.use(function (req, res, next) {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

app.use(function (req, res, next) {
  const cluster = require('cluster');
  if (cluster.isWorker) {
    console.log(`Worker id ${cluster.worker.id} received request`);
  }
  next();
});

// connecting with routes
route(app);

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

// eslint-disable-next-line space-before-function-paren
function startServer() {
  http.createServer(app).listen(app.get('port'), function () {
    console.log(
      `Mode: ${app.get('env')} || Started server http://localhost:${app.get(
        'port'
      )}. Press Ctrl + C to stop...`
    );
  });
}

if (require.main === module) {
  // application run directly; start app server
  startServer();
} else {
  module.exports = startServer;
}

// app.listen(app.get('port'), function () {});
