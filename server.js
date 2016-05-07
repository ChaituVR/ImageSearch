var express = require('express');
var app = express();

var pug = require('pug');



app.get('/', function (req, res) {
    var html = pug.renderFile('views/index.jade',{Url: process.env.IP});
  res.send(html);
});
app.get('*', function (req, res) {
    var html = pug.renderFile('views/error.jade',{Url:  process.env.IP});
  res.send(html);
});

app.listen(process.env.PORT||8080,process.env.IP, function () {
  console.log('Your App is running on port '+process.env.PORT+' !! !! ' );
});
