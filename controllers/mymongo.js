// Module for connecting to Mongo -- mymongo.js

var MongoClient = require('mongodb').MongoClient, assert = require('assert');

var collection, db;

exports.start = function(pUrl) {
  // Use connect method to connect to the server
  MongoClient.connect(pUrl, function(err, pDb) {
    assert.equal(null, err);
    console.log("Connected successfully to MongoDB server");
    db = pDb;
    //db.close();
  });
}

exports.stop = function() {
	console.log("Closing database connection");
	db.close();
}

exports.find = function(collname, qry, proj, callback) {
	collection = db.collection(collname);
	collection.find(qry, proj).toArray(function(err, docs) {
	    assert.equal(err, null);
	    console.log("Found the following records");
	    console.log(docs);
	    callback(docs);
	});
}

exports.update = function(collname, qry, val) {
	collection = db.collection(collname);
	/* Remove the _id field from the posted data because it is only used for the query.
	 * Including it in the update code would trigger an error because it can't be overwritten.
	 */
	delete val._id;
	collection.updateOne(qry, { $set: val }, function(err1, result) {
		if (err1 != null) {
			console.log(err1);
		} else {
			console.log("Updated the following records");
		    console.log(result);
		    //callback(result);
		}
	});
}

exports.insert = function(collname, doc) {
	collection = db.collection(collname);
	collection.insertOne(doc, function(err, result) {
		assert.equal(null, err);
		assert.equal(1, result.insertedCount);
		console.log("Inserted the following records");
		console.log(result);
	});
}
