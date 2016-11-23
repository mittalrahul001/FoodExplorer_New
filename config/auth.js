// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '1376817575679589', // your App ID
		'clientSecret' 	: '0cc900e22f7820d45e7327588e275317', // your App Secret
		'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'your-consumer-key-here',
		'consumerSecret' 	: 'your-client-secret-here',
		'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: 'your-secret-clientID-here',
		'clientSecret' 	: 'your-client-secret-here',
		'callbackURL' 	: 'http://localhost:8080/auth/google/callback'
	},

	'yelpAuth' : {
		'client_id': 'LpR-SIlfPu57vET8qgBH7Q',
		'client_secret': 'ussBCT54vyoJzrg6FkV4T4NLOUGfDIHmL3ITo0Guq1ul1HR8vQtqQRSaokRg9uJS',
		'grant_type': 'client_credentials'
	}

};
