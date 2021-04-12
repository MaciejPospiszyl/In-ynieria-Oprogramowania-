var models = require('./database.js')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
const saltRounds = 10;
var users = models.users
var credentials = models.credentials

exports.register = (req, res) => {
    const { username, email, password } = req.body;
    console.log("BODY:", req.body);

    if (!username.length || !email.length || !password.length) {
        console.log("Niewypełnione pole/a")
        return res.status('401').render("register.ejs", {
            message: "Niewypełnione pole/a"
        })
    }
    users.findOne({ username: username })
        .then(results => {
            if (results) {
                console.log("Username jest zajęty")
                return res.status('401').render("register.ejs", {
                    message: "Username jest zajęty"
                })
            }
        })

    credentials.findOne({ email: email })
        .then(results => {
            if (results) {
                console.log("Email jest zajęty")
                return res.status('401').render('register.ejs', {
                    message: 'Email jest zajęty'
                })
            }
        })

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
                if (err2) { console.log(err2) }
                else {
                    console.log(result2)
                    return res.status('400').render('login.ejs', {
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
       return res.status('401').render('login.ejs', {
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
                            console.log(results2)
                            console.log("Zalogowano jako " + results2.username)
                            res.cookie('jwt', token, cookieOptions)
                            res.status('400').redirect("/plansza")
                        }
                    })
            }
            else {
                console.log("Złe dane")
                return res.status('401').render('login.ejs', {
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


