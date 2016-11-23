var assert = require('assert'),
    request = require('request'),
    mongoose = require('mongoose'),
    http = require('http');

var yelpAuth = require('../config/auth').yelpAuth;
var yelpToken = '';
describe('MOCHA TEST', function () {

	  	it('localhost running', function (done) {
		    http.get('http://localhost:8080', function (res) {
		      assert.equal(200, res.statusCode);
		      done();
		    });
	  	});

	  	it('mongodb running', function (done) {
	  		mongoose.connect('mongodb://localhost/test');
	        mongoose.connection.on('connected', function () {  
			  done();
			});

			mongoose.connection.on('disconnected', function () {  
			  done();
			}); 

	  	});

	  	it('facebook auth check', function (done) {
	        http.get('http://localhost:8080/auth/facebook', function (err, browser) {
	            if (err){
	            	return;
	            }else{
		            assert.equal(browser.location.pathname, '/auth/facebook/success');
		            done();
	            }
	        });
    	});

    	it('Yelp api return data', function(done){
	    		var req_data = {
				url: 'https://api.yelp.com/oauth2/token',
				method: 'POST',
				form: yelpAuth
			};

			request(req_data, function(err, res) {
				var json = JSON.parse(res.body);
				yelpToken = json.access_token;
			});

			
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
			req_data.qs.location = 'Chicago';
			

			request(req_data, function(err, res) {
				if(typeof res.body != "undefined") {
					var json = JSON.parse(res.body);
					done();

				} else {
					console.log('Yelp API search empty response !');
				}
			});
    	})
});
