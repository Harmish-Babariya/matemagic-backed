const handleResponse = require("../../../helpers/handleResponse");
const userGet = require("./user.get");

exports.findById = (req, res) => {
	handleResponse(userGet.findById(req), res);
};

exports.countByStatus = (req, res) => {
	handleResponse(userGet.countByStatus(req), res);
};
exports.getByStatus = (req, res) => {
	handleResponse(userGet.getByStatus(req), res);
};
