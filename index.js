/*jslint node: true, indent: 2 */
'use strict'

const corsMiddleware = require('restify-cors-middleware')
const swaggerJSDoc = require('swagger-jsdoc')
var exports = module.exports = {}

const options = {
  swaggerDefinition: {
    info: {
      title: 'OpenWeatherMap Proxy', // Title (required)
      description: 'This is a simple wrapper for the OpenWeatherMap API.',
      version: '1.0.0' // Version (required)
    },
    host:'localhost:8888',
    basePath: '',
    schemes: ['http']
  },
  apis: [
    __dirname + '/routes/weather.js',
    __dirname + '/routes/rg.js',
    __dirname + '/index.js'
  ] // Path to the API docs
}
const swaggerSpec = swaggerJSDoc(options)

/**
 *
 * @swagger
 * definitions:
 *   report:
 *     type: object
 *     required:
 *       - coord
 *       - weather
 *       - base
 *       - main
 *       - visibility
 *       - wind
 *       - clouds
 *       - dt
 *       - sys
 *       - id
 *       - name
 *       - cod
 *     properties:
 *       coord:
 *         type: object
 *       weather:
 *         type: array
 *         items:
 *           type: string
 *       base:
 *         type: string
 *       main:
 *         type: object
 *       visibility:
 *         type: integer
 *       wind:
 *         type: object
 *       clouds:
 *         type: object
 *       dt: integer
 *       sys:
 *         type: object
 *       id: integer
 *       name: string
 *       cod: integer
 *
 */


let restify, bunyan, routes, log, server

restify = require('restify')
bunyan  = require('bunyan')
routes  = require('./routes/')

log = bunyan.createLogger({
  name        : 'restify',
  level       : process.env.LOG_LEVEL || 'info',
  stream      : process.stdout,
  serializers : bunyan.stdSerializers
})

server = restify.createServer({
  name : 'restify',
  log  : log,
})


server.use(corsMiddleware({
  origins: ['https://kaleguy.github.io', 'https://travis-ci.org/']//,   // defaults to ['*']
//  credentials: true,                 // defaults to false
 // headers: ['x-foo']                 // sets expose-headers
}).actual)
server.use(restify.plugins.bodyParser({ mapParams: false }))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.gzipResponse())
server.pre(restify.plugins.pre.sanitizePath())

// This version of restify can't handle hyphens in url params... gross hack here to fix
function encodeHyphens(req, res, next) {
    req.url = req.url.replace(/-/g, '__');
    return next();
}
// server.pre(encodeHyphens)

/*jslint unparam:true*/
// Default error handler. Personalize according to your needs.
/* istanbul ignore next */
server.on('uncaughtException', function (req, res, route, err) {
  console.log('******* Begin Error *******')
  console.log(route)
  console.log('*******')
  console.log(err.stack)
  console.log('******* End Error *******')
  if (!res.headersSent) {
    return res.send(500, { ok : false })
  }
  res.write("\n")
  res.end()
})
/*jslint unparam:false*/

// server.on('after', restify.plugins.auditLogger({ log: log }))
routes(server)

// serve swagger docs
server.get('/public/swagger/*', restify.plugins.serveStatic({
  directory: __dirname,
  default: 'index.html'
}))

// serve swagger spec
server.get('/api-docs.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

console.log('Server started.')
server.listen(process.env.PORT || 8888, function () {
  log.info('%s listening at %s', server.name, server.url)
})

var app = server
module.exports = app
exports.close = server.close


