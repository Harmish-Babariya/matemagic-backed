/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		type: String,
		required: true,
		unique: true,
	},
	gender: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 1,
	},
	interested_gender: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 1,
	},
	dateOfBirth: {
		type: Date,
	},
	about: {
		type: String,
	},
	pics: {
		type: Array,
		required: true,
	},
	selfie: {
		type: Array,
		required: true,
	},
	height: {
		type: Number,
		required: false,
	},
	weight: {
		type: Number,
		required: false,
	},
	relationship_status: {
		type: String,
		required: false,
	},
	interests: {
		type: Array,
		required: false,
	},
	looking_for: {
		type: Array,
		required: false,
	},
	location: {
		type: {
			type: String,
			default: "Point",
			required: true,
		},
		coordinates: {
			type: [Number],
			required: true,
		},
	},
	isAdmin: {
		type: String,
		minlength: 1,
		maxlength: 1,
		default: "N",
	},
	status: {
		type: String,
		minlength: 1,
		maxlength: 1,
	},
});

userSchema.method("toJSON", function () {
	const { __v, ...object } = this.toObject({ virtuals: true });
	object.id = object._id;
	return object;
});

// pass auth token through the models [encapsulating]
userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.SECRET_STRING, {
		expiresIn: process.env.REFRESH_TOKEN_LIFE,
	});
	return token;
};

exports.userSchema = userSchema;
exports.User = mongoose.model("User", userSchema);
