const express = require('express');

const router = express.Router();

const requireAuth = require('../middleware/requireAuth')

const { login, signUp, deleteAccount } = require('../Controller/docsController.js')
//? login
router.post('/login', login)
//? sign up
router.post('/signup', signUp)

//? Deleting Requires Authorization
router.use(requireAuth)
//! Delete
router.delete('/delete', deleteAccount)

module.exports = router