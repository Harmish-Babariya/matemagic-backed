const { Rating } = require("../../../models/rating.model");
const makeMongoDbServiceRatings = require("../../../services/mongoDbService")({
  model: Rating,
});
const messages = require("../../../utils/messages");
const responseCode = require("../../../utils/responseCode");

exports.createRatings = async (req) => {
  try {
    const { _id } = req.user;

    const { star, message } = req.body;
    const ratings = {star, message , userId: _id}
    const newRatings = await makeMongoDbServiceRatings.createDocument(ratings);

    return messages.successResponse(
      { "Content-Type": "application/json" },
      responseCode.created,
      newRatings
    );
  } catch (error) {
    console.log(error);
    throw messages.failureResponse(
      { "Content-Type": "application/json" },
      responseCode.internalServerError
    );
  }
};
