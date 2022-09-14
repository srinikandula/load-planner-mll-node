const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const bcrypt = require("bcryptjs");

const {
    opsMail,
    userMail,
    userLoginPassword,
} = require("../services/userMail.service");
const Order = require("../models/order.model");
const {decode} = require("jsonwebtoken");

exports.createUser = async (req, res, next) => {
    const {fullName, email, username, companyName, phoneNumber, active} = req.body;
    let newUser = {
        fullName,
        email,
        username,
        companyName,
        phoneNumber,
        active: false,
    };
    console.log("Creating", newUser)

    try {
        const oldUsername = await User.findOne({username});
        if (oldUsername)
            return res
                .status(400)
                .json({success: false, message: "Username already exists"});
        const oldEmail = await User.findOne({email});
        if (oldEmail)
            return res
                .status(400)
                .json({success: false, message: "Email already exists"});

        const result = await User.create(newUser);
        await opsMail(newUser);
        await userMail(newUser);
        res.status(201).json({success: true, result});
    } catch (err) {
        console.log(err)
        res.status(500).json({success: false, message: "Something went wrong", error: err});
    }
};

exports.createLogin = async (req, res) => {
    const {username} = req.body;
    let pass = Math.random().toString(36).slice(2, 8);
    let mailPassword = pass;
    const salt = await bcrypt.genSalt(10);
    pass = await bcrypt.hash(pass, salt);

    User.findOneAndUpdate(
        {username: username},
        {$set: {password: pass, active: true}},
        {new: true},
        async (err, user) => {
            if (err) throw err;
            if (!user) {
                return res.json({success: false, message: "user not found"});
            } else {
                await userLoginPassword(user, mailPassword);
                res.json({success: true, message: "username and password created"});
            }
        }
    );
};

exports.login = async (req, res, next) => {
    const {username, password} = req.body;
    try {
        const oldUser = await User.findOne({username});
        var obj = {
            id: oldUser._id,
            username: oldUser.username
        };
        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
        if (!oldUser)
            return res({success: false, message: "User doesn't exists"})
            // return res
            //     .status(404)
        //     .json({success: false, message: "User doesn't exists"});
        else if (!isPasswordCorrect)
            return res({success: false, message: "Wrong Password"});
        // return res.status(400).json({success: false, message: "Wrong Password"});
        // const token = jwt.sign(obj, config.jwt.secret, {expiresIn: "1h",})
        jwt.sign(obj, config.jwt.secret, config.jwt.options, (err, token) => {
            return res({success: true, result: obj, token});
        });
        // const token = jwt.sign(obj, config.secret, {expiresIn: "1h",});
        // return res({success: true, result: obj, token});
        // return res.status(200).json({success: true, result: oldUser, token});
    } catch (err) {
        // return res({success: false, message: "Something went wrong"});
        return res.status(500).json({success: false, message: "Something went wrong"});
    }
};

exports.updatePassword = async (req, res) => {

    const {username, password} = req.body;
    let newPassword = password;

    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);

    try {
        User.findOneAndUpdate(
            {username: username},
            {$set: {password: newPassword}},
            {new: true},
            async (err, user) => {
                if (err) throw err;
                if (!user) {
                    return res
                        .status(404)
                        .json({success: false, message: "user not found"});
                } else {
                    res
                        .status(201)
                        .json({success: true, message: "password updated successfully"});
                }
            }
        );
    } catch (err) {
        res.status(500).join({success: false, message: err});
    }
};

exports.allUsers = async (params, next) => {
    var condition = {};
    if (params.searchKey) {
        condition = {
            $or:
                [
                    {"name": new RegExp(params.searchKey, "gi")}
                ]
        };
    }
    try {
        User.find({condition}, (err, users) => {
            console.log('================', err, users)
            if (err) {
                next({success: false, message: err});
            } else {
                next({success: true, length: users.length, data: users});
            }
        });
    } catch (err) {
        next({success: false, message: err});
    }
};


exports.pendingUsers = async (req, res) => {
    try {
        let pendingUserQuery = User.find({status: 'ACTIVATION_PENDING'});
        const page = req.body.page || 1;
        const pageSize = req.body.count || 10;
        const skip = (page - 1) * pageSize;
        const total = await User.countDocuments({status: 'ACTIVATION_PENDING'});
        const pages = Math.ceil(total / pageSize);
        pendingUserQuery = pendingUserQuery.skip(skip).limit(pageSize);
        if (page > pages) {
            return res({status: true, message: "No page found",});
        }
        const result = await pendingUserQuery;
        console.log(result)
        return res({status: true, count: result.length, page, pages, data: result, total});
    } catch (err) {
        res.status(500).join({status: false, message: err});
    }
};


exports.activeUsers = async (req, res, next) => {
    try {
        let activeUserQuery = User.find({status: 'ACTIVATED'});
        const page = req.body.page || 1;
        const pageSize = req.body.count || 10;
        const skip = (page - 1) * pageSize;
        const total = await User.countDocuments({status: 'ACTIVATED'});
        const pages = Math.ceil(total / pageSize);
        activeUserQuery = activeUserQuery.skip(skip).limit(pageSize);
        if (page > pages) {
            return res({status: true, message: "No page found",});
        }
        const result = await activeUserQuery;
        console.log(result)
        return res({status: true, count: result.length, page, pages, data: result, total});
    } catch (err) {
        res.status(500).join({status: false, message: err});
    }
};

exports.activateUser = async (req, res) => {
    try {
        console.log(req.jwt)
        activeUserData = await User.updateOne({'_id': req.body.userId}, {$set: {'status': 'ACTIVATED', 'updatedBy': req.jwt.id}})
        // activeUserData = await User.findOne({'_id': req.body.userId})
        return res({status: true, data: activeUserData})
    } catch (err) {
        // console.log(err)
        res.status(500).join({status: false, message: err});
    }
}

exports.profile = (req, res, next) => {
    res.json({user: req.user});
};
