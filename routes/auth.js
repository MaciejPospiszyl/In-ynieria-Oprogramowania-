const express = require('express')
const router = express.Router()
const authController = require('../controllers.js')

router.post('/rejestracja', authController.register)

router.post('/logowanie', authController.login)


module.exports = router;