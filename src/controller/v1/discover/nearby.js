// const { Filter } = require("../../../models/filter.model");
const { User } = require("../../../models/user.model");
const message = require("../../../utils/messages");
const responseCode = require("../../../utils/responseCode");
// const handleResponse = require("../../../helpers/handleResponse");
// const makeMongoDbServiceFilter = require("../../../services/mongoDbService")({
// 	model: Filter,
// });
const makeMongoDbServiceUser = require("../../../services/mongoDbService")({
	model: User,
});

exports.nearby = async (req) => {
	const user = req.user;
	let userList = [];
	let coordinates = req.user.location.coordinates;

	try {
		userList = await makeMongoDbServiceUser.getDocumentByCustomAggregation([
			{
				$geoNear: {
					near: {
						type: "Point",
						coordinates: coordinates,
					},
					spherical: true,
					distanceField: "distance",
					distanceMultiplier: 0.001,
				},
			},
			{
				$match: {
					$expr: {
						$and: [
							{ $ne: [{ $toObjectId: user._id }, "$_id"] },
							{ $eq: ["$gender", user.interested_gender] },
						],
					},
				},
			},
		]);
		return message.successResponse(
			{ "Content-Type": "application/json" },
			responseCode.success,
			userList
		);
	} catch (error) {
		console.log(error);
		throw message.failureResponse(
			{ "Content-Type": "application/json" },
			responseCode.internalServerError
		);
	}
};
