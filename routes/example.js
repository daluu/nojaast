module.exports = function(app, argv, config, sharedComponents){

  app.get('/example/rest/get', function (req, res) {
    res.send("You GET'd: Hello world!, with any optional query string: " + JSON.stringify(req.params));
  });

  app.post('/example/rest/post', function (req, res) {
  	//API endpoint for testing/debugging stuff
  	res.send("You POST'd with (optional) query string: " + JSON.stringify(req.params) + " and content: " + JSON.stringify(req.body));
  });

  app.put('/example/rest/put', function (req, res) {
  	//API endpoint for testing/debugging stuff
  	res.send("You PUT'd with (optional) query string: " + JSON.stringify(req.params) + " and content: " + JSON.stringify(req.body));
  });

  app.delete('/example/rest/delete', function (req, res) {
  	//API endpoint for testing/debugging stuff
  	res.send("You DELETE'd with (optional) query string: " + JSON.stringify(req.params));
  });

  app.head('/example/rest/head', function (req, res) {
  	//API endpoint for testing/debugging stuff
  	res.send("You fetched HEAD(er) content with (optional) query string: " + JSON.stringify(req.params));
  });

  app.options('/example/rest/options', function (req, res) {
  	//API endpoint for testing/debugging stuff
  	res.send("You made an options request with (optional) query string: " + JSON.stringify(req.params));
  });

  app.get('/example/proxy/get/:url', function (req, res) {
    var resp = sharedComponents.request('GET',req.params.url);
    res.send(resp.getBody('utf8'));
    //could have more sample proxy's for POST, PUT, DELETE to another URL/server...
  });

  app.get('/example/shared-component/demo', function (req, res) {
    res.send(sharedComponents.testMethod());
  });

  app.get('/example/config/demo', function (req, res) {
    res.send(config.myConfigParam);
  });

  app.get('/example/args/demo', function (req, res) {
    res.send("You ran server with args: "+JSON.stringify(argv));
  });

}