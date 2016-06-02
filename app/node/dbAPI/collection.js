var dbConnexion = require('../dbConnexion');


exports.findAll = findAll;
exports.create = create;
exports.delete = del;
exports.update = update;

function findAll(req, res) {
    var dbid = req.params.dbid;
    console.log('collection.findAll');
    console.log('db: ' + dbid);
    dbConnexion.useDB(dbid, function(err, db) {
        dbConnexion.manageError(err, res);
        db.listCollections().toArray(function(err, collections) {
            dbConnexion.manageError(err, res);
            console.log("collections", collections,"length", collections.length);
            res.send(collections);
        });
    });
}


function create(req, res) {
    var dbid = req.params.dbid;
    var collectionid = req.params.collectionid;
    console.log('collection.add');
    console.log('db: ' + dbid);
    console.log('new Collection: ' + collectionid);
    dbConnexion.useDB(dbid, function(err, db) {
        dbConnexion.manageError(err, res);
        db.createCollection(collectionid, {strict: true}, function(err, collection) {
            dbConnexion.manageError(err, res);
            console.log("collection", collection);
            findAll(req, res);
        });
    });
}

function del(req, res) {
    var dbid = req.params.dbid;
    var collectionid = req.params.collectionid;
    console.log('collection.delete');
    console.log('db: ' + dbid);
    console.log('delete Collection: ' + collectionid);

    dbConnexion.useDB(dbid, function(err, db) {
        dbConnexion.manageError(err, res);
        db.dropCollection(collectionid, function(err, collection) {
            dbConnexion.manageError(err, res);
            console.log("collection", collection);
            findAll(req, res);
        });
    });
}

function update(req, res) {
    var dbid = req.params.dbid;
    var collectionid = req.params.collectionid;
    var newName = req.params.newName;
    console.log('collection.update');
    console.log('db: ' + dbid);
    console.log('updated Collection: ' + collectionid);
    console.log('new Collection: ' + newName);

    dbConnexion.useDB(dbid, function(err, db) {
        dbConnexion.manageError(err, res);
        db.collection(collectionid, {strict: true}, function(err, collection) {
            dbConnexion.manageError(err, res);
            collection.rename(newName, function(err, collection) {
                dbConnexion.manageError(err, res);
                findAll(req, res);
            });
        });
    });
}