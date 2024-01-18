const { Rating } = require("../../../models/rating.model");
const message = require("../../../utils/messages");
const responseCode = require("../../../utils/responseCode");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: Rating,
});

exports.findAll = async (req) => {
  try {
    let meta = {};
    let ratingsList = [];
    const pageNumber = parseInt(req.query.pageNumber);
    const pageSize = 10;
    const skip = pageNumber === 1 ? 0 : parseInt(pageNumber * pageSize);
    ratingsList = await makeMongoDbService.getDocumentByQuery(
      {},
      [],
      pageNumber,
      pageSize
    );
    const ratingsCount = ratingsList.length;
    meta = {
      pageNumber,
      pageSize,
      totalCount: ratingsCount,
      prevPage: parseInt(pageNumber) === 1 ? false : true,
      nextPage:
        parseInt(ratingsCount) / parseInt(pageSize) <= parseInt(pageNumber)
          ? false
          : true,
      totalPages: Math.ceil(parseInt(ratingsCount) / parseInt(pageSize)),
    };
    return message.successResponse(
      { "Content-Type": "application/json" },
      responseCode.success,
      ratingsList,
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
    let getRating = await makeMongoDbService.getSingleDocumentById(
      req.params.id,
      select
    );

    if (!getRating) {
      return message.recordNotFound(
        { "Content-Type": "application/json" },
        responseCode.notFound
      );
    }
    return message.successResponse(
      { "Content-Type": "application/json" },
      responseCode.success,
      getRating
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
