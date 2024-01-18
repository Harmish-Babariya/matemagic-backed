const express = require("express");
const router = express.Router();

const validate = require("../validations/handler");
const rules = require("../validations/user.validation");
const user = require("../controller/v1/user");
const { handleImageFile } = require("../services/multerService");
const { authenticateToken } = require("../middleware/auth.mdl");

// Create a new user
router.post("/", authenticateToken, handleImageFile, validate(rules.createUser), user.create);

// Retrieve all user
router.get("/", authenticateToken, validate(rules.listUsers), user.findAll);

// Retrieve all user
router.post("/all", validate(rules.getUsers), user.getAll);

// Retrieve a single user with id
router.get("/:id", authenticateToken, validate(rules.getUserById), user.findById);

// Update a user
router.put("/:id", authenticateToken, handleImageFile, validate(rules.updateUser), user.update);

// Delete a user
router.post("/delete/:id", authenticateToken, validate(rules.deleteUser), user.deleteUser);

module.exports = router;
