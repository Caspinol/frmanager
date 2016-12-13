var pagination = require('../lib/pagination')

module.exports = function(app, passport){

    var db = app.locals.db
    var handlebars = app.locals.hbs.handlebars
    
    /* GET home page. */
    app.get('/', isLoggedIn, function(req, res, next){
        res.render('partials/dashboard', {title: "test"}) 
    })
    
    app.get('/U/:page?', function(req, res, next){
        var page = req.params.page || 0
        db.users.showColumns(function(err, columns){
            if(err) console.log(err)
            db.users.showUsers(page, function(err, users){
                if(err) console.log(err)
                db.users.countUsers(function(err, count){
                    if(err) console.log(err)
                    var count = count[0].count
                    res.render('partials/users', {
                        columns: columns.slice(1),
                        users: users,
                        helpers: {
                            paginate: function(users, options){
                                var html = ''
                                var current_page = handlebars.Utils.escapeExpression(page)
                                html += '<div class="">'
                                html += db.users.toHTML(users, columns)
                                html += '</div>'
                                html += '<div class="pagination">'
                                html += pagination(current_page, Math.ceil(count/10))
                                return new handlebars.SafeString(html + '</div>')
                            }
                        }
                    })
                })
            })
        })
    })

    app.get('/U/edit/:id', function(req, res, next){
        db.users.findById(req.params.id, function(err, user){
            res.send(user)
        })
    })

    app.post('/U/edit', function(req, res, next){
        db.users.updateUser(req.body, function(err, user){
            if(err){
                console.log(err)
                return next(err)
            }
            res.redirect('/U')
        })
    })
    
    app.post('/U/add', isLoggedIn, function(req, res, next){
        db.users.addUser(req.body, function(err, ret){
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
