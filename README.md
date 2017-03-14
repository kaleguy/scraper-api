[![Dependency Status](https://david-dm.org/kaleguy/simpleweatherproxy.svg)](https://david-dm.org/kaleguy/simpleweatherproxy)

## Synopsis

A simple wrapper for the [OpenWeatherMap API](https://openweathermap.org/api) using Restify (version 4).

## Motivation

Simple boilerplate and demo to:

* Create a restify server to proxy OpenWeatherMap
* Document the routes with Swagger JSDocs
* Create tests with Swagger Test

This project was originally created to be used with 
[another demo project](https://github.com/kaleguy/simpleng2admin) hosted on Github pages.
There is a not a free endpoint on https from OpenWeatherMap and Github pages are served
via https, so a proxy is necessary.

## Installation

Rename .config.example.json to .config.json, edit with your openWeather API key. Then

```
npm install
npm run start
```

## API Reference

Swagger Docs generated from inline Swagger comments, processed by Swagger-JSDocs. 
Check out the source for more info.

[Swagger UI](https://tranquil-headland-86417.herokuapp.com/public/swagger/index.html)

## Tests

Linter and basic Jasmine test:
```
npm test
```
Tests generated from Swagger Docs:
```
npm run api-tests
```


## License

MIT
