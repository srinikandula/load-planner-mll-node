const express=require('express')
const router=express.Router()
const passport = require('passport');
const UserController=require('../controllers/user.controller')
const {addUserValidation,createLoginValidation,userLoginValidation}=require('../middlewares/validation')


let auth = passport.authenticate('jwt', {session:false})

router.post('/register',addUserValidation,UserController.createUser)
router.post('/login',userLoginValidation,UserController.login)
router.post('/createLogin',createLoginValidation,UserController.createLogin)
router.patch('/updatePassword',UserController.updatePassword)
router.get('/allUsers',UserController.allUsers)
router.get('/pendingUsers',UserController.pendingUsers)
router.get('/activeUsers',UserController.activeUsers)

router.get('/profile', auth, UserController.profile);

module.exports=router;


