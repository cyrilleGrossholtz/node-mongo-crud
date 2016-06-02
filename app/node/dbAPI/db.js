
var dbConnexion = require('../dbConnexion');


exports.findAll = findAll;
exports.create = create;
exports.delete = del;


function findAll(req, res) {
    console.log('db.findAll');
    dbConnexion.getAdmin(function(err, admin) {
        if(err) {
            return res.send({'error': err});
        }
        admin.listDatabases(function(err, dbs) {
            // Grab the databases and sent them
            res.send(dbs.databases);
        });
    });
}

function del(req, res) {
    var dbid = req.params.dbid;
    console.log('db.delete : ', dbid);
    dbConnexion.useDB(dbid, function(err, db) {
        if(err) {
            return res.send({'error': err});
        }
        db.dropDatabase(function(err, result) {
            if(err) {
                console.log('error while dropping the database :', err);
                return res.send({'error': err});
            }
            return findAll(req, res);
        });
    });
}

function create(req, res) {
    var dbid = req.params.dbid;
    console.log('db.delete', dbid);
    db.changeDB(dbid, function(err, db) {
        if(err) {
            return res.send({'error': err});
        }
        return findAll(req, res);

    });
}
