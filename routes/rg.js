const assert = require('assert')
const restify = require('restify-clients')
const axios = require('axios')
const nconf = require('nconf')
const jsdom = require('jsdom');
const _ = require('lodash')
const { JSDOM } = jsdom
const moment = require('moment')

nconf.argv()
  .env()
  .file({ file: '.config.json' })

const url = 'https://www.researchgate.net'

function getDomList (dom, selector) {
  const items = []
  let els = dom.querySelectorAll(selector.selector)
  const subselectors = selector.subselectors
  els.forEach(el => {
    let item = {}
    _.each(subselectors, (s) => {
      let t = ''
      let propName = Object.keys(s)[0]
      let propSelector = s[propName]
      if (el.querySelector(propSelector)) {
        t = getDomText(el, propSelector)
      }
      item[propName] = t
    })
    items.push(item)
  })
  return items
}

function getDomText (dom, selector) {
  let text = ''
  if (_.isObject(selector)) {
    return getDomList(dom, selector)
  }
  let el = dom.querySelector(selector)
  if (el) {
    text = el.textContent.replace(/\s+·\s+/,'') // hack for garbage in rg text
    if (/^meta/.test(selector)) {
      console.log('meta')
      text = el.getAttribute('content')
    }
    if (el.tagName === 'A') {
      text = {
        href: el.getAttribute('href'),
        text: text
      }
    }
  }
  return text
}
function getDataFromSelectors (dom, selectors) {
  const data = {}
  _.each(selectors, (v, k) => {
    let t = getDomText(dom.window.document, v)
    if ((k === 'date') && t) {
      try {
        t = moment(t).format('YYYY-MM')
      } catch (e) {

      }
    }
    data[k] = t
    console.log('k================', k, t)
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

    const client = restify.createClient({url});
    client.get('/publication/' + id, function (err, req) {
      if (err) { console.log('Error:', err) }
      req.on('result', function (err, tres) {
        if (err) { console.log('Error result:', err) }
        console.log(' ======= In result =======')
        tres.body = ''
        tres.setEncoding('utf8')
        tres.on('data', function (chunk) {
          tres.body += chunk
        })
        tres.on('end', function () {
          console.log(' ====== In end =======')
          const body = tres.body
          const dom = new JSDOM(body)
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
          const data = getDataFromSelectors(dom, selectors)
          data.url = url + '/publication/' + id
          return res.json(data)
        })
      })
    })
  })

}
