const assert = require('assert')
const restify = require('restify')
const nconf = require('nconf')
const jsdom = require('jsdom');
const _ = require('lodash')
const { JSDOM } = jsdom
const moment = require('moment')

nconf.argv()
  .env()
  .file({ file: '.config.json' });

function getDomText (dom, selector) {
  let text = ''
  let el = dom.window.document.querySelector(selector)
  if (el) {
    text = el.textContent.replace(/\s+·\s+/,'')
  }
  return text
}
function getDataFromSelectors (dom, selectors) {
  const data = {}
  _.each(selectors, (v, k) => {
    let t = getDomText(dom, v)
    if (k === 'date') {
      t = moment(t).format('YYYY-MM')
    }
    data[k] = t
  })
  return data
}

module.exports = function (server) {

  /**
   * @swagger
   * /rg/article/{id}:
   *   get:
   *     description: "Returns ResearchGate article info."
   *     summary: "Get ResearchGate article info"
   *     tags: [ResearchGate]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: "The ResearchGate article Id"
   *         required: true
   *         type: string
   *         consumes:
   *           - application/json
   *           - application/text
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         headers:
   *           content-type: "text/plain"
   */
  server.get('/rg/article/:id', function (req, res, next) {
    var id = req.params.id;
    // id = '304662727_Ideological_Reactivity_Political_Conservatism_and_Brain_Responsivity_to_Emotional_and_Neutral_Stimuli'

    const host = 'www.researchgate.net';

    // Creates a JSON client
    const client = restify.createClient({
      url: 'https://' + host
    });

    client.get('/publication/' + id, function(err, req) {
      assert.ifError(err); // connection error

      req.on('result', function(err, response) {
        assert.ifError(err); // HTTP status code >= 400

        response.body = '';
        response.setEncoding('utf8');
        response.on('data', function(chunk) {
          response.body += chunk;
        });

        response.on('end', function() {
          const body = response.body
          const dom = new JSDOM(body);
          const selectors = {
            title: 'h1.nova-e-text--size-xxxl',
            cits: 'h1.nova-e-text--size-xxxl',
            refs: 'span.publication-resource-link-amount',
            date: '.publication-meta-date',
            abstract: '.publication-abstract .nova-e-text--spacing-auto'
          }
          // publication-author-list
          const foobar = dom.window.document.querySelectorAll('.publication-author-list__item')
          console.log(foobar)
          const data = getDataFromSelectors(dom, selectors)
          res.json(data)
        });
      });
    });

  });

};
