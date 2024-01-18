const handleResponse = require("../../../helpers/handleResponse");
const { authenticateUser } = require("./auth");

exports.authenticateUser = (req, res) => {
    handleResponse(authenticateUser(req), res);
};