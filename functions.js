const jwt = require('jsonwebtoken');
let models = require('./database.js')
let users = models.users
let credentials = models.credentials
let leaderboard = models.leaderboard
let lobby = models.lobby

async function getPlayers(req) {
    let players = {}
    // let decoded = jwt.verify(req.cookies.jwt, 'secret'); //zalogowany uzytkownik

    try {
        const result = await lobby.findOne({ _id: req.params.room_id })
        // console.log('result', result)
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
            players.player_amount = result.player_amount
            players.leader = result.leader_id;
            players.room_name = result.room_name
          
        }
    } catch (error) { console.log(error) }
    // console.log('players',players)
    return players;
}

async function getRooms() {
    let rooms = {}

    try {
        const results = await lobby.find()
        if (results) {
            rooms = results;
        }
    }
    catch (error) {
        console.log('error przy pobieraniu pokoi');
    }
    // console.log('rooms', rooms)
    return rooms
}





module.exports = { getPlayers, getRooms }