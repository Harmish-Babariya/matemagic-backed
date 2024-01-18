const mongoose = require("mongoose");
module.exports = function () {
	// Configuring the database
	mongoose.Promise = global.Promise;

	let URL = "";
	if (process.env.NODE_ENV == "development") {
		URL = process.env.URL_DEV;
	} else {
		URL = process.env.URL_PROD;
	}

	// Connecting to the database
	mongoose
		.connect(URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log("INFO: Successfully connected to the database");
		})
		.then(() => {
			// Check if the index exists
			return mongoose.connection.collection('users').indexExists({ location: '2dsphere' });
		})
		.then((indexExists) => {
			if (!indexExists) {
			  // Create the index
			  return mongoose.connection.collection('users').createIndex({ location: '2dsphere' });
			}
		  })
		.then(() => {
			console.log("INFO: Index checking and creation complete");
		})
		.catch((err) => {
			console.log("INFO: Could not connect to the database.", err);
			process.exit();
		});
};
