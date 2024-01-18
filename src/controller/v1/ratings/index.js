const handleResponse = require("../../../helpers/handleResponse");
const ratingsPost = require("./ratings.post");
const ratingsGet = require('./ratings.get');
const ratingDelete = require('./ratings.delete');

exports.create = (req, res) => {
  handleResponse(ratingsPost.createRatings(req), res);
};

exports.findAll = (req, res) => {
	handleResponse(ratingsGet.findAll(req), res);
};

exports.findById = (req, res) => {
	handleResponse(ratingsGet.findById(req), res);
};

exports.delete = (req, res) => {
	handleResponse(ratingDelete.deleteRating(req), res);
};