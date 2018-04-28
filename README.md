[![Build Status](https://travis-ci.org/kaleguy/simpleweatherproxy.svg?branch=master)](https://travis-ci.org/kaleguy/simpleweatherproxy)
[![Dependency Status](https://david-dm.org/kaleguy/simpleweatherproxy.svg)](https://david-dm.org/kaleguy/simpleweatherproxy)
[![Coverage Status](https://coveralls.io/repos/github/kaleguy/simpleweatherproxy/badge.svg?branch=master)](https://coveralls.io/github/kaleguy/simpleweatherproxy?branch=master)

## Synopsis

A proxy to provide a basic JSON API to ResearchGate.

Also demos a simple wrapper for the [OpenWeatherMap API](https://openweathermap.org/api).
 
Implemented with Restify (version 4).

## Installation

Rename .config.example.json to .config.json, edit with your openWeather API key. Then

```
npm install
npm start
```

## Swagger-JSDoc and Swagger-Test

Using the swagger-jsdoc module allows you to document your code inline with Swagger YAML:

```
  /**
   * @swagger
   * /weather/{city}:
   *   get:
   *     description: "Returns current weather in the specified city to the caller"
   *     summary: "Get Weather by City"
   *     tags: [Weather]
   *     parameters:
   *       - name: city
   *         in: path
   *         description: "The city you want weather for in the form city,state,country"
   *         required: true
   *         type: string
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: |-
   *           weather response
   *         schema:
   *           $ref: "#/definitions/report"
   *     x-amples:
   *     - description: Get Weather
   *       request:
   *         params:
   *          city: NYC
   *       responses:
   *          200:
   *            headers:
   *               content-type: "application/json; charset=utf-8"
   *            body:
   *               name: 'New York'
   *
   */
```
The swagger-jsdoc module converts this into swagger json, which you can then view with the Swagger UI webapp, see next
section.

The x-amples section in the comments above will be turned into a test by swagger-test, see the testing section below.

## API Reference

Swagger Docs generated from inline Swagger comments, processed by Swagger-JSDocs. 
Check out the source for more info. 

[Swagger UI](https://tranquil-headland-86417.herokuapp.com/public/swagger/index.html)

## Tests

Tests generated from Swagger Docs (also runs linter):
```
npm run test-api
```

There are also a couple more test suites for reference.
Jasmine tests:

```
npm test
```

Tape/Supertest tests:
```
npm run test-agent
```

## Coverage

Create coverage report with Istanbul, send to Coveralls to keep a record.
```
npm run coverage
```

## License

MIT
