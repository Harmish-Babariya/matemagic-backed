const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const makeMongoDbServiceUser = require("../services/mongoDbService")({
	model: User,
});

exports.authenticateAdminToken = async (req, res, next) => {
	const token = req.headers.authorization;
	if (token && token != "") {
		jwt.verify(token, process.env.SECRET_STRING, async (err, decodedToken) => {
			if (err) {
				return res
					.set({ "Content-Type": "application/json" })
					.status(401)
					.send({
						status: "UNAUTHORIZED",
						message: "You are not authorized to access the request",
						data: {},
					});
			}
			const email = decodedToken.email;
			const user = await makeMongoDbServiceUser.getSingleDocumentByQuery({
				email: email,
			});
			if (user && user.isAdmin == "Y") {
				req.user = user;
				next();
			} else {
				return res
					.set({ "Content-Type": "application/json" })
					.status(401)
					.send({
						status: "UNAUTHORIZED",
						message: "You are not authorized to access the request",
						data: {},
					});
			}
		});
	} else {
		return res.set({ "Content-Type": "application/json" }).status(401).send({
			status: "UNAUTHORIZED",
			message: "You are not authorized to access the request",
			data: {},
		});
	}
};
