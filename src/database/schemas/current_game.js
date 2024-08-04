const mongoose = require('mongoose');

const current_gameSchema = new mongoose.Schema({
    currentGame_id: String,
    currentGame_currentGame: JSON,
    currentGame_server: String,
    currentGame_gameid: String,
});

module.exports = mongoose.model('CurrentGame', current_gameSchema);
