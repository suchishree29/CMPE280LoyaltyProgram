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


/*
// you can pass the parameter in the command line. e.g. node static_server.js 3000
const port = process.argv[2] || 9000;
http.createServer(function (req, res) {
  console.log(`${req.method} ${req.url}`);
  // parse URL
  const parsedUrl = url.parse(req.url);
  // extract URL path
  let pathname = `.${parsedUrl.pathname}`;
  // maps file extention to MIME types
  const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
  };
  fs.exists(pathname, function (exist) {
    if(!exist) {
      // if the file is not found, return 404
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }
    // if is a directory, then look for index.html
    if (fs.statSync(pathname).isDirectory()) {
      pathname += '/index.html';
    }
    // read file from file system
    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // based on the URL path, extract the file extention. e.g. .js, .doc, ...
        const ext = path.parse(pathname).ext;
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });
}).listen(parseInt(port));
*/
console.log("Server listening on port ${port}");
