const assert = require('assert')
const restify = require('restify-clients')
const nconf = require('nconf')
const jsdom = require('jsdom');
const _ = require('lodash')
const { JSDOM } = jsdom
const moment = require('moment')

nconf.argv()
  .env()
  .file({ file: '.config.json' })

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
    if ((k === 'date') && t) {
      try {
        t = moment(t).format('YYYY-MM')
      } catch (e) {

      }
    }
    data[k] = t
  })
  return data
}

module.exports = function (server) {

  /**
   * @swagger
   * /rg/article/{title}:
   *   get:
   *     description: "Returns ResearchGate article info."
   *     summary: "Get ResearchGate article info"
   *     tags: [ResearchGate]
   *     parameters:
   *       - name: title
   *         in: path
   *         description: "The ResearchGate article title"
   *         required: true
   *         default: 304662727_Ideological_Reactivity_Political_Conservatism_and_Brain_Responsivity_to_Emotional_and_Neutral_Stimuli
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
  server.get('/rg/article', function (req, res, next) {
    var id = req.query.title
    console.log('.............=========', id)
    // id = '304662727_Ideological_Reactivity_Political_Conservatism_and_Brain_Responsivity_to_Emotional_and_Neutral_Stimuli'

    const host = 'www.researchgate.net'

    // Creates a JSON client
    const url = 'https://' + host
    const client = restify.createClient({ url });
    console.log('VVV 7=============url: ', url + '/publication/' + id)
    client.get('/publication/' + id, function (err, req) {

      if (err) { console.log('Error:', err) }

      // assert.ifError(err) // connection error

      req.on('result', function (err, response) {
        console.log('VERSION 7=========================xxxxxxxx===========')
        // assert.ifError(err) // HTTP status code >= 400
        if (err) { console.log('Error result:', err) }

        response.body = ''
        response.setEncoding('utf8')
        response.on('data', function (chunk) {
          response.body += chunk
        })
        // .name
        response.on('end', function () {
          const body = response.body
          const dom = new JSDOM(body)
          const selectors = {
            title: 'h1.nova-e-text--size-xxxl',
            cits: 'h1.nova-e-text--size-xxxl',
            refs: 'span.publication-resource-link-amount',
            date: '.publication-meta-date',
            abstract: '.publication-abstract .nova-e-text--spacing-auto'
          }
          console.log('ccccccxxxxxxxxxx')
          // publication-author-list
          const foobar = dom.window.document.querySelectorAll('.publication-author-list__item')
          console.log(foobar)
          const data = getDataFromSelectors(dom, selectors)
          return res.json(data)
        })
      })
    })
  })

}
