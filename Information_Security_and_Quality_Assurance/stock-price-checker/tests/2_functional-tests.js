/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog' })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.stock, "GOOG");
          assert.property(res.body, "price");
          assert.isAtLeast(res.body.price, 0.1, 'The stock price should be greater than .1');
          assert.equal(res.body.likes, 0);
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'nflx', like: true })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.stock, "NFLX");
          assert.property(res.body, "price");
          assert.isAtLeast(res.body.price, 0.1, 'The stock price should be greater than .1');
          assert.equal(res.body.likes, 1);
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'nflx', like: true })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "You're not allowed to like the same stock twice, sorry.");
          done();
        });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: ['aapl', 'msft'] })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body[0].stock, 'AAPL');
          assert.equal(res.body[1].stock, 'MSFT');
          assert.isAtLeast(res.body[0].price, 0.1, 'The first stock price should be greater than .1');
          assert.isAtLeast(res.body[1].price, 0.1, 'The second stock price should be greater than .1');
          done();
        })
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: ['aapl', 'msft'], like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body[0].stock, 'AAPL');
          assert.equal(res.body[1].stock, 'MSFT');
          assert.isAtLeast(res.body[0].price, 0.1, 'The first stock price should be greater than .1');
          assert.isAtLeast(res.body[1].price, 0.1, 'The second stock price should be greater than .1');
          assert.isAtMost(res.body[0].rel_likes, 0, 'The AAPL stock should have equal relative likes to MSFT since it was just added.');
          assert.isAtLeast(res.body[1].rel_likes, 0, 'The MSFT stock should have equal relative likes to AAPL since it was just added.');
          done();
        })
      });
      
    });

});
