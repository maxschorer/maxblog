var express = require('express');
var restAPI  = require('./routes/restAPI');
var fs = require('fs');

var app = express();
var htmlfile = "main.html";

app.use(express.logger());

app.get('/characters/chart/:num', restAPI.findMostByWC);
app.get('/characters/:name', restAPI.findByCharName);
app.get('/episodes/:id', restAPI.findEpisodes);
app.get('/', function(request, response) {
    var html = fs.readFileSync(htmlfile).toString();
    response.send(html);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});