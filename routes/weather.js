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
   *         consumes:
   *           - application/json
   *           - application/text
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: |-
   *           weather response
   *         schema:
   *           $ref: "#/definitions/report"
   *         examples:
   *            "coord":
   *                "lon": -74.01
   *                "lat": 40.71
   *            "weather":
   *              - "id": 804
   *                "main": "Clouds"
   *                "description": "overcast clouds"
   *                "icon": "04n"
   *            "base": "stations"
   *            "main":
   *                "temp": 50.68
   *                "pressure": 1016
   *                "humidity": 27
   *                "temp_min": 46.4
   *                "temp_max": 53.6
   *            "visibility": 16093
   *            "wind":
   *                "speed": 10.29
   *                "deg": 360
   *                "gust": 7.2
   *            "clouds":
   *                 "all": 90
   *            "dt": 1489113300
   *            "sys":
   *               "type": 1
   *               "id": 1969
   *               "message": 0.0289
   *               "country": "US"
   *               "sunrise": 1489144512
   *               "sunset": 1489186665
   *            "id": 5128581
   *            "name": "New York"
   *            "cod": 200
   *     x-amples:
   *     - description: Get Weather
   *       request:
   *         params:
   *           city: NYC
   *       responses:
   *          200:
   *            headers:
   *               content-type: "application/json; charset=utf-8"
   *            body:
   *               name: 'New York'
   *     - description: Get Weather (Text)
   *       request:
   *         headers:
   *           Accept: 'text/plain'
   *         params:
   *          city: NYC
   *       responses:
   *          200:
   *            headers:
   *               content-type: "text/plain"
   *
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
