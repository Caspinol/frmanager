const config = require('../../config.conf'),
logger = require('log4js').getLogger('catdamnit');

module.exports = function (driver) {
    var db;
    switch (driver){
        
    case 'mysql':
        db = require('./mysql')(config);
        break;

    default :
        db = undefined;
        console.log("Unknown DB driver");
    }

    return {
        db : db
    }
}
