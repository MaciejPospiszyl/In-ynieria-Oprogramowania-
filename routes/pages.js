const express = require('express')
const authController = require('../controllers.js')
const router = express.Router()


router.get('/', authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render('index', {
            user: req.user,
            message: null
        })
    }
    else {
        res.render('login', {
            message: null,
            user: null
        })
    }
})

router.get('/rejestracja', (req, res) => {
    res.render('register', {
        message: null
    })
})

router.get('/logowanie', (req, res) => {
    res.render('login', {
        message: null
    })
})

router.get('/multiplayer', authController.isLoggedIn, authController.getRooms, (req, res) => {
    if (req.user) {
        res.render('multiplayer', {
            user: req.user,
            rooms: req.rooms || null,
            message: null
        })
    }
    else {
        res.redirect('logowanie')
    }
})

router.get('/easy', authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render('indexLogged', {
            user: req.user,
            message: null
        })
    }
    else {
        res.redirect('logowanie')
    }
})

router.get('/levelChoice', authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render('levelChoice', {
            user: req.user,
            message: null
        })
    }
    else {
        res.redirect('login')
    }
})

router.get('/ranking', authController.isLoggedIn, authController.getLeaderboard, (req, res) => {
    if (req.user) {
        res.render('ranking', {
            user: req.user,
            difficulty: req.query.difficulty || 'easy',
            ranks: req.ranks
        })
    }
    else {
        res.redirect('logowanie')
    }
})

router.get('/medium', authController.isLoggedIn, (req, res) => {
    if(req.user){
    res.render('medium',{
        user: req.user,
        message: null
    })
    }
    else{
        res.redirect('logowanie')
    }
})

router.get('/hard', authController.isLoggedIn, (req, res) => {
    if(req.user){
    res.render('hard',{
        user: req.user,
        message: null
    })
    }
    else{
        res.redirect('logowanie')
    }
})




module.exports = router;