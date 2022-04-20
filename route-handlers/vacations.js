const Vacation = require('../models/vacation.js');

exports.vacation = function (req, res) {
  Vacation.find({ available: true }, function (error, vacations) {
    let context = { vacations: [] };
    if (!error) {
      context = {
        vacations: vacations.map(function (vacation) {
          return {
            sku: vacation.sku,
            name: vacation.name,
            description: vacation.description,
            price: vacation.getDisplayPrice(),
            inSeason: vacation.inSeason,
          };
        }),
      };
    }

    res.render('vacations', context);
  });
};
