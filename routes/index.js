module.exports = function(app, passport){

    /* GET home page. */
    app.get('/', isLoggedIn, function(req, res, next){
        res.render('partials/dashboard', {title: "test"}); 
    });

    app.get('/add', function(req, res){
        var db = app.locals.db;
        db.users.addUser({
            username: "master",
            password: "stefan"
        }, function(err){
            if(err) console.log(err)
            res.redirect('/')
        });
    });

    app.get('/login', function(req, res){
        res.render('login', {layout: false})
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

    app.get('/logout', function(req, res){
        req.logout()
        res.redirect('/')
    });
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
