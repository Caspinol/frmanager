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
            callback(err, result)
            conn.release()
        })
    })
}

Users.prototype.findById = function(id, callback){
    this.pool.getConnection(function(err, conn){
        if(err){
            console.log("Could not get connection from pool", err)
            return callback(err)
        }
        conn.query(radcheck.select_one, ['id', id], function(err, result){
            callback(err, result)
            conn.release()
        })
    })
}

Users.prototype.updateUser = function(user, callback){
    this.pool.getConnection(function(err, conn){
        if(err){
            console.log("Could not get connection from pool", err)
            return callback(err)
        }
        var id = user.id;
        delete user.id
        console.log(user)
        console.log(id)
        conn.query(radcheck.update, [user, 'id', id], function(err, result){
            callback(err, result)
            conn.release()
        })
    })
}

Users.prototype.showUsers = function(page, callback){
    var limit = 10
    this.pool.getConnection(function(err, conn){
        if(err){
            console.log("Could not get connection from pool", err)
            return callback(err)
        }
        conn.query(radcheck.select, [limit, limit * page], function(err, result){
            callback(err, result)
            conn.release()
        })
    })
}

Users.prototype.countUsers = function(callback){
    this.pool.getConnection(function(err, conn){
        if(err){
            console.log("Could not get connection from pool", err)
            return callback(err)
        }
        conn.query("SELECT COUNT(*) as count FROM radcheck", function(err, result){
            callback(err, result)
            conn.release()
        })
    })
}

Users.prototype.toHTML = function(users, columns){
    var html = '<table class="table"><thead><tr>'
    for(var i = 1; i < columns.length; i++){
        html += '<th>' + columns[i].Field + '</th>'
    }
    html += '<th>Action</th>'
    html += '</tr></thead><tbody>'
    for(var i = 0; i < users.length; i++){
        html += '<tr>'
        for(var j = 1; j < columns.length; j++){
            html += '<td>'+ users[i][columns[j].Field] +'</td>'
        }
        html += '<td><a class="btn edit-user" href="/U/edit/'+users[i][columns[0].Field]+'">Edit</a></td>'
        html += '</tr>'
    }
    
    return html + '</tbody></table>'
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
