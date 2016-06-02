var dbConnexion = require('../dbConnexion');
var mongo = require('mongodb');

var ObjectID = mongo.ObjectID;

var BSON = mongo.BSONPure;

exports.findAll = findAll;
exports.findById = findById;
exports.update = update;
exports.create = create;
exports.deleteById = deleteById;


function findAll(req, res) {
    var dbid = req.params.dbid;
    var collectionid = req.params.collectionid;
    console.log('document.findAll');
    console.log('db: ' + dbid);
    console.log('collection: ' + collectionid);

    dbConnexion.useDB(dbid, function(err, db) {
        dbConnexion.manageError(err, res);
        db.collection(collectionid, {strict: true}, function(err, collection) {
            dbConnexion.manageError(err, res);
            collection.find().toArray(function(err, documents) {
                dbConnexion.manageError(err, res);
                res.send(documents);
            });
        });
    });
}


function findById(req, res) {
    var dbid = req.params.dbid;
    var collectionid = req.params.collectionid;
    var documentid = req.params.documentid;
    console.log('document.findById');
    console.log('db: ' + dbid);
    console.log('collection: ' + collectionid);
    console.log('document: ' + documentid);

    dbConnexion.useDB(dbid, function(err, db) {
        dbConnexion.manageError(err, res);
        db.collection(collectionid, {strict: true}, function(err, collection) {
            dbConnexion.manageError(err, res);
            collection.findOne({'_id': ObjectID(documentid)}, function(err, doc) {
                dbConnexion.manageError(err, res);
                console.log(doc);
                res.send(doc);
            });
        });
    });
}


function update(req, res) {
    var dbid = req.params.dbid;
    var collectionid = req.params.collectionid;
    var documentid = req.params.documentid;
    var updatedObject = req.body;
    console.log('document.update');
    console.log('db: ' + dbid);
    console.log('collection: ' + collectionid);
    console.log('document: ' + documentid);

    dbConnexion.useDB(dbid, function(err, db) {
        dbConnexion.manageError(err, res);
        db.collection(collectionid, {strict: true}, function(err, collection) {
            dbConnexion.manageError(err, res);
            collection.update({'_id': ObjectID(documentid)}, updatedObject, {safe: true}, function(err, result) {
                dbConnexion.manageError(err, res);
                console.log('update result :', result);
                updatedObject._id = documentid;
                res.send(updatedObject);
            });
        });
    });
}

function create(req, res) {
    var dbid = req.params.dbid;
    var collectionid = req.params.collectionid;
    console.log('document.create');
    console.log('db: ' + dbid);
    console.log('collection: ' + collectionid);

    dbConnexion.useDB(dbid, function(err, db) {
        dbConnexion.manageError(err, res);
        db.collection(collectionid, {strict: true}, function(err, collection) {
            dbConnexion.manageError(err, res);
            collection.insert({}, {w: 1}, function(err, result) {
                dbConnexion.manageError(err, res);
                console.log('update result :', result);
                findAll(req, res);
            });
        });
    });
}

function deleteById(req, res) {
    var dbid = req.params.dbid;
    var collectionid = req.params.collectionid;
    var documentid = req.params.documentid;
    console.log('document.delete');
    console.log('db: ' + dbid);
    console.log('collection: ' + collectionid);
    console.log('document: ' + documentid);

    dbConnexion.useDB(dbid, function(err, db) {
        dbConnexion.manageError(err, res);
        db.collection(collectionid, {strict: true}, function(err, collection) {
            dbConnexion.manageError(err, res);
            collection.remove({'_id': ObjectID(documentid)}, {w: 1, single: true}, function(err, numberOfRemovedDocs) {
                dbConnexion.manageError(err, res);
                console.log('' + numberOfRemovedDocs + ' document(s) deleted');
                findAll(req,res);
            });
        });
    });
}