const restify = require('restify');
const nconf = require('nconf');

nconf.argv()
  .env()
  .file({ file: '.config.json' });

const appId = nconf.get('weatherAppId');

module.exports = function (server) {


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
   *     responses:
   *       200:
   *         description: |-
   *           weather response
   *         examples:
   *            application/json: |-
   *              {
   *                  "coord": {
   *                  "lon": -74.01,
   *                  "lat": 40.71
   *                 },
   *                 "weather": [
   *                   {
   *                     "id": 800,
   *                     "main": "Clear",
   *                     "description": "clear sky",
   *                     "icon": "01n"
   *                   }
   *                 ],
   *                 "base": "stations",
   *                 "main": {
   *                   "temp": 51.49,
   *                   "pressure": 1014,
   *                   "humidity": 31,
   *                   "temp_min": 48.2,
   *                   "temp_max": 55.4
   *                 },
   *                 "id": 5128581,
   *                 "name": "New York",
   *                 "cod": 200
   *              }
   */
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
