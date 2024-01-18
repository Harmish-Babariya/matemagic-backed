const express = require("express");
const router = express.Router();
const { authenticateAdminToken } = require("../../middleware/checkAdmin.mdl");
const userRoutes = require("./user.admin");

router.use(authenticateAdminToken);

router.use("/user", userRoutes);

module.exports = router;
