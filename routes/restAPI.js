/*jslint smarttabs:true */

var pg = require('pg');
var fs = require('fs');

var CON_STRING = 'pg://ubuntu:bitpass0@localhost:5432/shows';
var NUM_RESULTS = 50;

var client = new pg.Client(CON_STRING);
client.connect();

exports.findMostByWC = function(req, res){
    var num = req.params.num || NUM_RESULTS;
    var queryString = fs.readFileSync('routes/findMostByWC.sql').toString();
    queryString += num + ';';

    client.query(queryString, function (err, result) {
	var output = result.rows;
	for (var i = 0; i < output.length; i++){
	    var rawCntByEpNum = [];
	    var movAveByEpNum = [];
	    var cumulAveByEpNum = [];
	    var rawCntByEpStr = output[i].raw_cnt_by_ep.split(',');
	    var movAveByEpStr = output[i].mov_ave_by_ep.split(',');
	    var cumulAveByEpStr = output[i].cumul_ave_by_ep.split(',');
	    for (var j = 0; j < rawCntByEpStr.length; j++){
		rawCntByEpNum.push(parseInt(rawCntByEpStr[j]));
		movAveByEpNum.push(parseInt(movAveByEpStr[j]));
		cumulAveByEpNum.push(parseInt(cumulAveByEpStr[j]));
	    }

	    output[i].rawCntByEp = rawCntByEpNum;
	    output[i].movAveByEp = movAveByEpNum;
	    output[i].cumulAveByEp = cumulAveByEpNum;
	}
	res.json(output, headers={ 'Content-Type': 'application/json' }, status=200);
    });
};

exports.findByCharName = function (req, res) {
    var name = req.params.name;
    var queryString = "SELECT * FROM characters WHERE name = '" + name + "';";

    client.query(queryString, function (err, result) {
	res.json(result);
    });
};

exports.findEpisodes = function (req, res) {
    var show_id = req.params.id;
    var queryString = fs.readFileSync('routes/findEpisodes.sql').toString();
    queryString += show_id + ';';

    client.query(queryString, function (err, result) {
	res.json(result.rows, headers={ 'Content-Type': 'application/json' }, status=200);
    });
};
