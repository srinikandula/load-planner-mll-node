const express=require('express')
const router=express.Router()
const passport = require('passport');
const UserController=require('../controllers/user.controller')


router.post('/register',UserController.createUser)

router.post('/login',UserController.login)

router.get('/profile', passport.authenticate('jwt', {session:false}), UserController.profile);

module.exports=router


