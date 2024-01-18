const { body, param, query, header } = require("express-validator");
const { User } = require("../models/user.model");
const makeMongoDbServiceUser = require("../services/mongoDbService")({
	model: User,
});

module.exports = {

  // POST /api/users
  createUser: [
    body('first_name', 'Name can not be empty').notEmpty().isString(),
    body('last_name', 'Name can not be empty').notEmpty().isString(),
    body('gender', 'gender can be "M" for male and "F" for female.').isIn(['M', 'F']).notEmpty().isString().isLength({ min: 1, max: 1 }),
    body('interested_gender', 'intersted_gender can be "M" for male and "F" for female.').isIn(['M', 'F']).notEmpty().isString().isLength({ min: 1, max: 1 }),
    body('dateOfBirth', 'dateOfBirth can not be empty').notEmpty().toDate(),
    body('about', 'about can not be empty').notEmpty().isString(),
    body('pics', 'pics can not be empty').notEmpty().isArray(),
    body('pics', 'pics can not be empty').notEmpty().isArray({min: 4, max: 4}),
    body('selfie', 'selfie can not be empty').notEmpty().isArray({min: 2, max: 2}),
    body('weight', 'weight can not be empty').notEmpty().isNumeric(),
    body('relationship_status', 'relationship_status can be "S", "M" or "R".').notEmpty().isIn(['M', 'S', 'R']).isString(),//single, married, 
    body('interests', 'interests can not be empty.').notEmpty().isArray(),
    body('looking_for', 'looking_for can not be empty.').notEmpty().isArray(),
    // body('location', 'location can not be empty').notEmpty(),
    body('location.coordinates', 'location.coordinates can be [longitude, latitude]').notEmpty().isArray({min:2, max:2}),
    body('status', 'status can be A-active, D-deleted, P-pending, R-Reported, S- Subscribed, B-ReBuyer').optional().isIn(['A', 'D', 'P', 'R', 'S', 'B']).default('P').notEmpty().isString(),//active, delete, pending
  ],

  // PATCH /api/users/:userId
  updateUser: [
    param('id', 'User id is required').exists(),
    body('first_name', 'Name can not be empty').optional().notEmpty().isString(),
    body('last_name', 'Name can not be empty').optional().notEmpty().isString(),
    body('gender', 'gender can be "M" for male and "F" for female.').optional().isIn(['M', 'F']).notEmpty().isString().isLength({ min: 1, max: 1 }),
    body('interested_gender', 'intersted_gender can be "M" for male and "F" for female.').optional().isIn(['M', 'F']).notEmpty().isString().isLength({ min: 1, max: 1 }),
    body('dateOfBirth', 'dateOfBirth can not be empty').optional().notEmpty().toDate(),
    body('about', 'about can not be empty').optional().notEmpty().isString(),
    body('pics', 'pics can not be empty').optional().isArray({min: 4, max: 4}),
    body('selfie', 'selfie can not be empty').optional().isArray({min: 2, max: 2}),
    body('height', 'height can not be empty').optional().notEmpty().isNumeric(),
    body('weight', 'weight can not be empty').optional().notEmpty().isNumeric(),
    body('relationship_status', 'relationship_status can be "S", "M" or "R".').optional().notEmpty().isIn(['M', 'S', 'R']).isString(),
    body('interests', 'interests can not be empty.').optional().notEmpty().isArray(),
    body('looking_for', 'looking_for can not be empty.').optional().notEmpty().isArray(),
    body('location', 'location can not be empty').optional().notEmpty().isObject(),
    body('location.coordinates', 'location.coordinates can be [longitude, latitude]').optional().notEmpty().isArray(),
    body('status', 'status can be A-active, D-deleted, P-pending, R-Reported, S- Subscribed, B-ReBuyer').optional().isIn(['A', 'D', 'P', 'R', 'S', 'B']).default('P').notEmpty().isString(),//active, delete, pending
  ],

	// GET /api/users
	listUsers: [
		query("pageNumber", "user query parameter should be number")
			.toInt()
			.default(1),
	],

    // POST /api/users/all
  getUsers: [
    query('pageNumber', 'user query parameter should be number').toInt().default(1),
    body('location.coordinates', 'location.coordinates can be [longitude, latitude]').notEmpty().isArray({min:2, max:2}),
],

	// GET /api/users/:id
	getUserById: [
		param("id", "User not found with this Id")
			.optional()
			.custom((value) => {
				return makeMongoDbServiceUser
					.getSingleDocumentById(value)
					.then((user) => {
						if (!user) {
							return Promise.reject("User not found with this Id");
						}
					});
			}),
	],

	// Post /api/users/delete/:userId
	deleteUser: [
		param("id", "User id is required").exists(),
		body("doer", "doer can not be empty")
			.notEmpty()
			.isIn(["U", "A"])
			.isString(),
		body("reason", "reason can not be empty").notEmpty().isString(),
	],

  //GET /api/v1/admin/getByStatus?status=A&search=patel
  getByStatus: [
    query('status', 'status can be A-active, D-deleted, P-pending, R-Reported, S- Subscribed, B-ReBuyer').optional().isIn(['A', 'D', 'P', 'R', 'S', 'B']).notEmpty().isString(),//active, delete, pending,
    query('search', 'Search user by firstname, lastname and email').optional().notEmpty().isString()
  ]
};
