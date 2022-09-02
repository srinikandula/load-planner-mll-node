const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const nodemailer = require('nodemailer');
const path = require('path')
const fs= require('fs');
const { request } = require("http");
const { response } = require("express");
const bcrypt=require('bcryptjs');


let userData;
let opsMail = async()=>{

  let newUser = userData;

  
  let file = await fs.readFileSync(path.join(__dirname,'../template','opsTemplate.html'), 'utf8');

    let templateHtmlBody = file
    .replace('$$USERNAME$$', newUser.username)
    .replace('$$COMPANY_NAME$$', newUser.companyName)
    .replace('$$CUSTOMERS$$', newUser.customers)


  var transporter =  await nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
      user: config.fromMail,
      pass: config.mailPassword
    }
  });
  
  var mailOptions = {
    from: config.fromMail,
    to: config.toMail,
    subject: 'Sending Email using Node.js',
    html: templateHtmlBody
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.send({success:false,message:error})
    } else {
      console.log('Email sent: ' + info.response);
      
      // res.send({success:true,message:"mail sent successfully"})
    }
  });

}

let userMail = async()=>{

  let newUser = userData;



  let file = await fs.readFileSync(path.join(__dirname,'../template','userTemplate.html'), 'utf8');

    let templateHtmlBody = file
    .replace('$$USERNAME$$', newUser.username)
    



  
  var transporter =  await nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
      user: config.fromMail,
      pass: config.mailPassword
    }
  });
  
  var mailOptions = {
    from: config.fromMail,
    to: 'nikhil41425@gmail.com',
    subject: 'Sending Email using Node.js',
    html: templateHtmlBody
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.send({success:false,message:error})
    } else {
      console.log('Email sent: ' + info.response);
      
      // res.send({success:true,message:"mail sent successfully"})
    }
  });

}

let userPass;

let userLoginPassword = async()=>{

  let newUser = userData;



  let file = await fs.readFileSync(path.join(__dirname,'../template','createLogin.html'), 'utf8');

    let templateHtmlBody = file
    .replace('$$FULLNAME$$', newUser.fullName)
    .replace('$$USERNAME$$', newUser.username)
    .replace('$$PASSWORD$$', userPass)
    



  
  var transporter =  await nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
      user: config.fromMail,
      pass: config.mailPassword
    }
  });
  
  var mailOptions = {
    from: config.fromMail,
    to: 'nikhil41425@gmail.com',
    subject: 'Sending Email using Node.js',
    html: templateHtmlBody
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.send({success:false,message:error})
    } else {
      console.log('Email sent: ' + info.response);
      
      // res.send({success:true,message:"mail sent successfully"})
    }
  });

}

exports.createUser = async (req, res, next) => {
  let newUser = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    username: req.body.username,
    companyName: req.body.companyName,
    customers: req.body.customers,
    active: false,
    // password:undefined
  });
  
    User.find({ username: req.body.username }).then((user) => {
      if (user.length > 0) {
        res.json({ success: false, message: "Username already exists" });
      } else {
        User.find({ email: req.body.email }).then((user) => {
          if (user.length > 0) {
            res.json({ success: false, message: "Email already exists" });
          } else {
            // delete newUser.cpassword;

            // newUser.save(user)


            User.addUser(newUser, async(err, user) => {
              userData = await newUser
             
              if (err) {
                res.json({
                  success: false,
                  message: "Registration Failed",
                  error: err,
                });
              } else {

                   
                   await opsMail();
                   await userMail();

                   res.json({
                    success: true,
                    message: "Registration Successfull",
                    mail:"mail sent successfully"
                  });
               
              }
            });
          }
        });
      }
    });
  }

 exports.createLogin = async(req, res) => {

  
  let query={username:req.body.username}

  let pass = Math.random().toString(36).slice(2, 8);

  userPass=pass

  // generate salt to hash password
  const salt = await bcrypt.genSalt(10);
  // now we set user password to hashed password
  pass = await bcrypt.hash(pass, salt);

   
  
  User.findOneAndUpdate(query,{$set:{password:pass,active:true}}, {new: true},async(err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }else{

      userData = user;

      await userLoginPassword();
        
      res.json({success: true, message:"username and password created"})
    }

      
  })

  
 } 

 exports.allUsers = async (req, res, next) => { 

  User.find({},(err, user)=>{
      if(err){
        return res.json({success: false, message: "error"})
      }else{
        return res.json({success:true,length:user.length,data:user})
      }
  })
 }
 exports.pendingUsers = async (req, res, next) => { 

  User.find({active:false},(err, user)=>{
      if(err){
        return res.json({success: false, message: "error"})
      }else{
        return res.json({success:true,length:user.length,data:user})
      }
  })
 }
 exports.activeUsers = async (req, res, next) => { 

  User.find({active:true},(err, user)=>{
      if(err){
        return res.json({success: false, message: "error"})
      }else{
        return res.json({success:true,length:user.length,data:user})
      }
  })
 }

exports.login = async(req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign({ data: user }, config.jwt.secret, {
          expiresIn: 604800, //1 week
        });
        res.json({
          success: true,
          token: token,
          user: {
            id: user._id,
            name: user.fullName,
            username: user.username,
            email: user.email,
          },
        });
      } else {
        return res.json({ success: false, message: "wrong password" });
      }
    });
  });
};

exports.profile = (req, res, next) => {
  res.json({ user: req.user });
};
