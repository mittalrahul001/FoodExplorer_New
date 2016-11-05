// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '138339659959877', // your App ID
		'clientSecret' 	: '91c36308c846c181f56ad23912bfcd63', // your App Secret
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
