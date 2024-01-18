const handleResponse = require("../../../helpers/handleResponse");
const { popular } = require("./popular");
const { liked } = require("./liked");
const { viewed } = require("./viewed");
const { nearby } = require("./nearby");
const { getFilteredUsers } = require("./filter");

exports.popular = (req, res) => {
	handleResponse(popular(req), res);
};

exports.viewed = (req, res) => {
	handleResponse(viewed(req), res);
};

exports.liked = (req, res) => {
	handleResponse(liked(req), res);
};

exports.nearby = (req, res) => {
	handleResponse(nearby(req), res);
};

exports.getFilteredUsers = (req, res) => {
	handleResponse(getFilteredUsers(req), res);
}