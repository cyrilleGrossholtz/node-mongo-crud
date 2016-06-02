var MongoClient = require('mongodb').MongoClient;
var config = require('config').get('db');

var isConnected = false;
var db;


exports.useDB = useDB;
exports.getAdmin = getAdmin;
exports.manageError = manageError;

function useDB(newDB, callback) {
    console.log('useDB');
    if(!isConnected) {
        return MongoClient.connect('mongodb://'+config.host+':'+config.port+'/test', function(err, newDb) {
            if(err) {
                return callback(err);
            }

            isConnected = true;
            db = newDb;
            useDB(newDB, callback);
        });
    } else {
        db.db(newDB);
        callback(false, db);
    }
}

function getAdmin(callback) {
    useDB('test', function(err, db) {
        if(err) {
            return callback(err);
        }
        return callback(false, db.admin());
    });
}


function manageError(err, res) {
    if(err) {
        console.log(err);
        res.send({'error': err});
        throw new Error(JSON.stringify(err));
    }
}