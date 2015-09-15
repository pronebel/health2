/* 
 * Mongodb Database intialization
 */

var path = require('path');
var fs = require('fs');

try {
	fs.exists(path.join(appPath,'application/config', 'mongodb.js'), function(exists){
        if(exists) {
            var config = require(path.join(appPath, 'application/config','mongodb.js'));
            try {
                global.mongo = require('mongodb');
            } catch(e) {
                console.log('Please install "mongodb" module. run "npm install mongodb"');
                process.exit();
            }
            mongo.connect('mongodb://'+ (config.dbHost ? config.dbHost : 'localhost') + ':'+(config.dbPort ? config.dbPort : '27017') +'/' + config.dbName, function(err, db) {
                if(err) { throw err; }
                global.mongodb = db;
                if(config.dbUser && config.dbPass) {
                    mongodb.authenticate(config.dbUser, config.dbPass, function(err, res) {
                      // callback
                    });
                }
            });
        }
    });
}
catch (err) {
    console.log(err);
}

