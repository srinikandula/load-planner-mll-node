const joi = require("@hapi/joi");

const schema = {
    user: joi.object({
        fullName: joi.string().min(3).max(100).required(),
        username: joi.string().min(3).max(100).required(),
        companyName: joi.string().min(2).max(100).required(),
        phoneNumber: joi.string().min(6).max(13).required(),
        email: joi.string().email().required()
        // password: joi.string().required(),
    }),
    createLogin: joi.object({ 
        username: joi.string().min(3).max(100).required()
    }),
    loginUser: joi.object({
         username: joi.string().min(3).max(100).required(),
         password: joi.string().min(3).max(100).required()
    })
};

module.exports = schema;
