const express=require('express')
const router=express.Router()
const passport = require('passport');
const UserController=require('../controllers/user.controller')
const {addUserValidation}=require('../middleware/validation')

router.post('/register',addUserValidation,UserController.createUser)
router.post('/login',UserController.login)
router.post('/createLogin',UserController.createLogin)
router.get('/allUsers',UserController.allUsers)
router.get('/pendingUsers',UserController.pendingUsers)
router.get('/activeUsers',UserController.activeUsers)

router.get('/profile', passport.authenticate('jwt', {session:false}), UserController.profile);

module.exports=router;


