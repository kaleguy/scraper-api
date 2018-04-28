const test = require('tape');
const request = require('supertest');
const server = require('../index.js');
const assert = require('assert');

// no headers set
test('weather route', function(t) {
  request(server)
    .get('/weather/new york')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      t.error(err);
      assert(res.body.name === 'New York');
      server.close();
      t.end();
    });
});

// headers set to text
test('weather route text response', function(t) {
  request(server)
    .get('/weather/new york')
    .set('Accept', 'text/plain')
    .expect(200)
    .expect('Content-Type', /text\/plain/)
    .end(function(err, res) {
      t.error(err);
      const body = JSON.parse(res.text);
      assert(body.name === 'New York');
      server.close();
      t.end();
    });
});
