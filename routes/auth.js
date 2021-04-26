const express = require('express')
const router = express.Router()
const authController = require('../controllers.js')

router.post('/rejestracja', authController.register)

router.post('/logowanie', authController.login)

router.get('/wyloguj', authController.logout)

router.post('/saveScore', authController.saveScore)

router.post('/createRoom', authController.createRoom)


module.exports = router;