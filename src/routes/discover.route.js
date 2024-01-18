const express = require("express");
const router = express.Router();

const validate = require("../validations/handler");
const rules = require("../validations/discover.validation");
const discover = require("../controller/v1/discover/index");

router.post("/popular", discover.popular);

router.post("/viewed", discover.viewed);

router.post("/liked", discover.liked);

router.post("/nearby", discover.nearby);

router.post("/filter", validate(rules.getFilteredUsers), discover.getFilteredUsers);

module.exports = router;
