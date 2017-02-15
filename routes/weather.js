const restify = require('restify');

module.exports = function (server) {

  server.get('/weather/:city', function (req, res, next) {
     var city = req.params.city;

    const host = 'api.openweathermap.org"; ///data/2.5/weather?q=';
    const urlSuffix = '&units=imperial&appid=c478bded4945b00879ff8199ec9aed58';

    // Creates a JSON client
    const client = restify.createJsonClient({
      url: 'http://' + host
    });

    client.get('/data/2.5/weather?q=' + city + urlSuffix, function(err, treq, tres, obj) {
      res.send(obj);
    });

  });

};
