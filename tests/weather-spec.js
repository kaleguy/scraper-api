describe('OpenWeatherMap API', function(){

  const preq = require('preq');
  const server = require('../index.js');
  const serverOptions = {
    uri: 'http://localhost:8888/weather/',
    headers: {
      'Accept': 'application/json'
    }
  };


  it('Get the correct city name returned', function (done){

    serverOptions.uri += 'nyc';
    preq.get(serverOptions)
      .then(function(res){
         expect(res.body.name).toBe('New York');
         done();
         server.close();
      });

  });

});
