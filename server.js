const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var index = require('./routes/index');
var bodyparser = require("body-parser");

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use('/', index);

mongoose.connect('mongodb://localhost:27017/loyalty');

//on connection
mongoose.connection.on('connected',function () {
    console.log('Connected to database mongodb');
});

//on error
mongoose.connection.on('error',function (err) {
    if(err){
        console.log('Error in Database connection' +err);
    }
});
var port = 7000;
app.listen(port, function(){
    console.log("server started at port" + port);
});

console.log("Server listening on port ${port}");
