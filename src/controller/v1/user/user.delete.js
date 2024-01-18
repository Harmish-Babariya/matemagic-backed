const { User } = require("../../../models/user.model");
const makeMongoDbServiceUser = require("../../../services/mongoDbService")({
  model: User,
});
const message = require("../../../utils/messages");
const responseCode = require("../../../utils/responseCode");

// Delete a User with the specified id in the request
exports.deleteUser = async (req) => {
  try {
    const isuser = await makeMongoDbServiceUser.softDeleteDocument(req.params.id);
    if (isuser) {
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
    return message.failureResponse(
      { "Content-Type": "application/json" },
      responseCode.internalServerError
    );
  }
};
