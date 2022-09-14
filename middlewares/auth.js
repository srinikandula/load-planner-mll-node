"use strict";
var jwt = require('jsonwebtoken');
var config = require('./../config/config');
var Groups = require('../controllers/user.controller');
var staticFilesRegex = /\.(html|css|ico|png|jpeg|jpg|js|eot|svg|ttf|woff|json)$/;

function authMiddleware(req, res, next) {
    var token = '';
    if (req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.substring(7, req.headers.authorization.length)
        jwt.verify(token, config.jwt.secret, function (err, decoded) {
            if (err) {
                res.status(401).send({status: false, message: 'Invalid token'})
            } else {
                req.jwt = decoded;
                next();
            }
        });
    }
}

module.exports = authMiddleware;
