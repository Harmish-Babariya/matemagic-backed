/* eslint-disable no-unused-vars */
const { body, param, query, header } = require('express-validator');


module.exports = {
    authUser: [
        body('token', 'Enter valid token').notEmpty().isString(),
        body('email', 'Enter valid email').notEmpty().isEmail(),
        body('id', 'Enter valid id').optional().isString(),
    ],
}