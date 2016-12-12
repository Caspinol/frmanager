var LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt-nodejs');

module.exports = function(passport, db){

    passport.serializeUser(function(user, done){
        done(null, user.userid);
    });

    passport.deserializeUser(function(id, done) {
        db.ops.findById(id, (err, rows) => {
            if(err) done(err);
            done(null, rows);
        });
    });
    
    passport.use(
        'local-login',
        new LocalStrategy(function(username, password, done) {
            db.ops.findByUsername(username, (err, rows) => {
                if(err) {
                    return done(err)
                }
                if (rows == undefined || rows == null) {
                    /* Flash message if no user */
                    return done(null, false, {message: "Bad username or password!"});
                }
                /* Check hashed password */
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, {message: "Bad username or password!"});
                /* Success */
                done(null, rows[0]);
            });
        })
    );
}
