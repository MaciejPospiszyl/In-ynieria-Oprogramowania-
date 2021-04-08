var models = require('./database.js')
const bcrypt = require('bcryptjs')
const saltRounds = 10;
var users = models.users
var credentials = models.credentials

<<<<<<< HEAD
function userR()
{
    alert("hello")
}

exports.register = (req, res) => {
=======
exports.register = async (req, res) => {
>>>>>>> c8a32eea96824315bf2f15b9b0f806ab27bf2fb0
    const { username, email, password } = req.body;
    console.log("BODY:", req.body);

    if (!username.length || !email.length || !password.length) {
        console.log("Niewypełnione pole/a")
        return res.status('401').render("register.ejs", {
            message: "Niewypełnione pole/a"
        })
    }
<<<<<<< HEAD
    users.findOne({ username: username })
        .then(results => {
            if (results) {
                console.log("Username jest zajęty")
                return res.status('401').render("register.ejs", {
                    message: "Username jest zajęty"
                })
            }
=======

    const user = await users.findOne({ username: username })
    if (user) {
        console.log(user)
        console.log("Username jest zajęty")
        return res.status('401').render("register.html", {
            message: "Username jest zajęty"
>>>>>>> c8a32eea96824315bf2f15b9b0f806ab27bf2fb0
        })
    }

<<<<<<< HEAD
    credentials.findOne({ email: email })
        .then(results => {
            if (results) {
                console.log("Email jest zajęty")
                return res.status('401').render('register.ejs', {
                    message: 'Email jest zajęty'
                })
            }
=======
    const credential = await credentials.findOne({ email: email })
    if (credential) {
        console.log(credential)
        console.log("Email jest zajęty")
        return res.status('401').render('register.html', {
            message: 'Email jest zajęty'
>>>>>>> c8a32eea96824315bf2f15b9b0f806ab27bf2fb0
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
<<<<<<< HEAD
                    console.log(result2)
                    return res.status('400').render('login.ejs', {
=======
                    console.log("newCredentialSave", result2)
                    return res.status('400').render('login.html', {
>>>>>>> c8a32eea96824315bf2f15b9b0f806ab27bf2fb0
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
                            
                            console.log(results2)
                            console.log("Zalogowano jako " + results2.username)
<<<<<<< HEAD
                            return res.status('400').render("indexLogged.ejs", {
                                message: "Pomyślne logowanie"
                                
                            } 
                            
                            )
=======
                            return res.status('200').render("index.html", {
                                message: "Pomyślne logowanie"
                            })
>>>>>>> c8a32eea96824315bf2f15b9b0f806ab27bf2fb0
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