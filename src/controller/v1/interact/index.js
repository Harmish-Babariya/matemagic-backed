const { Filter } = require("../../../models/filter.model");
const message = require("../../../utils/messages")
const responseCode = require("../../../utils/responseCode");
const handleResponse = require("../../../helpers/handleResponse");
const makeMongoDbServiceFilter = require("../../../services/mongoDbService")({
    model: Filter,
});

exports.interactController = (req, res) => {
    handleResponse(actionController(req), res);
}

const actionController = async (req) => {
    const { action, id } = req.params;
    // const user = "64947963928a75325d8d6a9f";
    const user = req.user;

    if (!["like", "view", "dislike"].includes(action)) {
        throw message.badRequest(
            { "Content-Type": "application/json" },
            responseCode.badRequest,
            { "message": "bad request" }
        );
    }

    try {
        if (action == "view") {
            const actionedData = await makeMongoDbServiceFilter.findOneAndUpdateDocument({
                doer: user._id,
                reciever: id,
                flag: "V"
            }, { updatedAt: new Date() },
                { upsert: true, new: true });
            return message.successResponse(
                { "Content-Type": "application/json" },
                responseCode.created,
                actionedData
            );
        } else if (action == "like" || action == "dislike") {
            const newFlag = action == "like" ? "L" : "N";
            const actionedData = await makeMongoDbServiceFilter.findOneAndUpdateDocument({
                doer: user._id,
                reciever: id,
                flag: { $in: ['L', 'N'] }
            }, { updatedAt: new Date(), flag: newFlag },
                { upsert: true, new: true });
            return message.successResponse(
                { "Content-Type": "application/json" },
                responseCode.created,
                actionedData
            );
        }
    } catch (error) {
        throw message.failureResponse(
            { "Content-Type": "application/json" },
            responseCode.internalServerError
        );
    }
}