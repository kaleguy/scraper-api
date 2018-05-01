[![Build Status](https://travis-ci.org/kaleguy/simpleweatherproxy.svg?branch=master)](https://travis-ci.org/kaleguy/simpleweatherproxy)
[![Dependency Status](https://david-dm.org/kaleguy/simpleweatherproxy.svg)](https://david-dm.org/kaleguy/simpleweatherproxy)
[![Coverage Status](https://coveralls.io/repos/github/kaleguy/simpleweatherproxy/badge.svg?branch=master)](https://coveralls.io/github/kaleguy/simpleweatherproxy?branch=master)

## Synopsis

A proxy to provide a basic JSON API to ResearchGate.

Currently there are two endpoints implemented, one for informatio about a particular article, the other for information about an author. See the Swagger docs (below) for more info.

Example:
```
http://localhost:8888/rg/article?title=282790843_Differences_in_Media_Preference_Mediate_the_Link_Between_Personality_and_Political_Orientation
```

The existing endpoint can be easily adapted to scrape a different site.


To scrape the page referenced above, the following selectors are configured in the endpoint:

```
const selectors = {
  pubdate: 'meta[property="citation_publication_date"]',
  title: 'h1.nova-e-text--size-xxxl',
  cits: '.ga-resources-citations span.publication-resource-link-amount',
  refs: '.ga-resources-references span.publication-resource-link-amount',
  date: '.publication-meta-date',
  reads: '.publication-meta-stats',
  journal: '.publication-meta-journal A',
  abstract: '.publication-abstract .nova-e-text--spacing-auto',
  authors: {
    selector: '.publication-author-list__item',
    subselectors: [
      { name: '.nova-v-person-list-item__title A' },
      { rating: '.nova-v-person-list-item__meta SPAN:first-child' },
      { institution: '.nova-v-person-list-item__meta LI:nth-child(2) SPAN' }
    ]
  }
}
```

Sample output for the above url:

```
{
   "pubdate":"2015/10/01",
   "title":"Differences in Media Preference Mediate the Link Between Personality and Political Orientation",
   "cits":"6",
   "refs":"62",
   "date":"2015-10",
   "reads":"2,632 Reads",
   "journal":{
      "href":"journal/1467-9221_Political_Psychology",
      "text":"Political Psychology"
   },
   "abstract":"Research has consistently demonstrated that political liberalism is predicted by the personality trait Openness to Experience and conservatism by trait Conscientiousness. Less well studied, however, is how trait personality influences political orientation. The present study investigated whether differences in media preference might mediate the links between personality and political orientation. Participants completed measures of Big Five personality, media preferences, and political orientation. Results revealed that increased preferences for Dark/Alternative and Aesthetic/Musical media genres, as well as decreased preferences for Communal/Popular media genres, mediated the association between Openness to Experience and liberalism. In contrast, greater preferences for Communal/Popular and Thrilling/Action genres, as well as lower preferences for Dark/Alternative and Aesthetic/Musical genres mediated the link between Conscientiousness and conservatism.",
   "authors":[
      {
         "name":{
            "href":"https://www.researchgate.net/profile/Xiaowen_Xu4",
            "text":"Xiaowen Xu"
         },
         "rating":"14.72",
         "institution":"University of Toronto"
      },
      {
         "name":{
            "href":"https://www.researchgate.net/profile/Jordan_Peterson2",
            "text":"Jordan B Peterson"
         },
         "rating":"39.79",
         "institution":"University of Toronto"
      }
   ],
   "url":"https://www.researchgate.net/publication/282790843_Differences_in_Media_Preference_Mediate_the_Link_Between_Personality_and_Political_Orientation"
}
```

 
Implemented with Restify (version 7).

## Installation

Note: if you want the weather demo endpoint to be functional,
rename .config.example.json to .config.json, edit with your openWeather API key.

To install and run:

```
npm install
npm start
```

## Swagger-JSDoc and Swagger-Test

This project uses the swagger-jsdoc module, which allows for documenting endpoints inline with Swagger YAML:
(The example below below is for the example Open Weather API endpoint.

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

When running locally the Swagger UI will be reachable at http://localhost:8888/public/swagger/index.html

Online version:

[Swagger UI](https://tranquil-headland-86417.herokuapp.com/public/swagger/index.html)

The hosted version of this project currently does not have a functional ResearchGate endpoint due to constraints on Heroku. However, as of this moment the api works correctly when run locally. The Swagger docs and Weather endpoint do work on the hosted version.

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
