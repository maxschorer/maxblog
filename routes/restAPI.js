var pg = require('pg');
var fs = require('fs');

var CON_STRING = 'pg://ubuntu:bitpass0@localhost:5432/shows';
var NUM_RESULTS = 49;

client = new pg.Client(CON_STRING);
client.connect();

exports.findMostByWC = function(req, res){
    var num = req.params.num || NUM_RESULTS;
    //var numEpisodesQuery = "SELECT COUNT(*) FROM episodes WHERE air_date <= CURRENT_DATE;";
    var queryString = fs.readFileSync('routes/findMostByWC.sql').toString();
    queryString += num + ';';
    console.log(queryString);

    client.query(queryString, function (err, result) {
	var output = result.rows;
	for (var i = 0; i < output.length; i++){
	    output[i]['words_by_ep'] = output[i]['words_by_ep'].split(',');
	}
	res.json(output, headers={ 'Content-Type': 'application/json' }, status=200);
    });
}

exports.findByCharName = function (req, res) {
    var name = req.params.name;
    var queryString = "SELECT * FROM characters WHERE name = '" + name + "';";

    client.query(queryString, function (err, result) {
	res.json(result);
    });
}

exports.findEpisodes = function (req, res) {
    var show_id = req.params.id;
    var queryString = fs.readFileSync('routes/findEpisodes.sql').toString();
    queryString += show_id + ';';

    client.query(queryString, function (err, result) {
	res.json(result.rows, headers={ 'Content-Type': 'application/json' }, status=200);
    });
}