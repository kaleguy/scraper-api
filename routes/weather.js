const restify = require('restify');
const nconf = require('nconf');

nconf.argv()
  .env()
  .file({ file: '.config.json' });

const appId = nconf.get('weatherAppId');

module.exports = function (server) {

  server.get('/weather/:city', function (req, res, next) {
     var city = req.params.city;

    const host = 'api.openweathermap.org"; ///data/2.5/weather?q=';
    const urlSuffix = '&units=imperial&appid=' + appId;

    // Creates a JSON client
    const client = restify.createJsonClient({
      url: 'http://' + host
    });

    client.get('/data/2.5/weather?q=' + city + urlSuffix, function(err, treq, tres, obj) {
      res.send(obj);
    });

  });

};
