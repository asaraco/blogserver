// Main file of app: index.js

var express = require('express');
var app = express();
var mongo = require('./controllers/mymongo');
var bodyParser = require('body-parser');

//Connection URL
var url = 'mongodb://localhost:27017/blogdb';

//just for testing
var jsQuery = {"key": "mm_changes"};
var jsUpdate = {"album": "changes"};

mongo.start(url);
console.log("Ready to query database");
//mongo.find(jsQuery);
//mongo.update(jsQuery, jsUpdate);

//enable CORS
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

//enable body-parser
app.use(bodyParser.json());

/*
 * Gracefully handle exit
 */
//CTRL+C
process.on('SIGINT', function() {
	mongo.stop();
	process.exit();
});

//Handle HTTP requests
app.get('/', function(req, res) {
  res.send('Hello world, this is the Blog Server!');
});

app.get('/login', function(req, res) {
	mongo.find('users', req.query, {}, function(results) {
		res.json(results);
	})
})

app.post('/reviews', function(req, res) {
	console.log("POST");
	mongo.find('reviews', {"_id": req.body._id}, {}, function(results) {
		console.log("_id: "+req.body._id);
		if (results.toString() == []) {
			console.log("Chose INSERT");
			mongo.insert('reviews', req.body);
		} else {
			console.log("Chose UPDATE");
			mongo.update('reviews', {"_id": req.body._id}, req.body);
		}
	});
	res.json(req.body);
});

app.get('/reviews2', function(req, res) {
	console.log("GET");
	console.log(req.query);
	console.log(req.query.dQuery);
	console.log(req.query.dProjection);
	mongo.find('reviews', req.query.dQuery, req.query.dProjection, function(results) {
		res.json(results);
	});
})

app.listen(3000);
