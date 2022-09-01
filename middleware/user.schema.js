const joi = require("@hapi/joi");

const schema = {
    user: joi.object({
        fullName: joi.string().min(3).max(100).required(),
        username: joi.string().min(3).max(100).required(),
        companyName: joi.string().min(2).max(100).required(),
        customers: joi.array().min(1).max(100).required(),
        email: joi.string().email().required()
        // password: joi.string().required(),
    })
};

module.exports = schema;