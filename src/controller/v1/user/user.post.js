const { User } = require("../../../models/user.model");
const { UserDeactivation } = require("../../../models/userDeactivations.model");
const makeMongoDbServiceUser = require("../../../services/mongoDbService")({
	model: User,
});
const makeMongoDbServiceUserDeactivation =
	require("../../../services/mongoDbService")({
		model: UserDeactivation,
	});
const message = require("../../../utils/messages");
const responseCode = require("../../../utils/responseCode");
const _ = require("lodash");

// Create and Save a new Movie
exports.create = async (req) => {
	try {
		var email;
		if (
			String(req.originalUrl).endsWith("admin/user") &&
			req.user.isAdmin == "Y"
		) {
			email = req.body.email;
		} else {
			email = req.user;
		}
		req.body.email = email;
		// Make sure this account doesn't already exist
		const user = await makeMongoDbServiceUser.getSingleDocumentByQuery(
			{
				email,
			},
			[]
		);
		if (user) {
			return message.isAssociated(
				{ "Content-Type": "application/json" },
				responseCode.conflict
			);
		}

		const userData = req.body;
		const newUser = await makeMongoDbServiceUser.createDocument(userData);

		return message.successResponse(
			{ "Content-Type": "application/json" },
			responseCode.created,
			_.pick(newUser, [
				"_id",
				"first_name",
				"last_name",
				"email",
				"gender",
        "interested_gender",
				"dateOfBirth",
				"about",
				"pics",
				"selfie",
        "height",
        "weight",
        "relationship_status",
        "interests",
        "looking_for",
			])
		);
	} catch (error) {
		console.log(error);
		throw message.failureResponse(
			{ "Content-Type": "application/json" },
			responseCode.internalServerError
		);
	}
};

exports.deleteUser = async (req) => {
	let { doer, reason } = req.body;
	let user = {
		doer,
		reason,
		userId: req.params.id,
	};
	try {
		const isuser = await makeMongoDbServiceUser.softDeleteDocument(
			req.params.id
		);
		if (isuser) {
			await makeMongoDbServiceUserDeactivation.createDocument(user);
			return message.requestValidated(
				{ "Content-Type": "application/json" },
				responseCode.success,
				"User has been deleted successfully"
			);
		} else {
			return message.failedSoftDelete(
				{ "Content-Type": "application/json" },
				responseCode.conflict
			);
		}
	} catch (error) {
		console.log(error);
		return message.failureResponse(
			{ "Content-Type": "application/json" },
			responseCode.internalServerError
		);
	}
};

exports.getUsers = async (req) => {
	try {
		let meta = {};
		let userList = [];
		const pageNumber = parseInt(req.query.pageNumber);
		const pageSize = 10;
		const { location } = req.body;
		const coordinates =
			location && Array.isArray(location.coordinates)
				? location.coordinates
				: [0, 0];
		const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
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
						$and: [{ $ne: ["$status", "D"] }],
					},
				},
			},
			{
				$project: {
					first_name: 1,
					last_name: 1,
					email: 1,
					about: 1,
					dateOfBirth: 1,
					distance: 1,
					pics: 1,
          selfie: 1,
					isLiked: 1,
					interested_gender: 1,
					secondaryData: 1,
					gender: 1,
					status: 1,
					height: 1,
          weight: 1,
          relationship_status: 1,
          interests: 1,
          looking_for: 1,
				},
			},
			{ $sort: { distance: 1 } },
			{ $skip: skip },
			{ $limit: pageSize },
		]);
		const userCount = await makeMongoDbServiceUser.getCountDocumentByQuery({});
		meta = {
			pageNumber,
			pageSize,
			totalCount: userCount,
			prevPage: parseInt(pageNumber) === 1 ? false : true,
			nextPage:
				parseInt(userCount) / parseInt(pageSize) <= parseInt(pageNumber)
					? false
					: true,
			totalPages: Math.ceil(parseInt(userCount) / parseInt(pageSize)),
		};
		return message.successResponse(
			{ "Content-Type": "application/json" },
			responseCode.success,
			userList,
			meta
		);
	} catch (error) {
		if (error.name === "ValidationError") {
			return message.inValidParam(
				{ "Content-Type": "application/json" },
				responseCode.validationError,
				error.message
			);
		}
		return message.failureResponse(
			{ "Content-Type": "application/json" },
			responseCode.internalServerError,
			error.message
		);
	}
};
