const nconf = require('nconf')
const request = require('superagent')

nconf.argv()
  .env()
  .file({ file: '.config.json' })

const appId = nconf.get('weatherAppId')
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
   *         default: new york
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
   *           city: new york
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
   *          city: new york
   *       responses:
   *          200:
   *            headers:
   *               content-type: "text/plain"
   *
   */
  server.get('/weather/:city', function (req, res, next) {
    let city = req.params.city;
    const host = 'api.openweathermap.org'; ///data/2.5/weather?q=';
    const urlSuffix = '&units=imperial&appid=' + appId;
    let url = 'http://' + host
    const p = '/data/2.5/weather?q=' + encodeURIComponent(city) + urlSuffix;
    url = url + p
    request
      .get(url)
      .set('accept', 'json')
      .end((err, xres) => {
        if (err) {
          return res.send(err.message)
        }
        res.json(xres.body)
        // Calling the end function will send the request
      });

  });

};
