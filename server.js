var express = require('express');
var app = express();
var pug = require('pug');

var Search = require('bing.search');
var search = new Search('#Bing account Key here');

app.get('/', function(req, res) {
    var html = pug.renderFile('views/index.jade', {
        Url: process.env.IP
    });
    res.send(html);
});

app.get('/api/imagesearch/:search', function(req, res) {
   
var searchOutput=function(url,snippet,thumbnail,context){
    this.url=url;
    this.snippet=snippet;
    this.thumbnail=thumbnail;
    this.context=context;
};
var offsetNum=Number(req.query.offset);
console.log(offsetNum+ " "+ typeof(offsetNum) );
if(isNaN(offsetNum)){
   res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({"error":"please note that offset should be a number"}));
}
else{
    search.images(req.params.search, {
        top: 10,skip:offsetNum
    },
    function(err, results) {
         
        if (err) console.log(err);
        results=JSON.parse(JSON.stringify(results));
         var resulltJson=[];
        for(var i=0;i<results.length;i++){
            var j=results[i];
            resulltJson.push(new searchOutput(j.url,j.title,j.thumbnail["url"],j.sourceUrl));
         }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(resulltJson));
    });

}

  

   

   
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
