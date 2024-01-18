const express = require("express");
const router = express.Router();
const validate = require("../../validations/handler");
const rules = require("../../validations/user.validation");
const user = require("../../controller/v1/user");
const admin = require('../../controller/v1/admin')

const adminUser = require("../../controller/v1/admin/index");
// const { authenticateAdminToken } = require("../../middleware/checkAdmin.mdl");
const { handleImageFile } = require("../../services/multerService");

router.post("/", handleImageFile, validate(rules.createUser), user.create);

// Get counts of users by status
router.get("/countByStatus", adminUser.countByStatus);

router.get("/getByStatus", validate(rules.getByStatus), adminUser.getByStatus);

// Update a user
router.put("/:id", handleImageFile, validate(rules.updateUser), user.update);

router.get("/:id", validate(rules.getUserById), admin.findById);

module.exports = router;
