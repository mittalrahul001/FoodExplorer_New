var http = require('http');
var express = require('express'), app = module.exports.app = express();
var server = http.createServer(app);
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path = require('path');
var validator = require('validator');
var io = require('socket.io')(server);
var request = require('request');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.configure(function() {

	app.use(express.logger('dev'));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.static(path.join(__dirname, 'public')));

	app.set('view engine', 'ejs');

	app.use(express.session({ secret: 'stolzpowylamywanyminogami' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());

});

require('./app/routes.js')(app, passport);


// =======================================================
// YELP AUTH && FETCH TOKEN
// =======================================================
var yelpAuth = require('./config/auth').yelpAuth;
var yelpToken = '';

var req_data = {
	url: 'https://api.yelp.com/oauth2/token',
	method: 'POST',
	form: yelpAuth
};

request(req_data, function(err, res) {
	var json = JSON.parse(res.body);
	yelpToken = json.access_token;
	//console.log(yelpToken);
	//console.log(json);
});
// =======================================================
// END OF YELP AUTH && FETCH TOKEN
// =======================================================


// =======================================================
// SOCKET.IO
// =======================================================
io.on('connection', function (socket) {

	socket.on('search restaurant', function (data) {
		if(yelpToken == '') return;

		var req_data = {
			url: 'https://api.yelp.com/v3/businesses/search',
			method: 'GET',
			auth: {
				'bearer': yelpToken
			},
			qs: {
				"limit": "20",
				"categories": "restaurants,bars,pubs"
			}
		};
	
		if(typeof data.location != "undefined") {
			req_data.qs.location = validator.escape(String(data.location))
		} else {
			req_data.qs.radius = 20000;
			req_data.qs.latitude = typeof data.latitude != "undefined" ? data.latitude : '37.7670169511878';
			req_data.qs.longitude = typeof data.logitude != "undefined" ? data.logitude : '-122.42184275';
		}

		if(typeof data.term != "undefined") {
			req_data.qs.term = validator.escape(String(data.term));
		}

		request(req_data, function(err, res) {
			if(typeof res.body != "undefined") {
				var json = JSON.parse(res.body);
				if(typeof json.error == "undefined") {

					socket.emit('list of restaurants', json);
				}	else console.log('YELP_API_ERROR: ' + json.error.description);

			} else console.log('Yelp API search empty response !');
		});
	});
});
// =======================================================
// END OF SOCKET.IO
// =======================================================


server.listen(port);
console.log('The magic happens on port ' + port);
