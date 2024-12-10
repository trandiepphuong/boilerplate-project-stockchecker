const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  test('Viewing one stock', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: 'AAPL' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body.stockData, 'stock');
        assert.property(res.body.stockData, 'price');
        assert.property(res.body.stockData, 'likes');
        done();
      });
  });

  test('Viewing one stock and liking it', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: 'AAPL', like: 'true' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isAbove(res.body.stockData.likes, 0);
        done();
      });
  });

  test('Viewing the same stock and liking it again', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: 'AAPL', like: 'true' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isAbove(res.body.stockData.likes, 0);
        done();
      });
  });

  test('Viewing two stocks', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: ['AAPL', 'GOOG'] })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.lengthOf(res.body.stockData, 2);
        done();
      });
  });

  test('Viewing two stocks and liking them', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({ stock: ['AAPL', 'GOOG'], like: 'true' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.lengthOf(res.body.stockData, 2);
        done();
      });
  });
});
