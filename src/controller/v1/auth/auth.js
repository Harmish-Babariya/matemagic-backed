/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
const message = require("../../../utils/messages");
const responseCode = require("../../../utils/responseCode");
const jwt = require("jsonwebtoken");
const { User } = require("../../../models/user.model");
const makeMongoDbServiceUser = require("../../../services/mongoDbService")({
	model: User,
});
const firebaseAdmin = require("firebase-admin");

const firebaseKey = require("../../../../mate-megic-firebase-adminsdk-2vrq8-326ea8336f.json");

firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(firebaseKey),
});

exports.authenticateUser = async (req) => {
	try {
		var jwtToken;
		var user;
		var isAuthenticated = false;
		var { token, id, email, roleToken } = req.body;
		const { platform } = req.params;
		if (roleToken == "z4Pt2gScPuHMYiZpXGM4") {
			jwtToken = jwt.sign({ email: email }, process.env.SECRET_STRING);
			user = await makeMongoDbServiceUser.getSingleDocumentByQuery({
				email: email,
			});
			if (user.isAdmin == "Y") {
				return message.successResponse(
					{ "Content-Type": "application/json" },
					responseCode.success,
					{ token: jwtToken, isRegistered: user ? true : false, user: user }
				);
			} else {
				throw message.unAuthorizedRequest(
					{ "Content-Type": "application/json" },
					responseCode.unAuthorizedRequest
				);
			}
		}
		switch (platform) {
			case "google": {
				const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
				if (decodedToken.email_verified && decodedToken.email != null) {
					email = decodedToken.email;
					isAuthenticated = true;
				}
				break;
			}
			case "facebook": {
				const sessionCookie = await firebaseAdmin
					.auth()
					.createSessionCookie(token);
				const decodedToken = await firebaseAdmin
					.auth()
					.verifySessionCookie(sessionCookie);
				if (decodedToken.email_verified && decodedToken.email != null) {
					email = decodedToken.email;
					isAuthenticated = true;
				}
				break;
			}
			case "apple": {
				const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
				if (decodedToken.email_verified && decodedToken.email != null) {
					email = decodedToken.email;
					isAuthenticated = true;
				}
				break;
			}
			default: {
				throw message.badRequest(
					{ "Content-Type": "application/json" },
					responseCode.badRequest,
					{ message: "bad request" }
				);
				break;
			}
		}
		if (isAuthenticated) {
			jwtToken = jwt.sign({ email: email }, process.env.SECRET_STRING);
			user = await makeMongoDbServiceUser.getSingleDocumentByQuery({
				email: email,
			});
			return message.successResponse(
				{ "Content-Type": "application/json" },
				responseCode.success,
				{ token: jwtToken, isRegistered: user ? true : false, user: user }
			);
		}
	} catch (error) {
		console.error("error:", error.message);
		throw message.failureResponse(
			{ "Content-Type": "application/json" },
			responseCode.internalServerError
		);
	}
};
