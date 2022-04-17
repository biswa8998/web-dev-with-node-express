const fortune = require('../../lib/fortune-cookie.js');
const expect = require('chai').expect;

suite('Fortune cookie tests', function () {
  test('getFortune() should return a fortune', function () {
    expect(typeof fortune.fortuneCookie() === 'string');
  });
});
