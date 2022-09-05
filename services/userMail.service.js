const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

exports.opsMail = async (userData) => {
  let newUser = userData;

  let file = await fs.readFileSync(
    path.join(__dirname, "../template", "opsTemplate.html"),
    "utf8"
  );

  let templateHtmlBody = file
    .replace("$$USERNAME$$", newUser.username)
    .replace("$$COMPANY_NAME$$", newUser.companyName)
    .replace("$$MOBILE$$", newUser.mobile);

  var transporter = await nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: config.fromMail,
      pass: config.mailPassword,
    },
  });

  var mailOptions = {
    from: config.fromMail,
    to: config.toMail,
    subject: "Sending Email using Node.js",
    html: templateHtmlBody,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send({ success: false, message: error });
    } else {
      console.log("Email sent: " + info.response);

      // res.send({success:true,message:"mail sent successfully"})
    }
  });
};

exports.userMail = async (userData) => {
  let newUser = userData;
  console.log({newUser})

  let file = await fs.readFileSync(
    path.join(__dirname, "../template", "userTemplate.html"),
    "utf8"
  );

  let templateHtmlBody = file.replace("$$USERNAME$$", newUser.username);

  var transporter = await nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: config.fromMail,
      pass: config.mailPassword,
    },
  });

  var mailOptions = {
    from: config.fromMail,
    to: newUser.email,
    subject: "Sending Email using Node.js",
    html: templateHtmlBody,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send({ success: false, message: error });
    } else {
      console.log("Email sent: " + info.response);

      // res.send({success:true,message:"mail sent successfully"})
    }
  });
};

exports.userLoginPassword = async (userData, userPass) => {
  let newUser = userData;

  let file = await fs.readFileSync(
    path.join(__dirname, "../template", "createLogin.html"),
    "utf8"
  );

  let templateHtmlBody = file
    .replace("$$FULLNAME$$", newUser.fullName)
    .replace("$$USERNAME$$", newUser.username)
    .replace("$$PASSWORD$$", userPass);

  var transporter = await nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: config.fromMail,
      pass: config.mailPassword,
    },
  });

  var mailOptions = {
    from: config.fromMail,
    to: newUser.email,
    subject: "Sending Email using Node.js",
    html: templateHtmlBody,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send({ success: false, message: error });
    } else {
      console.log("Email sent: " + info.response);

      // res.send({success:true,message:"mail sent successfully"})
    }
  });
};
