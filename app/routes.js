module.exports = function(app, streams) {

  // GET home 
  var index = function(req, res) {
    res.render('index', { 
                          title: 'TFG WebRTC', 
                          header: '',
                          footer: '',
                          id: req.params.id
                        });
  };

  // GET streams as JSON
  var displayStreams = function(req, res) {
    var streamList = streams.getStreams();
    // JSON exploit to clone streamList.public
    var data = (JSON.parse(JSON.stringify(streamList))); 
	
	 res.status(200).json(data)
  };
	 console.log(displayStreams);
  app.get('/streams', displayStreams);
  app.get('/', index);
  app.get('/:id', index);
}