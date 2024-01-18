const { User } = require("../../../models/user.model");
const { UserDeactivation } = require("../../../models/userDeactivations.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
	model: User,
});
const makeMongoDbServiceUserDeletion = require("../../../services/mongoDbService")({ 
  model: UserDeactivation, });
const message = require("../../../utils/messages");
const responseCode = require("../../../utils/responseCode");
const { ObjectId } = require('mongodb');

exports.findById = async (req) => {
  try {
    const select = [];
    let a = await makeMongoDbServiceUserDeletion.getSingleDocumentByQuery(
      { userId: req.params.id}
    );
    
    let getUser = await makeMongoDbService.getSingleDocumentById(
      req.params.id,
      select
    );
    if (getUser.status === 'D') {
      if (a && a.reason) {
        getUser.reason = a.reason;
      } else {
        getUser.reason = '';
      }
    } 
    return message.successResponse(
      { "Content-Type": "application/json" },
      responseCode.success,
      { user : getUser, reason : getUser.reason }
    );
  } catch (error) {
	console.log(error);
    if (error.kind === "ObjectId") {
      throw message.recordNotFound(
        { "Content-Type": "application/json" },
        responseCode.notFound
      );
    }
    throw message.failureResponse(
      { "Content-Type": "application/json" },
      responseCode.internalServerError
    );
  }
};

exports.countByStatus = async (req) => {
	try {
		var userList = await makeMongoDbService.getDocumentByCustomAggregation([
			{
				$match: {
					status: { $in: ["A", "D", "P", "R", "S", "B"] },
				},
			},
			{
				$group: {
					_id: "$status",
					count: { $sum: 1 },
				},
			},
		]);
		return message.successResponse(
			{ "Content-Type": "application/json" },
			responseCode.success,
			userList
		);
	} catch (error) {
		throw message.failureResponse(
			{ "Content-Type": "application/json" },
			responseCode.internalServerError
		);
	}
};
exports.getByStatus = async (req) => {
	try {
    const matchQuery = {};

    if (req.query.status !== '' && typeof req.query.status !== "undefined") {
      matchQuery.status = req.query.status;
    }
    
    if (req.query.search !== '' && typeof req.query.search !== "undefined") {
      matchQuery.$or = [
        { first_name: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { last_name: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + req.query.search + '.*', $options: 'i' } }
      ];
    }
    
    let userList = await makeMongoDbService.getDocumentByCustomAggregation([
      {
        $match: matchQuery,
      },
    ]);
		return message.successResponse(
			{ "Content-Type": "application/json" },
			responseCode.success,
			userList
		);
	} catch (error) {
    console.log(error)
		throw message.failureResponse(
			{ "Content-Type": "application/json" },
			responseCode.internalServerError
		);
	}
};
