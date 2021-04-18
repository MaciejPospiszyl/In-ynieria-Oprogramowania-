const { ObjectID } = require('bson');
const mongoose = require('mongoose')

const dbUrl = "mongodb+srv://inzynieria123:haslo123@cluster0.v9mg8.mongodb.net/inzynieria?retryWrites=true&w=majority";

var db = module.exports = mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('db is running'))
    .catch((err) => console.log(err));

var usersSchema = mongoose.Schema({
    username: String
})

var users = mongoose.model('Users', usersSchema)

var credentialsSchema = mongoose.Schema({
    email: String,
    password: String,
    user_id: ObjectID
})

var credentials = mongoose.model('Credentials', credentialsSchema)


var lbSchema = mongoose.Schema({
    user_id: ObjectID,
    time: Number,
    moves: Number,
    difficulty: String
})

var leaderboard = mongoose.model('Leaderboard', lbSchema)

var models = {users, credentials, leaderboard}


module.exports = models