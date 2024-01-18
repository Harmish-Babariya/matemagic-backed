/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const userDeactivationSchema = mongoose.Schema(
  {
    doer: {//'A' = admin, 'U' = user
      type: String,
      required: true,
      minlength: 1,
      maxlength: 1,
    },
    reason: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userDeactivationSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject({ virtuals: true });
  object.id = object._id;
  return object;
});

exports.userDeactivationSchema = userDeactivationSchema;
exports.UserDeactivation = mongoose.model(
  "UserDeactivation",
  userDeactivationSchema
);
