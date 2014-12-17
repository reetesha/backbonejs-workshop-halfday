var express = require('express'),
    http = require('http'),
    fs = require('fs'),
    passport = require('passport'),
    routes = require('./routes').routes;

var app = express();
app.use(express.bodyParser());

routes(app, JSON.parse(fs.readFileSync('initial_data.json')));

app.use('/', express.static(__dirname + '/app'));

var port = process.env.PORT || 7000;
app.listen(port);
console.log('Please go to http://localhost:' + port);