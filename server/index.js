var express = require('express');
var request = require('request');

var app = express();

var REALTOR_URL = "https://api2.realtor.ca/Listing.svc/PropertySearch_Post";

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.post('/realtor', (req, res) => {
		req.pipe(request(REALTOR_URL)).pipe(res);
	});

// app.use('/data', express.static(path.join(__dirname, 'data')));

app.listen(3001, () => console.log('Example app listening on port 3001!'));
