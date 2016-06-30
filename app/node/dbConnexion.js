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
        var url = 'mongodb://'+config.host+':'+config.port+'/'+newDB;
        console.log(url);
        return MongoClient.connect(url, function(err, newDb) {
            if(err) {
                return callback(err);
            }

            isConnected = true;
            db = newDb;
            callback(false, db);
        });
    } else {
        db = db.db(newDB);
        callback(false, db);
    }
}

function getAdmin(callback) {
    if(isConnected)
        return callback(false, db.admin());

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