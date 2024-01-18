/* eslint-disable no-unused-vars */
const { Filter } = require("../../../models/filter.model");
// const { User } = require("../../../models/user.model");
const message = require("../../../utils/messages");
const responseCode = require("../../../utils/responseCode");
// const handleResponse = require("../../../helpers/handleResponse");
const makeMongoDbServiceFilter = require("../../../services/mongoDbService")({
	model: Filter,
});
// const makeMongoDbServiceUser = require("../../../services/mongoDbService")({
//     model: User,
// });

exports.popular = async (req) => {
	const user = req.user;
	const pipeline = [
		{
			$match: {
				flag: { $in: ["L", "V"] },
			},
		},
		{
			$group: {
				_id: "$reciever",
				likes: {
					$sum: {
						$cond: [{ $eq: ["$flag", "L"] }, 1, 0],
					},
				},
				views: {
					$sum: {
						$cond: [{ $eq: ["$flag", "V"] }, 1, 0],
					},
				},
			},
		},
		{
			$sort: {
				likes: -1,
				views: -1,
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "_id",
				foreignField: "_id",
				as: "user",
			},
		},
		{
			$project: {
				_id: { $arrayElemAt: ["$user._id", 0] },
				name: {
					$concat: [
						{ $arrayElemAt: ["$user.first_name", 0] },
						" ",
						{ $arrayElemAt: ["$user.last_name", 0] },
					],
				},
				age: {
					$subtract: [
						{ $year: new Date() },
						{ $year: { $arrayElemAt: ["$user.dateOfBirth", 0] } },
					],
				},
				pics: { $arrayElemAt: ["$user.pics", 0] },
				selfie: { $arrayElemAt: ["$user.selfie", 0] },
				gender: { $arrayElemAt: ["$user.gender", 0] },
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
	];
	try {
		const popularUsers =
			await makeMongoDbServiceFilter.getDocumentByCustomAggregation(pipeline);

		return message.successResponse(
			{ "Content-Type": "application/json" },
			responseCode.created,
			popularUsers
		);
	} catch (error) {
		console.log(error);
		throw message.failureResponse(
			{ "Content-Type": "application/json" },
			responseCode.internalServerError
		);
	}
};
