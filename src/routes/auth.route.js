const express = require("express");
const jwt = require("jsonwebtoken");
const { authenticateUser } = require("../controller/v1/auth/index")
const router = express.Router();

const validate = require("../validations/handler");
const rules = require("../validations/auth.validation");

router.post("/generateToken", (req, res) => {
    const jwtToken = jwt.sign({ email: req.body.email }, process.env.SECRET_STRING);
    return res.json({ token: jwtToken });
});
router.post("/:platform", validate(rules.authUser), authenticateUser);

module.exports = router;
