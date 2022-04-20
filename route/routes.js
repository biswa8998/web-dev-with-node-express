const mainHandlers = require('../route-handlers/main.js');
const vacationHandlers = require('../route-handlers/vacations.js');
const formidable = require('formidable');

module.exports = function (app) {
  /**
   * Routes
   */
  app.get('/', mainHandlers.home);

  app.get('/about', mainHandlers.about);

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

  // app.post('/newsletter', function (req, res) {
  //   const name = req.body.name || '';
  //   const email = req.body.email || '';

  //   if (!email.match(VALID_EMAIL_REGEX)) {
  //     if (req.xhr) {
  //       return res.json({ error: 'Invalid email address' });
  //     }

  //     req.session.flash = {
  //       type: 'danger',
  //       intro: 'Validation Error',
  //       message: 'The email address you entered is not valid',
  //     };

  //     return res.redirect(303, '/thank-you');
  //   }

  //   const NewsletterSignUp = function (data) {
  //     this.save = function (callback) {
  //       callback(null);
  //     };
  //   };

  //   new NewsletterSignUp({ name: name, email: email }).save(function (err) {
  //     if (err) {
  //       if (req.xhr) {
  //         return res.json({ error: 'Database Error' });
  //       }
  //       req.session.flash = {
  //         type: 'danger',
  //         intro: 'Database Error',
  //         message: 'There was a system error, please try again later',
  //       };
  //       return res.redirect(303, '/thank-you');
  //     }

  //     if (req.xhr) {
  //       return res.json({ success: true });
  //     }

  //     req.session.flash = {
  //       type: 'success',
  //       intro: 'Thank you!',
  //       message: 'You have now been signed up for the newsletter.',
  //     };
  //     return res.redirect(303, '/thank-you');
  //   });
  // });

  app.post('/process', function (req, res) {
    if (req.xhr || req.accepts('json', 'html') === 'json') {
      res.json({ success: true });
    } else {
      res.redirect(303, '/thank-you');
    }
  });

  app.get('/thank-you', mainHandlers.thankYou);

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

  app.get('/vacations', vacationHandlers.vacation);

  app.get('/epic-fail', function (req, res) {
    process.nextTick(function () {
      throw new Error('Kaboom!');
    });
  });
};
