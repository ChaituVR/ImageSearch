var express = require('express');
var app = express();
var pug = require('pug');
var Search = require('bing.search');
var search = new Search(process.env.BING_SEARCH_KEY);
var MongoClient = require('mongodb').MongoClient;
var url = process.env.PROD_MONGO_URL;
MongoClient.connect(url, function(err, db) {
    if (err) console.log(err);
    else {
        var collection = db.collection('imageSearch');

        app.get('/', function(req, res) {
            var html = pug.renderFile('views/index.jade', {
                Url: process.env.IP
            });
            res.send(html);
        });

        app.get('/api/imagesearch/:search', function(req, res) {
            var offsetNum = Number(req.query.offset) || 0;
            collection.insert({
                "term": req.params.search,
                "when": new Date().toUTCString().slice(0, -3) + "UTC"
            });
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

        app.get('/latest', function(req, res) {
            collection.find().sort({
                $natural: -1
            }).limit(10).toArray(function(err, result) {
                if (err) console.log(err);
                else if (result.length) {
                    res.send(result.map(function(objt) {
                        return {
                            "term": objt.term,
                            "when": objt.when,
                        };
                    }));
                }
                else console.log('No document(s) found with defined "find" criteria!');
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
    }
});