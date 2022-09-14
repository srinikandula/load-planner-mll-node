const express = require('express')
const router = express.Router()
const passport = require('passport');
const UserController = require('../controllers/user.controller')
const {addUserValidation, createLoginValidation, userLoginValidation} = require('../middlewares/validation')


let auth = passport.authenticate('jwt', {session: false})

// router.post('/register', addUserValidation, UserController.createUser)
// router.post('/register', addUserValidation, (req, res) => {
//     UserController.createUser(req, result => {
//         if (result.success) {
//             res.status(200).json(result)
//         } else {
//             res.status(400).json(result)
//         }
//     })
// })
// // router.post('/login', userLoginValidation, UserController.login)
// router.post('/login', userLoginValidation, (req, res) => {
//     UserController.login(req, result => {
//         if (result.success) {
//             res.status(200).json(result);
//         } else {
//             return res.status(400).json(result);
//         }
//     })
// })

router.post('/createLogin', createLoginValidation, UserController.createLogin)
router.patch('/updatePassword', UserController.updatePassword)

// router.get('/pendingUsers', UserController.pendingUsers)
router.post('/pendingUsers', (req, res) => {
    UserController.pendingUsers(req, result => {
        res.status(result.status).json(result)
    })
})

router.post('/allUsers', (req, res) => {
     UserController.allUsers(req.params, result => {
        console.log(result);
        // res.send(result);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
            // res.send(result);
        }
    });
});
// router.get('/activeUsers', UserController.activeUsers)
router.get('/activeUsers', (req, res) => {
    UserController.activeUsers(req, result => {
        res.status(result.status).json(result)
    })
})

router.get('/profile', auth, UserController.profile);

router.post('/activateUser', (req, res) => {
    UserController.activateUser(req, result => {
        res.status(result.status).json(result)
    })
})

router.post('/addUser', (req, res) => {
    UserController.addUser(req, result => {
        res.status(result.status).json(result)
    })
})

module.exports = router;


