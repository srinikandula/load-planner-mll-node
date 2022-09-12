const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const bcrypt = require("bcryptjs");

const {
    opsMail,
    userMail,
    userLoginPassword,
} = require("../services/userMail.service");

exports.createUser = async (req, res, next) => {
    console.log(res.body);
    const {fullName, email, username, companyName, mobile, active} = req.body;
    let newUser = {
        fullName,
        email,
        username,
        companyName,
        mobile,
        active: false,
    };
    console.log("Creating", newUser)
    try {
        const oldUsername = await User.findOne({username});
        if (oldUsername)
            return res({success: false, message: "Username already exists"})
            // return res
            //     .status(400)
            //     .json({success: false, message: "Username already exists"});
        const oldEmail = await User.findOne({email});
        if (oldEmail)
            return res({success: false, message: "Email already exists"})
            // return res
            //     .status(400)
            //     .json({success: false, message: "Email already exists"});

        const oldFullName = await User.findOne({fullName});
        if (oldFullName)
            return res({success: false, message: "FullName already exists"})
            // return res
            //     .status(400)
            //     .json({success: false, message: "FullName already exists"});

        const result = await User.create(newUser);
        await opsMail(newUser);
        await userMail(newUser);
        res({success: true, result});
        // res.status(201).json({success: true, result});
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
        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
        if (!oldUser)
            return res({success: false, message: "User doesn't exists"})
            // return res
            //     .status(404)
            //     .json({success: false, message: "User doesn't exists"});
        else if (!isPasswordCorrect)
            return res({success: false, message: "Wrong Password"});
            // return res.status(400).json({success: false, message: "Wrong Password"});
        const token = jwt.sign({data: oldUser}, config.jwt.secret, {
            expiresIn: "1h",
        });
        return res({success: true, result: oldUser, token});
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


exports.pendingUsers = async (req, res, next) => {

    try {
       await User.find({active: false}, (err, user) => {
            if (err) {
                return res.status(404).json({success: false, message: "error"});
            } else {
                return res
                    .status(200)
                    .json({success: true, length: user.length, data: user});
            }
        });
    } catch (err) {
        res.status(500).join({success: false, message: err});
    }

};


exports.activeUsers = async (req, res, next) => {

    try {
        User.find({active: true}, (err, user) => {
            if (err) {
                return res.status(404).json({success: false, message: "error"});
            } else {
                return res
                    .status(200)
                    .json({success: true, length: user.length, data: user});
            }
        });
    } catch (err) {
        res.status(500).join({success: false, message: err});
    }


};

exports.profile = (req, res, next) => {
  console.log('--------------------', req)
    res.json({user: req.user});
};
