
var dbConnexion = require('../dbConnexion');


exports.findAll = findAll;
exports.create = create;
exports.delete = del;


function findAll(req, res) {
    console.log('db.findAll');
    dbConnexion.getAdmin(function(err, admin) {
        dbConnexion.manageError(err, res);
        admin.listDatabases(function(err, dbs) {
            dbConnexion.manageError(err, res);
            // Grab the databases and sent them
            res.send(dbs.databases);
        });
    });
}

function del(req, res) {
    var dbid = req.params.dbid;
    console.log('db.delete : ', dbid);
    dbConnexion.useDB(dbid, function(err, db) {
        dbConnexion.manageError(err, res);
        db.dropDatabase(function(err, result) {
            dbConnexion.manageError(err, res);
            return findAll(req, res);
        });
    });
}

function create(req, res) {
    var dbid = req.params.dbid;
    console.log('db.delete', dbid);
    dbConnexion.useDB(dbid, function(err, db) {
        dbConnexion.manageError(err, res);
        return findAll(req, res);

    });
}
