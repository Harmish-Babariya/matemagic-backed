/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const filterSchema = mongoose.Schema({
    doer: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    reciever: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    flag: { // L- liked, V - viewed
        type: String,
        required: true,
    },
},
    {
        timestamps: true
    });

filterSchema.method("toJSON", function () {
    const { __v, ...object } = this.toObject({ virtuals: true });
    object.id = object._id;
    return object;
});

exports.filterSchema = filterSchema;
exports.Filter = mongoose.model("Filter", filterSchema);
