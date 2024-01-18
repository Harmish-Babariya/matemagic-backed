const { User } = require("../../../models/user.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: User,
});
const message = require("../../../utils/messages");
const responseCode = require("../../../utils/responseCode");

// Retrieve and return all users from the database.
exports.findAll = async (req) => {
  try {
    let meta = {};
    let userList = [];
    const pageNumber = parseInt(req.query.pageNumber);
    const pageSize = 10;
    const { _id, interested_gender, location } = req.user;
    const coordinates =
      location && Array.isArray(location.coordinates)
        ? location.coordinates
        : [0, 0];
    const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
    userList = await makeMongoDbService.getDocumentByCustomAggregation([
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
        $lookup: {
          from: "filters",
          let: {
            receiverId: { $toObjectId: _id },
            userId: { $toObjectId: "$_id" },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$doer", "$$receiverId"] },
                    { $eq: ["$reciever", "$$userId"] },
                    { $eq: ["$flag", "L"] },
                  ],
                },
              },
            },
          ],
          as: "filterData",
        },
      },
      {
        $addFields: {
          isLiked: {
            $cond: {
              if: {
                $or: [
                  { $eq: [{ $size: "$filterData" }, 0] },
                  {
                    $ne: [
                      { $arrayElemAt: ["$filterData.reciever", 0] },
                      "$_id",
                    ],
                  },
                ],
              },
              then: false,
              else: true,
            },
          },
        },
      },
      {
        $unset: "filterData",
      },
      {
        $match: {
          $expr: {
            $and: [
              { $ne: [{ $toObjectId: _id }, "$_id"] },
              { $eq: ["$gender", interested_gender] },
              { $ne: ["$status", "D"] },
            ],
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
          isLiked: 1,
          interested_gender: 1,
          secondaryData: 1,
          gender: 1,
          status: 1,
        },
      },
      { $sort: { distance: 1 } },
      { $skip: skip },
      { $limit: pageSize },
    ]);
    const userCount = await makeMongoDbService.getCountDocumentByQuery({});
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

exports.findById = async (req) => {
  try {
    const select = [];
    let getUser = await makeMongoDbService.getSingleDocumentById(
      req.params.id,
      select
    );
    
    if(!getUser && getUser.status === 'D'){
      return message.recordNotFound(
        { "Content-Type": "application/json" },
        responseCode.notFound
      );
    }
    return message.successResponse(
      { "Content-Type": "application/json" },
      responseCode.success,
      getUser
    );
  } catch (error) {
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
