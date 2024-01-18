/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    star: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ratingSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject({ virtuals: true });
  object.id = object._id;
  return object;
});

exports.ratingSchema = ratingSchema;
exports.Rating = mongoose.model(
  "Rating",
  ratingSchema
);
