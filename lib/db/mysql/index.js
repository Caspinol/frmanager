'use strict';

const bcrypt = require('bcrypt-nodejs');
const mysql = require('mysql');
const users = require('./users');

function Users(pool) {
    this.pool = pool;
};

Users.prototype.findById = function(id, callback){
    this.pool.getConnection(function(err, conn){
        if(err) {
            console.log("Could not get connection from pool", err);
            return callback(err);
        }

        conn.query(users.select, ['users', 'userid', id], function(err, result){
            callback(err, result)
            conn.release()
        });
    });
};

Users.prototype.findByUsername = function(username, callback){
    this.pool.getConnection(function(err, conn){
        if(err) {
            console.log("Could not get connection from pool", err);
            return callback(err);
        }

        conn.query(users.select, ['users', 'username', username], function(err, result){
            callback(err, result)
            conn.release()
        });
    });
}

Users.prototype.addUser = function(user, callback){
    this.pool.getConnection(function(err, conn){
        if(err) {
            console.log("Could not get connection from pool", err);
            return callback(err);
        }

        // Create password hash
        user.password = bcrypt.hashSync(user.password);
        
        conn.query(users.create, ['users', user], function(err, result){
            callback(err, result)
            conn.release()
        });
    });
}

module.exports = function(config) {

    console.log("Creating connection pool.");
    var pool = mysql.createPool(config.db.options);
    pool.on('connection', function (connection) {
        console.log("Taking connection from pool")
    });
    
    return {
        users: new Users(pool)
    }
}
