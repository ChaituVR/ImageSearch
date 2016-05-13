var express = require('express');
var app = express();
var pug = require('pug');
var Search = require('bing.search');
var search = new Search('Bing key here');

app.get('/', function(req, res) {
    var html = pug.renderFile('views/index.jade', {
        Url: process.env.IP
    });
    res.send(html);
});

app.get('/api/imagesearch/:search', function(req, res) {
    var offsetNum = Number(req.query.offset) || 0;


    search.images(req.params.search, {
            top: 10,
            skip: offsetNum
        },
        function(err, results) {
            if (err) console.log(err);
            res.send(results.map(function(objt) {
                return {
                    "url": objt.url,
                    "snippet": objt.title,
                    "thumbnail": objt.thumbnail.url,
                    "context": objt.sourceUrl
                };
            }));
        });
});
app.get('*', function(req, res) {
    var html = pug.renderFile('views/error.jade', {
        Url: process.env.IP
    });
    res.send(html);
});


app.listen(process.env.PORT || 8080, process.env.IP, function() {
    console.log('Your App is running on port ' + process.env.PORT + ' !! !! ');
});
