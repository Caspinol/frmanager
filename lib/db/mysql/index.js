'use strict';

const bcrypt = require('bcrypt-nodejs')
const mysql = require('mysql')
const ops = require('./users')
const radcheck = require('./radcheck')

function Operators(pool) {
    this.pool = pool
};

Operators.prototype.findById = function(id, callback){
    this.pool.getConnection(function(err, conn){
        if(err) {
            console.log("Could not get connection from pool", err)
            return callback(err)
        }

        conn.query(ops.select, ['users', 'userid', id], function(err, result){
            callback(err, result)
            conn.release()
        });
    });
};

Operators.prototype.findByUsername = function(username, callback){
    this.pool.getConnection(function(err, conn){
        if(err) {
            console.log("Could not get connection from pool", err)
            return callback(err)
        }

        conn.query(ops.select, ['users', 'username', username], function(err, result){
            callback(err, result)
            conn.release()
        })
    })
}

Operators.prototype.addUser = function(user, callback){
    this.pool.getConnection(function(err, conn){
        if(err) {
            console.log("Could not get connection from pool", err);
            return callback(err)
        }

        // Create password hash
        user.password = bcrypt.hashSync(user.password);
        
        conn.query(ops.create, ['users', user], function(err, result){
            callback(err, result)
            conn.release()
        })
    })
}

function Users(pool){
    this.pool = pool;
}

Users.prototype.addUser = function(user, callback){
    this.pool.getConnection(function(err, conn){
        if (err){
            console.log("Could not get connection from pool", err)
            return callback(err)
        }
        conn.query(radcheck.insert, user, function(err, result){
            callback(err, result)
            conn.release()
        })
    })
}

Users.prototype.showColumns = function(callback){
    this.pool.getConnection(function(err, conn){
        if (err){
            console.log("Could not get connection from pool", err)
            return callback(err)
        }
        conn.query(radcheck.show_columns, function(err, result){
            // Skip the id field
            callback(err, result.slice(1))
            conn.release()
        })
    })
}

module.exports = function(config) {

    console.log("Creating connection pool.");
    var pool = mysql.createPool(config.db.options);
    pool.on('connection', function (connection) {
        console.log("Taking connection from pool")
    });
    
    return {
        ops: new Operators(pool),
        users: new Users(pool)
    }
}
