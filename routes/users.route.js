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

router.get('/pendingUsers',UserController.pendingUsers)

router.get('/allUsers', function (req, res) {
    UserController.allUsers(req.params, function (result) {
        if(result.success) {
            res
                .status(200)
                .json(result);
            res.send(result);
        }  else {
            res
                .status(500)
                .json(result);
            res.send(result);
        }
    });
});
router.get('/activeUsers',UserController.activeUsers)

router.get('/profile', auth, UserController.profile);

module.exports=router;


