// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// Check first user is logged in, if not redirect the user to login page
	// =====================================
	app.get('/', function(req, res) {
		var data = { login: req.isAuthenticated() };
		if (data.login) {
			//console.log(req.user);
			data.email = req.user.facebook.email;
			data.email = req.user.local.email;
			res.render('index.ejs', data);
		}
		else
		{
			//res.render('login.ejs');
		}

		res.render('index.ejs', data); // load the index.ejs file
	});
	
	// =====================================
	// Detail Page	   =====================
	// =====================================
	app.get('/detail',function(req,res){
		res.render('detail.ejs', { value: req.rest_value });
	});
	
	
	// =====================================
	// FACEBOOK ROUTES =====================
	// =====================================
	// route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/',
			failureRedirect : '/'
		}));

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	// =====================================
    // Login ==============================
    // =====================================
    // show the Login form
	app.get('/login', function(req, res) {
			//req.logout();
			res.render('login.ejs', { message: req.flash('loginMessage') });
	});
	
	 // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
	
	// =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
		console.log('Signup Page');
    });
	
	 // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true, // allow flash messages
    }));
};


// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
