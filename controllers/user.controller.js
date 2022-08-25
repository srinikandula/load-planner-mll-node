const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });
  console.log({ newUser });
  console.log(newUser.cpassword);

  if (!newUser.password || newUser.password.length < 3) {
    if (newUser.password.length < 3) {
      res.json({
        status: false,
        message: "password must be at least 4 characters",
      });
    } else {
      res.json({ status: false, message: "Fields should not be empty" });
    }
  } else {
    User.find({ username: req.body.username }).then((user) => {
      if (user.length > 0) {
        res.json({ success: false, message: "Username already exists" });
      } else {
        User.find({ email: req.body.email }).then((user) => {
          if (user.length > 0) {
            res.json({ success: false, message: "Email already exists" });
          } else {
            delete newUser.cpassword;
            User.addUser(newUser, (err, user) => {
              if (err) {
                res.json({
                  success: false,
                  message: "Registration Failed",
                  error: err,
                });
              } else {
                res.json({
                  success: true,
                  message: "Registration Successfull",
                });
              }
            });
          }
        });
      }
    });
  }
};

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
        const token = jwt.sign({ data: user }, process.env.secret, {
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
