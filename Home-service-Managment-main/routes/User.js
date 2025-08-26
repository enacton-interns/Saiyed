//All the user http requests will be handled here
const express = require('express');
const router = express.Router();
const User = require('../model/UserSchema');

//all the function name would be elobarated in controllers
const userController = require('../controllers/UserController');

router.route('/')
.get(userController.getAllUsers)
.post( userController.createUser);


router.route('/:id')
.get(userController.getUser)
.put(userController.updateUser)
.delete(userController.deleteUser);


module.exports = router;