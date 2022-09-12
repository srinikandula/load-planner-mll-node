const {
    user, createLogin, loginUser
} = require("./user.schema");


exports.addUserValidation = async (req, res, next) => {
    const value = await user.validate(req.body);
    if (value.error) {
        res.status(400).json({
            success: false,
            message: value.error.details[0].message
        })
    } else {
        next();
    }
}

exports.createLoginValidation = async (req, res, next) => {
    const value = createLogin.validate(req.body);
    if (value.error) {
        res.status(400).json({
            success: 0,
            message: value.error.details[0].message
        })
    } else {
        next();
    }
}
exports.userLoginValidation = async (req, res, next) => {

    const value = loginUser.validate(req.body);
    if (value.error) {
        res.status(400).json({
            success: 0,
            message: value.error.details[0].message
        })
    } else {
        next();
    }
}

