module.exports = function(app, passport){

    /* GET home page. */
    app.get('/', isLoggedIn, function(req, res, next){
        res.render('partials/dashboard', {title: "test"}) 
    })
    app.get('/U', isLoggedIn, function(req, res, next){
        app.locals.db.users.showColumns(function(err, columns){
            console.log(columns[0].Field)
            res.render('partials/users', {columns: columns})
        })
    })
    
    app.post('/U/add', isLoggedIn, function(req, res, next){
        app.locals.db.users.addUser(req.body, function(err, ret){
            if(err){
                console.log(err)
                return next(err)
            }
            res.redirect('/U')
        })
    })
    
    app.get('/P', isLoggedIn, function(req, res, next){
        res.render('partials/profiles')
    })
    app.get('/N', isLoggedIn, function(req, res, next){
        res.render('partials/NAS')
    })
    app.get('/A', isLoggedIn, function(req, res, next){
        res.render('partials/accounting')
    })
    app.get('/S', isLoggedIn, function(req, res, next){
        res.render('partials/system')
    })
/*
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
*/
    app.get('/login', function(req, res){
        res.render('login', {layout: false})
    })

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login'
    }))

    app.get('/logout', function(req, res){
        req.logout()
        res.redirect('/')
    })
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}
