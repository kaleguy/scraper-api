'use strict';

// mocha defines to avoid JSHint breakage
/* global describe, it, before, beforeEach, after, afterEach */

const server = require('../index.js');
const swaggerTest = require('swagger-test');
const preq = require('preq');

const chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));

const assert = chai.assert;

let xamples;

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
        if (! xample.request.headers) {
          xample.request.headers = {'Accept': 'application/json'};
        }
        return preq[xample.request.method](xample.request)
          .then(function (response) {
            xample.finished = true;
            assert.shallowDeepEqual(response, xample.responses[response.status]);
            checkXamplesFinished();
          });
      });
    });
  });
}

function checkXamplesFinished(){

  let finished = true;
  xamples.forEach(function(xample){
    if (! xample.finished){
      finished = false;
    }
  });
  if (finished){
    server.close();
  }

}
