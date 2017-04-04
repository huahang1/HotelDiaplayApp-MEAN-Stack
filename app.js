require('./api/data/db');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

var routes = require('./api/routes');

app.set('port',3000);

//configure a middleware for logging each request method and request url
app.use(function (req,res,next) {
    console.log(req.method,req.url);
    next();
});

//path is a node module which deals with the name of file path
app.use(express.static(path.join(__dirname,'public')));

//get the params from req.body through bodyParser
app.use(bodyParser.urlencoded({extended:false}));

//configure to make each request url starts with '/api'
app.use('/api',routes);

var server = app.listen(app.get('port'),function () {
    var port = server.address().port;
    console.log('application is listening at: ' + port);
});