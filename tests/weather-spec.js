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

    serverOptions.uri += 'new york';
    preq.get(serverOptions)
      .then(function(res){
         console.log('Response: ', serverOptions.uri, res.body);
         expect(res.body.name).toBe('New York');
       //  server.close();
         done();
      });

  });

  it('Get the correct city name returned on text request', function (done){
    serverOptions.headers.Accept = 'text/plain';
    preq.get(serverOptions)
      .then(function(res){
        console.log('Response: ', serverOptions.uri, res);
        const body = JSON.parse(res.body);
        expect(body.name).toBe('New York');
        server.close();
        done();
      });

  });

/*  afterAll(function() {
    console.log('afterAll');
    server.close();
  });*/

});
