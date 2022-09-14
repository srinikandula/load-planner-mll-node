const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        required: 'Email address is required...',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    username: {
        type: String,
        required: true,
        required: 'username is required',
        unique: true,
    },
    companyName: {
        type: String,
        required: true,
        required: 'companyName is required'
    },
    phoneNumber: {
        type: Number,
        required: true,
        required: 'mobile no required',
    },
    password: {
        type: String,
    },
    active: {
        type: Boolean,
        // required:true
    },
    activatedBy: {
        type: String,
    },
    activatedOn: {
        type: Date,
    },
    status: {
        type: String
    },
    updatedBy: {
        type: String
    }

}, {timestamps: true})

let User = module.exports = mongoose.model('User', userSchema, 'user')

