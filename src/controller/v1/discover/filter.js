// const { Filter } = require("../../../models/filter.model");
const { User } = require("../../../models/user.model");
const message = require("../../../utils/messages")
const responseCode = require("../../../utils/responseCode");
// const handleResponse = require("../../../helpers/handleResponse");
// const makeMongoDbServiceFilter = require("../../../services/mongoDbService")({
//     model: Filter,
// });
const makeMongoDbServiceUser = require("../../../services/mongoDbService")({
    model: User,
});

exports.getFilteredUsers = async (req) => {
    const user = req.user;
    let { maxDistance, maxAge, minAge, sortParameter, searchQuery, interestedGender } = req.body;
    const sessionUserCoordinates = user.location.coordinates;
    const currentYear = new Date().getFullYear();
    let pipeline = [
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: sessionUserCoordinates,
                },
                spherical: true,
                distanceField: 'distance',
                distanceMultiplier: 0.001,
            },
        },
        {
            $lookup: {
                from: 'filters',
                let: { userId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$reciever', '$$userId'] },
                                    { $in: ['$flag', ['L', 'V']] },
                                ],
                            },
                        },
                    },
                ],
                as: 'interactions',
            },
        },
        {
            $project: {
                _id: 1,
                first_name: 1,
                last_name: 1,
                distance: 1,
                gender: 1,
                age: {
                    $subtract: [currentYear, { $year: '$dateOfBirth' }],
                },
                likesCount: {
                    $size: {
                        $filter: {
                            input: '$interactions',
                            as: 'interaction',
                            cond: { $eq: ['$$interaction.flag', 'L'] },
                        },
                    },
                },
                viewsCount: {
                    $size: {
                        $filter: {
                            input: '$interactions',
                            as: 'interaction',
                            cond: { $eq: ['$$interaction.flag', 'V'] },
                        },
                    },
                },
            },
        },
        {
            $match: {
                $expr: { $ne: [{ $toObjectId: user._id }, "$_id"] }
            },
        }
    ];

    if (sortParameter === 'popularity') {
        pipeline.push({ $sort: { likesCount: -1, viewsCount: -1 } });
    } else if (sortParameter === 'age') {
        pipeline.push({ $sort: { age: 1 } });
    } else if (sortParameter === 'distance') {
        pipeline.push({ $sort: { distance: 1 } });
    }

    if (maxDistance) {
        pipeline.push({ $match: { distance: { $lte: parseInt(maxDistance) } } });
    }
    if (maxAge) {
        pipeline.push({ $match: { age: { $lte: parseInt(maxAge) } } });
    }
    if (minAge) {
        pipeline.push({ $match: { age: { $gte: parseInt(minAge) } } });
    }
    if (searchQuery) {
        pipeline.push(
            {
                $match: {
                    $or: [
                        { first_name: { $regex: searchQuery, $options: 'i' } },
                        { last_name: { $regex: searchQuery, $options: 'i' } }
                    ]
                }
            }
        );
    }
    if (interestedGender) {
        pipeline.push({ $match: { $expr: { $eq: ["$gender", interestedGender] } } });
    }
    pipeline.push({ $project: { likesCount: 0, viewsCount: 0 } });
    try {
        const getFilteredUsers = await makeMongoDbServiceUser.getDocumentByCustomAggregation(pipeline);
        return message.successResponse(
            { "Content-Type": "application/json" },
            responseCode.created,
            getFilteredUsers
        );
    } catch (error) {
        console.log(error);
        throw message.failureResponse(
            { "Content-Type": "application/json" },
            responseCode.internalServerError
        );
    }
}