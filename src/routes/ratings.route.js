const express = require("express");
const router = express.Router();

const validate = require("../validations/handler");
const rules = require("../validations/ratings.validation");
const ratings = require("../controller/v1/ratings");

// Create a new Rating
router.post("/", validate(rules.createRatings), ratings.create);

router.get("/", validate(rules.listRatings), ratings.findAll);

router.get("/:id", validate(rules.getRatingById), ratings.findById);

router.delete("/:id", validate(rules.getRatingById), ratings.delete);

module.exports = router;
