var express = require('express'),
        fs = require('fs'),
        db = require('./dbAPI/db'),
        collection = require('./dbAPI/collection'),
        document = require('./dbAPI/document');

var app = express();

app.configure(function() {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.use('/public',express.static(__dirname + '/../public'));


/*
 * DB
 */
app.get('/list', db.findAll);
app.post('/db/:dbid', db.create);//Not possible to create empty DB ? this must be done through collection.create
//TODO app.put('/db/:dbid/newName/:newName', db.update);//Not possible either? Change the DB name... TODO
app.delete('/db/:dbid', db.delete);

/*
 * Collection
 */
app.get('/db/:dbid', collection.findAll);
app.post('/db/:dbid/collection/:collectionid', collection.create);
app.put('/db/:dbid/collection/:collectionid/newName/:newName', collection.update);
app.delete('/db/:dbid/collection/:collectionid', collection.delete);

/*
 * Document
 */
app.get('/db/:dbid/collection/:collectionid', document.findAll);
app.get('/db/:dbid/collection/:collectionid/document/:documentid', document.findById);
app.post('/db/:dbid/collection/:collectionid/document/create', document.create);
app.put('/db/:dbid/collection/:collectionid/document/:documentid', document.update);
app.delete('/db/:dbid/collection/:collectionid/document/:documentid', document.deleteById);


app.get('/', function(req, res) {
    fs.readFile(__dirname + '/../public/index.html',
            function(err, data) {
                if (err) {
                    res.writeHead(500);
                    console.log(err);
                    return res.end('Error loading index.html');
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            });
});

app.listen(3000);
console.log('Listening on port 3000...');