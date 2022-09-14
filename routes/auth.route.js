const express = require('express')
const router = express.Router()
const passport = require('passport');
const UserController = require('../controllers/user.controller')
const {addUserValidation, createLoginValidation, userLoginValidation} = require('../middlewares/validation')

router.post('/register', addUserValidation, (req, res) => {
    UserController.createUser(req, result => {
        res.status(result.status).json(result)
    })
})
// router.post('/login', userLoginValidation, UserController.login)
router.post('/login', userLoginValidation, (req, res) => {
    UserController.login(req, result => {
        res.status(result.status).json(result)
    })
})

module.exports = router;
