const { Rating } = require("../../../models/rating.model");
const message = require("../../../utils/messages");
const responseCode = require("../../../utils/responseCode");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: Rating,
});

exports.deleteRating = async (req) => {
  try {
    const isRating = await makeMongoDbService.deleteDocument(req.params.id);
    if (isRating) {
      return message.requestValidated(
        { "Content-Type": "application/json" },
        responseCode.success,
        "Rating has been deleted successfully"
      );
    } else {
      return message.failedSoftDelete(
        { "Content-Type": "application/json" },
        responseCode.conflict
      );
    }
  } catch (error) {
    return message.failureResponse(
      { "Content-Type": "application/json" },
      responseCode.internalServerError
    );
  }
};
