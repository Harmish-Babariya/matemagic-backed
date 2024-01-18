const handleResponse = require("../../../helpers/handleResponse");
const userGet = require("./user.get");
const userCreate = require("./user.post");
const userUpdate = require("./user.put");

exports.create = (req, res) => {
	handleResponse(userCreate.create(req), res);
};

exports.findAll = (req, res) => {
	handleResponse(userGet.findAll(req), res);
};

exports.getAll = (req, res) => {
	handleResponse(userCreate.getUsers(req), res);
};


exports.findById = (req, res) => {
	handleResponse(userGet.findById(req), res);
};

exports.update = (req, res) => {
	handleResponse(userUpdate.Update(req), res);
};

exports.deleteUser = (req, res) => {
	handleResponse(userCreate.deleteUser(req), res);
};
