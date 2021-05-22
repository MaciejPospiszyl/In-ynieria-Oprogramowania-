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

router.get('/multiplayer/:room_id', authController.isLoggedIn, authController.getRoom, (req, res) => {
    //req.params.room_id
    if (req.user) {
        res.render('multiplayer', {
            user: req.user,
            room: req.params.room_id,
            players: req.players,
            player_amount: req.player_amount,
            rooms: null,
            message: null
        })
    }
    else {
        res.redirect('/logowanie')
    }

})

router.get('/multiplayer', authController.isLoggedIn, authController.getRooms, (req, res) => {
    if (req.user) {
        res.render('multiplayer', {
            user: req.user,
            players: null,
            room: null,
            player_amount: null,
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
    if (req.user) {
        res.render('medium', {
            user: req.user,
            message: null
        })
    }
    else {
        res.redirect('logowanie')
    }
})

router.get('/hard', authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render('hard', {
            user: req.user,
            message: null
        })
    }
    else {
        res.redirect('logowanie')
    }
})

router.get('/multiGameHard/:room_id', authController.isLoggedIn, authController.getRoom, (req, res) => {
    if (req.user) {
        res.render('multiGameHard', {
            user: req.user,
            message: null,
            players: req.players,
            room_id: req.params.room_id,
            difficulty: 'Hard'
        })
    }
    else {
        res.redirect('multiplayer')
    }
})


router.get('/multiGameMedium/:room_id', authController.isLoggedIn, authController.getRoom, (req, res) => {
    if (req.user) {
        res.render('multiGameMedium', {
            user: req.user,
            message: null,
            players: req.players,
            room_id: req.params.room_id,
            difficulty: 'Medium'
        })
    }
    else {
        res.redirect('multiplayer')
    }
})


router.get('/multiGameEasy/:room_id', authController.isLoggedIn, authController.getRoom, (req, res) => {
    if (req.user) {
        res.render('multiGameEasy', {
            user: req.user,
            message: null,
            players: req.players,
            room_id: req.params.room_id,
            difficulty: 'Easy'
        })
    }
    else {
        res.redirect('multiplayer')
    }
})


module.exports = router;