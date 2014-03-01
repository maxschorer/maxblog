var pg = require('pg');
var fs = require('fs');

var NUM_RESULTS = 49;

client = new pg.Client(CON_STRING);
client.connect(); //connect here or within function call

exports.findMostByWC = function(req, res){
    var num = req.params.num || NUM_RESULTS;
    //var numEpisodesQuery = "SELECT COUNT(*) FROM episodes WHERE air_date <= CURRENT_DATE;";
    var numEpisodes = 30; // TODO: rewrite to be more dynamic
    var queryString = fs.readFileSync('routes/findMostByWC.sql').toString();
    queryString += (num * numEpisodes).toString();
    queryString += ';';

    var output = {};

    client.query(queryString, function (err, result) {
	for (i = 0; i < num; i++){
	    if (i*numEpisodes >= result.rows.length) { break;}
	    var episodes = {};
	    var start = i * numEpisodes;
	    for (j = 0; j < numEpisodes; j++){
		var row = result.rows[start + j];
		episodes[row.episode] = row.episode_words;
	    }
	    output[result.rows[start].name] = episodes;
	}
	res.json(output);
    });
}

exports.findByCharName = function (req, res) {
    var name = req.params.name;
    var queryString = "SELECT * FROM characters WHERE name = '" + name + "';";

    client.query(queryString, function (err, result) {
	res.json(result);
    });
}