const { User } = require("../../../models/user.model");
const makeMongoDbServiceUser = require("../../../services/mongoDbService")({
	model: User,
});
const message = require("../../../utils/messages");
const responseCode = require("../../../utils/responseCode");
const _ = require("lodash");

// Update user
exports.Update = async (req) => {
	try {
		// Make sure this account doesn't already exist
		const user = await makeMongoDbServiceUser.getDocumentById(
			req.params.id,
			[]
		);

		if (user) {
			const userData = req.body; // update user payload
			const newUser = await makeMongoDbServiceUser.updateDocument(
				req.params.id,
				userData
			);
			return message.successResponse(
				{ "Content-Type": "application/json" },
				responseCode.success,
				_.pick(newUser, [])
			);
		}

		return message.recordNotFound(
			{ "Content-Type": "application/json" },
			responseCode.notFound
		);
	} catch (error) {
		throw message.failureResponse(
			{ "Content-Type": "application/json" },
			responseCode.internalServerError
		);
	}
};
