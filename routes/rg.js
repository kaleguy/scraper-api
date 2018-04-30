const scraper = require('../lib/scraper')

const nconf = require('nconf')

nconf.argv()
  .env()
  .file({ file: '.config.json' })

const url = 'https://www.researchgate.net'

module.exports = function (server) {

  /**
   * @swagger
   * /rg/article:
   *   get:
   *     description: "Returns ResearchGate article info."
   *     summary: "Get ResearchGate article info"
   *     tags: [ResearchGate]
   *     parameters:
   *       - name: title
   *         in: query
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
    const id = req.query.title
    const selectors = {
      pubdate: 'meta[property="citation_publication_date"]',
      title: 'h1.nova-e-text--size-xxxl',
      citations: '.ga-resources-citations span.publication-resource-link-amount',
      references: '.ga-resources-references span.publication-resource-link-amount',
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
    scraper.scrape(selectors, url, '/publication/', id, res)
  })

  /**
   * @swagger
   * /rg/author:
   *   get:
   *     description: "Returns ResearchGate author info."
   *     summary: "Get ResearchGate author info"
   *     tags: [ResearchGate]
   *     parameters:
   *       - name: name
   *         in: query
   *         description: "The Author name"
   *         required: true
   *         default: Jordan_Peterson2
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
  server.get('/rg/author', function (req, res, next) {
    const id = req.query.name
    const selectors = {
      score: 'DIV[title="RG Score"]',
      title: 'SPAN.title',
      name: 'H1 SPAN',
      institution: '.info-header A:first-child',
      department: '.info-header A:nth-child(2)',
      researchItems: 'DIV.section-about>DIV:nth-child(2) .nova-o-grid.nova-o-grid--gutter-xxl.nova-o-grid--order-normal.nova-o-grid--horizontal-align-left.nova-o-grid--vertical-align-top DIV>DIV',
      reads: 'DIV.section-about>DIV:nth-child(2) .nova-o-grid.nova-o-grid--gutter-xxl.nova-o-grid--order-normal.nova-o-grid--horizontal-align-left.nova-o-grid--vertical-align-top DIV:nth-child(2)>DIV',
      citations: 'DIV.section-about>DIV:nth-child(2) .nova-o-grid.nova-o-grid--gutter-xxl.nova-o-grid--order-normal.nova-o-grid--horizontal-align-left.nova-o-grid--vertical-align-top DIV:nth-child(3)>DIV'
    }
    scraper.scrape(selectors, url, '/profile/', id, res)
  })

}
