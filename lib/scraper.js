const assert = require('assert')
const restify = require('restify-clients')
const nconf = require('nconf')
const jsdom = require('jsdom');
const _ = require('lodash')
const { JSDOM } = jsdom
const moment = require('moment')

module.exports = function (url) {
  let module = {};

  /**
   *
   * @param selectors {object} Object with css selectors for plucking data
   * @param section {string} e.g. /profile/, the subpath in the target API for a particular endpoint
   * @param id {string} id for path, e.g. name of author
   * @param res {object} the restify response object
   */
  module.scrape = function scrape (selectors, section, id, res) {
    const client = restify.createClient({url});
    client.get(section + id, function (err, req) {
      if (err) { console.log('Error:', err) }
      req.on('result', function (err, tres) {
        if (err) { console.log('Error result:', err) }
        tres.body = ''
        tres.setEncoding('utf8')
        tres.on('data', function (chunk) {
          tres.body += chunk
        })
        tres.on('end', function () {
          const body = tres.body
          const dom = new JSDOM(body)
          const data = getDataFromSelectors(dom, selectors)
          data.url = url + section + id
          return res.json(data)
        })
      })
    })
  }

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
      text = el.textContent.replace(/\s+·\s+/,'').trim() // hack for garbage in rg text
      if (/^meta/.test(selector)) {
        console.log('meta')
        text = el.getAttribute('content').trim()
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
    })
    return data
  }

  return module
}
