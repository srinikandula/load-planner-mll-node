const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const nodemailer = require('nodemailer');

let userData;
let opsMail = async()=>{


  let newUser = userData;
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
    html: `<h3>Dear Team, <br>

            Request you to add the new user to logiOpt application using below information – 
           </h3>
          <p><b>Username - </b>  ${newUser.username}</p>
          <p><b>company Name - </b> ${newUser.companyName}</p>
          <p><b>Customers - </b>  ${newUser.customers}</p><br><br>
          <p>Please use the link to give access - <a href="https://mahindralogistics.com/" target="_blank">Click here</a></p>
          `
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
    html: `<h1>Welcome ${newUser.fullName}</h1>
    <h3>Thanks for signing up, your request is under consideration. 
    Once your ID is activated we will inform you via email.

    LogiOpt Support
    </h3>`
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
    password: req.body.password,
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
            User.addUser(newUser, (err, user) => {
              userData = newUser
              if (err) {
                res.json({
                  success: false,
                  message: "Registration Failed",
                  error: err,
                });
              } else {

                   
                   opsMail();
                   userMail();

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

exports.login = (req, res, next) => {
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
            name: user.name,
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
