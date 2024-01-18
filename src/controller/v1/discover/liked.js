const { Filter } = require("../../../models/filter.model");
// const { User } = require("../../../models/user.model");
const message = require("../../../utils/messages")
const responseCode = require("../../../utils/responseCode");
// const handleResponse = require("../../../helpers/handleResponse");
const makeMongoDbServiceFilter = require("../../../services/mongoDbService")({
    model: Filter,
});
// const makeMongoDbServiceUser = require("../../../services/mongoDbService")({
//     model: User,
// });

exports.liked = async (req) => {
    const user = req.user;
    try {
        const users = await makeMongoDbServiceFilter.getDocumentByQueryPopulate({ reciever: user._id, flag: 'L' }, [], ['doer reciever', 'first_name last_name'], null, null, { createdAt: -1 });
        return message.successResponse(
            { "Content-Type": "application/json" },
            responseCode.created,
            users
        );
    } catch (error) {
        console.log(error);
        throw message.failureResponse(
            { "Content-Type": "application/json" },
            responseCode.internalServerError
        );
    }
}