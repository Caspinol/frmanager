const path = require('path');
const fs = require('fs');

function dir(file) {    
    var sql;
    var fullPath = path.join(__dirname, file); // generating full path;
    try {
        sql = fs.readFileSync(fullPath, 'utf8');
    } catch(e) {
        sql = undefined
        throw new Error(e.message);
    }
    return sql;
}

module.exports = {
    create: dir('create.sql'),
    select: dir('select.sql'),
    init: dir('init.sql'),
    drop: dir('drop.sql')
}
