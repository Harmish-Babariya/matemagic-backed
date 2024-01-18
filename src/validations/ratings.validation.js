const { body, param, query, header } = require("express-validator");
const { Rating } = require("../models/rating.model");
const makeMongoDbService = require("../services/mongoDbService")({
  model: Rating,
});

module.exports = {
  // POST /api/rating
  createRatings: [
    body("message", "reason can not be empty").notEmpty().isString(),
    body("star", "star must be a number between 1 and 5")
      .notEmpty()
      .isFloat({ min: 1, max: 5 }),
  ],

  // GET /api/ratings
  listRatings: [
    query("pageNumber", "pageNumber query parameter should be number")
      .toInt()
      .default(1),
  ],

  // GET /api/ratings/:id
  getRatingById: [
    param("id", "Rating not found with this Id")
      .optional()
      .custom((value) => {
        return makeMongoDbService
          .getSingleDocumentById(value)
          .then((rating) => {
            if (!rating) {
              return Promise.reject("Rating not found with this Id");
            }
          });
      }),
  ],
};
