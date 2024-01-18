const express = require("express");
const router = express.Router();
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.route");
const discoverRoutes = require("./discover.route");
const interactRoutes = require("./interact.route");
const ratingsRoute = require("./ratings.route");
const { authenticateToken } = require("../middleware/auth.mdl");

router.use("/user", userRoutes);

router.use("/auth", authRoutes);

router.use("/discover", authenticateToken, discoverRoutes);

router.use("/interact", authenticateToken, interactRoutes);

router.use("/ratings", authenticateToken, ratingsRoute);

module.exports = router;
