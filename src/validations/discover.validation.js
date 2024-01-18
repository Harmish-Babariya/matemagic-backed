const { body } = require("express-validator");

module.exports = {
	getFilteredUsers: [
		body('maxDistance').optional().isInt({ min: 1 }).withMessage('Invalid max distance'),
		body('minAge').optional().isInt({ min: 1, max: 500 }).withMessage('Invalid minimum age'),
		body('maxAge').optional().isInt({ min: 1, max: 500 }).withMessage('Invalid maximum age'),
		body('sortParameter').optional().isIn(['popularity', 'age', 'distance']).withMessage('Invalid sort parameter'),
		body('searchQuery').optional().isString().withMessage('Invalid search'),
		body('interestedGender').optional().isString().isIn(['M', 'F']).withMessage('Invalid search name'),
	]
};
