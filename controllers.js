var models = require('./database.js')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { response } = require('express');
const saltRounds = 10;
var users = models.users
var credentials = models.credentials
var leaderboard = models.leaderboard
var lobby = models.lobby

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username.length || !email.length || !password.length) {
        console.log("Niewypełnione pole/a")
        return res.status('401').render("register", {
            message: "Niewypełnione pole/a"
        })
    }

    const user = await users.findOne({ username: username })
    if (user) {
        console.log(user)
        console.log("Username jest zajęty")
        return res.status('401').render("register", {
            message: "Username jest zajęty"
        })
    }

    const credential = await credentials.findOne({ email: email })
    if (credential) {
        console.log(credential)
        console.log("Email jest zajęty")
        return res.status('401').render('register', {
            message: 'Email jest zajęty'
        })
    }

    var newUser = users({ username: username })
    newUser.save(function (err, result) {
        if (err) console.log(err)
        else {
            console.log("newUserSave", result)
            const hashedPassword = bcrypt.hashSync(password, saltRounds);
            var newCredential = credentials({
                email: email,
                password: hashedPassword,
                user_id: result._id
            })
            newCredential.save(function (err2, result2) {
                if (err2) console.log(err2)
                else {
                    console.log("newCredentialSave", result2)
                    return res.status('400').render('login', {
                        message: "Rejestracja zakończona"
                    })
                }
            })
        }
    })
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        console.log("Niewypełnione pole/a")
        return res.status('401').render('login', {
            message: "Niewypełnione pole/a"
        })
    }


    credentials.findOne({ email: email })
        .then(results => {
            if (results && bcrypt.compareSync(password, results.password)) {
                users.findOne({ _id: results.user_id })
                    .then(results2 => {
                        if (results2) {
                            const user = results.user_id
                            const token = jwt.sign({ user }, 'secret', { expiresIn: '24h' })
                            const cookieOptions = {
                                expires: new Date(
                                    Date.now() + 24 * 60 * 60 * 1000 //1day
                                ),
                                httpOnly: true
                            }
                            console.log("Zalogowano jako " + results2.username)
                            res.cookie('jwt', token, cookieOptions)
                            res.status('400').redirect("/levelChoice")
                        }
                    })
            }
            else {
                console.log("Złe dane")
                return res.status('401').render('login', {
                    message: "Złe dane"
                })
            }
        })
}

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            var decoded = jwt.verify(req.cookies.jwt, 'secret');
            users.findOne({ _id: decoded.user })
                .then(results => {
                    if (results) {
                        req.user = results;
                        next()
                    }
                    else {
                        next()
                    }
                })
        }
        catch {
            next()
        }
    }
    else {
        next()
    }
}


exports.logout = async (req, res) => {
    res.cookie('jwt', 'wyloguj', {
        expires: new Date(Date.now() + 2 * 1000), //2 seconds
        httpOnly: true
    })
    res.status(200).redirect('/logowanie')
}

exports.saveScore = async (req, res) => {
    console.log(req.body)
    var decoded = jwt.verify(req.cookies.jwt, 'secret');
    var newScore = leaderboard({ user_id: decoded.user, time: req.body.scTime, moves: req.body.moves, difficulty: req.body.difficulty })
    newScore.save(function (err, result) {
        if (err) console.log(err)
        else {
            console.log("newScoreSave", result)
            return res.status(200);
        }
    })
}

exports.getLeaderboard = (req, res, next) => {
    let difficulty = req.query.difficulty || 'easy'

    leaderboard.aggregate([
        {
            $match: {
                "difficulty": difficulty
            }
        },
        {
            $lookup: {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            $project: {
                "username": "$user.username",
                "time": "$time",
                "moves": "$moves"
            }
        },
        {
            $sort: {
                "moves": 1,
                "time": 1
            }
        }
    ]).then(results => {
        req.ranks = results
        next()
    }).catch(error => {
        console.log(error)
        next()
    })
}

exports.getRooms = async (req, res, next) => {
    //sprawdzam czy uzytkownik jest juz w pokoju jezeli tak to go do niego przekierowujemy 
    const decoded = jwt.verify(req.cookies.jwt, 'secret');
    try {
        const check = await lobby.findOne({
            $or:
                [{ player1_id: decoded.user },
                { player2_id: decoded.user },
                { player3_id: decoded.user },
                { player4_id: decoded.user }
                ]
        }).catch(error => {
            console.log(error)
        }).then(results => {
            if (results && results.length != 0) {
                return res.redirect('/multiplayer/' + results._id)
            }
            else {
                lobby.find()
                    .then(results => {
                        req.rooms = results;
                        next();
                    })
                    .catch(error => {
                        console.log(error);
                        next();
                    })
            }
        })
    } catch (error) { console.log(error) };



}

exports.createRoom = async (req, res, next) => {
    const roomName = req.body.roomName;
    const decoded = jwt.verify(req.cookies.jwt, 'secret');

    if (roomName) {
        //sprawdzamy czy uzytkownik jest juz w jakims pokoju
        try {
            const check = await lobby.find({
                $or:
                    [{ player1_id: decoded.user },
                    { player2_id: decoded.user },
                    { player3_id: decoded.user },
                    { player4_id: decoded.user }
                    ]
            }).catch(error => {
                console.log(error)
            }).then(results => {
                if (results.length != 0) {
                    console.log('jestes w innym lobby', results)
                    return res.status(300).redirect('/multiplayer')
                }
                else {
                    var newLobby = lobby({ room_name: roomName, player_amount: 1, player1_id: decoded.user });
                    newLobby.save(function (err, result) {
                        if (err) {
                            console.log(err);
                            return res.status(400).redirect('/multiplayer')
                        }
                        else {
                            console.log("newRoom", result)
                            return res.status(200).redirect('/multiplayer/' + result._id)
                        }
                    })
                }
            })
        } catch (error) { console.log(erorr) }
    }
    else {
        return res.status(300).redirect('/multiplayer')
    }
}

exports.joinRoom = async (req, res, next) => {
    let decoded = jwt.verify(req.cookies.jwt, 'secret'); //zalogowany uzytkownik
    let data = { room_id: req.body.roomId, player_amount: req.body.playerAmount }; //pokoj do ktorego dolacza uzytkownik

    //funkcja dodajaca gracza do pokoju
    async function addToCertainSpot(player_id) {
        try {
            await lobby.findOneAndUpdate({ _id: data.room_id }, { [player_id]: decoded.user, player_amount: +req.body.playerAmount + 1 })
        }
        catch (error) {
            throw error;
        }


    }

    //sprawdzamy czy gracz znajduje sie juz w jakimkolwiek pokoju
    try {
        const check = await lobby.find({
            $or:
                [{ player1_id: decoded.user },
                { player2_id: decoded.user },
                { player3_id: decoded.user },
                { player4_id: decoded.user }
                ]
        })
        if (check && check.length != 0) {
            console.log('jestes w innym lobby', check)
            res.json({
                status: 'failure'
            })
        }
    } catch (error) { console.log(error) };


    //szukamy wolnego miejsca w pokoju
    try {
        const findSpotForPlayer = await lobby.findOne({ _id: data.room_id })
        if (findSpotForPlayer && findSpotForPlayer.player_amount < 4) {
            if (!findSpotForPlayer.player1_id) {
                addToCertainSpot('player1_id')
            }
            else if (!findSpotForPlayer.player2_id) {
                addToCertainSpot('player2_id')
            }
            else if (!findSpotForPlayer.player3_id) {
                addToCertainSpot('player3_id')
            }
            else if (!findSpotForPlayer.player4_id) {
                addToCertainSpot('player4_id')
            }
            else {
                res.json({ status: 'failure' })
            }
        }
        else {
            res.json({ status: 'failure' })
            return
        }
    }
    catch (error) {
        res.json({
            status: 'failure'
        })
        return
    };


    res.json({
        status: 'success',
        room_id: data.room_id,
        player_amount: data.player_amount
    })
}



exports.getRoom = async (req, res, next) => {
    let players = {}
    let decoded = jwt.verify(req.cookies.jwt, 'secret'); //zalogowany uzytkownik

    try {
        const result = await lobby.findOne({
            $and:
                [{ _id: req.params.room_id },
                {
                    $or:
                        [{ player1_id: decoded.user },
                        { player2_id: decoded.user },
                        { player3_id: decoded.user },
                        { player4_id: decoded.user }
                        ]
                }
                ]
        })
        if (result && result.length != 0) {
            if (result.player1_id) {
                players.player1 = await users.findOne({ _id: result.player1_id })
            }
            if (result.player2_id) {
                players.player2 = await users.findOne({ _id: result.player2_id })
            }
            if (result.player3_id) {
                players.player3 = await users.findOne({ _id: result.player3_id })
            }
            if (result.player4_id) {

                players.player4 = await users.findOne({ _id: result.player4_id })
            }
            req.players = players;
            req.player_amount = result.player_amount;
            console.log('players', players)
        }
        else {
            res.status('400').redirect('/multiplayer')
        }
    }
    catch (error) { console.log(error) }
    next()
}

exports.leaveRoom = async (req, res, next) => {
    let decoded = jwt.verify(req.cookies.jwt, 'secret'); //zalogowany uzytkownik
    let data = { room_id: req.body.room, player_amount: req.body.player_amount }; //pokoj ktory opuszcza uzytkownik
    console.log(data);

    function removePlayer(player) {
        lobby.findOneAndUpdate({ _id: data.room_id }, { [player]: undefined, player_amount: +data.player_amount - 1 })
            .catch(error => { console.log(error) })
            .then(result => {
                console.log(result)
                next()
            })
    }

    lobby.findOne({ _id: data.room_id })
        .catch(error => { console.log(error) })
        .then(results => {
            console.log(results);
            if (results.player1_id && results.player1_id == decoded.user) {
                removePlayer('player1_id')
            }
            else if (results.player2_id && results.player2_id == decoded.user) {
                removePlayer('player2_id')
            }
            else if (results.player3_id && results.player3_id == decoded.user) {
                removePlayer('player3_id')
            }
            else if (results.player4_id && results.player4_id == decoded.user) {
                removePlayer('player4_id')
            }
            else {
                next()
            }
        })





}


