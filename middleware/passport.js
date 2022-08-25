const JwtStratgy=require('passport-jwt').Strategy
const ExtractJwt=require('passport-jwt').ExtractJwt
const {getUserById}=require('../models/user')


// authentication

module.exports = function(passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.secret;
    passport.use(new JwtStratgy(opts, (jwt_payload, done) => {
      getUserById(jwt_payload.data._id, (err, user) => {
        if(err) {
          return done(err, false);
        }
        if(user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
        
      });
    }));

      passport.serializeUser(function(user, done) {
        done(null, user);
      });

      passport.deserializeUser(function(user, done) {
        done(null, user);
      });
  }