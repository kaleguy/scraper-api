
const nconf = require('nconf')

nconf.argv()
  .env()
  .file({ file: '.config.json' })

module.exports = function (server) {

  const scraper = require('../lib/scraper')('https://www.researchgate.net')

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
      citations:
        [
          'DIV.nova-e-text.nova-e-text--size-m.nova-e-text--family-sans-serif.nova-e-text--spacing-none.nova-e-text--color-inherit.publication-resources-summary__see-all-count strong',
          '.ga-resources-citations span.publication-resource-link-amount'
        ],
      references: [
        'DIV.nova-o-pack__item:nth-child(2) DIV.nova-e-text.nova-e-text--size-m.nova-e-text--family-sans-serif.nova-e-text--spacing-none.nova-e-text--color-inherit.publication-resources-summary__see-all-count strong',
        '.ga-resources-references span.publication-resource-link-amount'
        ],
      reads: [
        'DIV.nova-e-text.nova-e-text--size-m.nova-e-text--family-sans-serif.nova-e-text--spacing-xxs.nova-e-text--color-grey-700:not(span) /with\\s(.*?)$/',
        '.publication-meta-stats',
      ],
      journal:
        [
        'A.nova-e-link.nova-e-link--color-blue.nova-e-link--theme-bare',
        '.publication-meta-journal A',
        ],
      abstract: [
         '.publication-abstract .nova-e-text--spacing-auto',
         'DIV.nova-e-text.nova-e-text--size-m.nova-e-text--family-sans-serif.nova-e-text--spacing-auto.nova-e-text--color-inherit'
        ],
      authors: {
        selector: '.publication-author-list__item',
        subselectors: [
          { name: '.nova-v-person-list-item__title A' },
          { institution: 'LI.nova-v-person-list-item__meta-item:last-child SPAN' }
        ]
      }
    }
    scraper.scrape(res, selectors, '/publication/{id}', id, req.url)
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
    scraper.scrape(res, selectors, '/profile/{id}', id, req.url)
  })

  /**
   * @swagger
   * /rg/articles:
   *   get:
   *     description: "Returns article info for a given author."
   *     summary: "Get ResearchGate article list"
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
  server.get('/rg/articles', function (req, res, next) {
    const id = req.query.name
    const selectors = {
      articles: {
        selector: 'DIV[itemtype="http://schema.org/ScholarlyArticle"]',
        subselectors: [
          { title: 'A.nova-e-link' },
          { abstract: 'DIV[itemprop="description"]' },
          { type: 'A.nova-v-publication-item__type' },
          { date: 'LI.publication-item-meta-items__meta-data-item SPAN' },
          { reads: 'LI.nova-v-publication-item__metrics-item SPAN' },
          { authors: {
            selector: 'UL.nova-v-publication-item__person-list LI',
            subselectors: [
              { author: 'A[itemprop="author"]' }
            ]
            }
          }
        ]
      }
    }
    scraper.scrape(
      res,
      selectors,
      ['/profile/{id}'], //'/profile/{id}/2', '/profile/{id}/3'],
      id,
      req.url)
  })

  /**
   * @swagger
   * /rg/journal:
   *   get:
   *     description: "Returns info for a given journal."
   *     summary: "Get ResearchGate article list"
   *     tags: [ResearchGate]
   *     parameters:
   *       - name: name
   *         in: query
   *         description: "The Journal name"
   *         required: true
   *         default: 0138-9130_Scientometrics
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
  server.get('/rg/journal', function (req, res, next) {
    const id = req.query.name
    const selectors = {
      publisher: 'DIV.journal-full-info__meta',
      description: '.journal-full-info__description-title + p',
      rgimpact: 'H2.nova-e-text--color-inherit b',
      halflife: '//x:th[contains(text(),\'Cited half-life\')]/parent::*/x:td',
      immediacy: '//x:th[contains(text(),\'Immediacy index\')]/parent::*/x:td',
      eigenfactor: '//x:th[contains(text(),\'Eigenfactor\')]/parent::*/x:td',
      influence: '//x:th[contains(text(),\'Article influence\')]/parent::*/x:td',
      website: '//x:th[contains(text(),\'Website\')]/parent::*/x:td',
      issn: '//x:th[contains(text(),\'ISSN\')]/parent::*/x:td',
      material: '//x:th[contains(text(),\'Material type\')]/parent::*/x:td',
      doctype: '//x:th[contains(text(),\'Document type\')]/parent::*/x:td',
    }
    scraper.scrape(
      res,
      selectors,
      ['/journal/{id}'], //'/profile/{id}/2', '/profile/{id}/3'],
      id,
      req.url)
  })

  /**
   * @swagger
   * /rg/citations:
   *   get:
   *     description: "Returns citation list for a given article."
   *     summary: "Get ResearchGate article list"
   *     tags: [ResearchGate]
   *     parameters:
   *       - name: title
   *         in: query
   *         description: "The article title."
   *         required: true
   *         default: 269286890_Openness_to_Experience_and_Intellect_Differentially_Predict_Creative_Achievement_in_the_Arts_and_Sciences_Openness_Intellect_and_Creativity
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
  server.get('/rg/citations', function (req, res, next) {
    const id = req.query.title
    const selectors = {
      citations: {
        selector: '.pub-citations-list LI.pub-citations-list__item',
        subselectors: [
          {title: 'A.nova-e-link'},
          {cit: 'DIV.nova-v-citation-item__context-body--clamp-none'},
        ]
      }
    }
    scraper.scrape(res, selectors, '/publication/{id}', id, req.url)
  })

}
