var express = require('express'),
characters = require('./routes/characters');
var fs = require('fs');

var app = express();
var htmlfile = "main.html";

app.use(express.logger());

app.get('/characters/chart/:num', characters.findMostByWC);
app.get('/characters/:name', characters.findByCharName);
app.get('/', function(request, response) {
    var html = fs.readFileSync(htmlfile).toString();
    response.send(html);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});