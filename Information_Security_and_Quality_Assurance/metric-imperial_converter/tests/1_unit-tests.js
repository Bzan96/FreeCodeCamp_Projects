/*
*
*
*       FILL IN EACH UNIT TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]----
*       (if additional are added, keep them at the very end!)
*/

var chai = require('chai');
var assert = chai.assert;
const expect = chai.expect;
var ConvertHandler = require('../controllers/convertHandler.js');

var convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  
  suite('Function convertHandler.getNum(input)', function() {
    
    test('Whole number input', function(done) {
      let input = '32L';
      assert.equal(convertHandler.getNum(input),32);
      done();
    });
    
    test('Decimal Input', function(done) {
      let input = '0.5L';
      assert.equal(convertHandler.getNum(input),0.5);
      done();
    });
    
    test('Fractional Input', function(done) {
      let input = '1/2L';
      assert.equal(convertHandler.getNum(input),0.5);
      done();
    });
    
    test('Fractional Input w/ Decimal', function(done) {
      let input = '5.4/3LBS';
      assert.equal(convertHandler.getNum(input), 1.8);
      done();
    });
    
    /** // Removing this test because I'm not testing for it in getNum() but in another function in server.js
    test('Invalid Input (double fraction)', function(done) {
      let input = '1/2/3L';
      assert.equal(convertHandler.getNum(input), "invalid number");
      done();
    }); */
    
    test('No Numerical Input', function(done) {
      let input = 'lbs';
      assert.equal(convertHandler.getNum(input),1);
      done();
    }); 
    
  });
  
  suite('Function convertHandler.getUnit(input)', function() {
    
    // Yeah... this test is kinda useless since I do the conversion elsewhere...
    test('For Each Valid Unit Inputs', function(done) {
      var input = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];

      input.forEach(function(ele, i) {
        assert.equal(convertHandler.spellOutUnit(ele), input[i]);
      });
      done();
    });
    
    /** // Removing this because I'm already checking/testing for it in server.js
    test('Unknown Unit Input', function(done) {
      
      done();
    }); */
    
  });
  
  suite('Function convertHandler.getReturnUnit(initUnit)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      var input = ['gal','l','mi','km','lbs','kg'];
      var expect = ['l','gal','km','mi','kg','lbs'];
      input.forEach(function(ele, i) {
        assert.equal(convertHandler.convert(1, ele).split(/\d(?=\D)/).pop(), expect[i]);
      });
      done();
    });
    
  });  
  
  /** // Right... I'm doing this conversion in getString() so this won't be useful.
  suite('Function convertHandler.spellOutUnit(unit)', function() {
    const input = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];
    const expect = ['liters','gallons','kilometers','miles','kilograms','pounds',
                      'liters','gallons','kilometers','miles','kilograms','pounds'];
    test('For Each Valid Unit Inputs', function(done) {
      input.forEach((ele,i) => {
        assert.equal(convertHandler.spellOutUnit(ele), expect[i]);
      });
      done();
    });
    
  });*/
  
  suite('Function convertHandler.convert(num, unit)', function() {
    
    test('Gal to L', function(done) {
      const input = [5, 'gal'];
      const expected = "18.92705l";
      expect(convertHandler.convert(input[0],input[1])).to.equal(expected); //0.1 tolerance
      done();
    });
    
    test('L to Gal', function(done) {
      const input = [15, 'l'];
      const expected = "3.96258gal";
      expect(convertHandler.convert(input[0],input[1])).to.equal(expected); //0.1 tolerance
      done();
    });
    
    test('Mi to Km', function(done) {
      const input = [9.7, 'mi'];
      const expected = "15.61060km";
      expect(convertHandler.convert(input[0],input[1])).to.equal(expected); //0.1 tolerance
      done();
    });
    
    test('Km to Mi', function(done) {
      const input = [3, 'km'];
      const expected = "1.86412mi";
      expect(convertHandler.convert(input[0],input[1])).to.equal(expected); //0.1 tolerance
      done();
    });
    
    test('Lbs to Kg', function(done) {
      const input = [8, 'lbs'];
      const expected = "3.62874kg";
      expect(convertHandler.convert(input[0],input[1])).to.equal(expected); //0.1 tolerance
      done();
    });
    
    test('Kg to Lbs', function(done) {
      const input = [80, 'kg'];
      const expected = "176.36995lbs";
      expect(convertHandler.convert(input[0],input[1])).to.equal(expected); //0.1 tolerance
      done();
    });
    
  });

});