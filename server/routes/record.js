const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

recordRoutes.use(express.json());
recordRoutes.use(express.urlencoded({ extended: true }));

// This section will help you get a list of all the records.
recordRoutes.route("/books").get(async function (req, res) {
	const dbConnect = dbo.getDb();

	dbConnect
		.collection("books")
		.find({})
		.limit(50)
		.toArray(function (err, result) {
			if (err) {
				res.status(400).send("Error fetching books!");
				res.send(err);
			} else {
				res.json(result);
			}
		});
});

// This section will help you create a new record.
recordRoutes.route("/books/new").post(function (req, res) {
	const dbConnect = dbo.getDb();
	// console.log(req);
	console.log(req.body);
	const matchDocument = {
		// _id: req.body.id,
		last_modified: new Date(),
		name: req.body.name,
		rating: req.body.rating,
		author: req.body.author,
	};

	dbConnect
		.collection("books")
		.insertOne(matchDocument, function (err, result) {
			if (err) {
				res.status(400).send("Error inserting books!");
			} else {
				console.log(`Added a new match with id ${result.insertedId}`);
				res.status(200).send();
			}
		});
});

// This section will help you update a record by id.
recordRoutes.route("/books/updateReview").post(function (req, res) {
	const dbConnect = dbo.getDb();
	const bookQuery = { name: req.body.name };
	const updates = {
		$inc: {
			rating: 1,
		},
	};

	dbConnect
		.collection("books")
		.updateOne(bookQuery, updates, function (err, _result) {
			if (err) {
				res.status(400).send(
					`Error updating review on book with name ${bookQuery.name}!`
				);
			} else {
				console.log("1 document updated");
				res.status(204).send();
			}
		});
});

// This section will help you delete a record
recordRoutes.route("/books/delete").delete((req, res) => {
	const dbConnect = dbo.getDb();
	const bookQuery = { name: req.body.name };
	console.log(bookQuery);
	console.log(req.body);

	dbConnect.collection("books").deleteOne(bookQuery, function (err, _result) {
		if (err) {
			res.status(400).send(
				`Error deleting listing with name ${bookQuery.name}!`
			);
		} else {
			console.log("1 document deleted");
			res.status(200).send();
		}
	});
});

module.exports = recordRoutes;
