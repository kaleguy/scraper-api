'use strict';

// mocha defines to avoid JSHint breakage
/* global describe, it, before, beforeEach, after, afterEach */

var swaggerTest = require('swagger-test');
var preq = require('preq');

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));

var assert = chai.assert;

var xamples;

describe('specification-driven tests setup', function () {

  before(function(done){
    preq.get({
        uri: 'http://localhost:8888/api-docs.json',
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(function(res){
        xamples = res.body;
        xamples = swaggerTest.parse(xamples);
        tests();
        done();
      })
  });

  // need this to allow tests() to run
  it('dummy', function(){
    return true;
  });


});

function tests(){
  describe('specification-driven tests', function() {
    xamples.forEach(function (xample) {
      it(xample.description, function () {
        xample.request.headers =   {'Accept': 'application/json'};
        return preq[xample.request.method](xample.request)
          .then(function (response) {
              assert.shallowDeepEqual(response, xample.responses[response.status]);
          });
      });
    });
  });
}
