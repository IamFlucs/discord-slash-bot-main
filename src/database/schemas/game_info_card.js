const mongoose = require('mongoose');

const game_info_cardSchema = new mongoose.Schema({
    gameCard_id: String,
    gameCard_fk_infoChannel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'InfoChannel' 
    },
    gameCard_fk_currentGame: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'CurrentGame' 
    },
    gameCard_titleMessageId: String,
    gameCard_infoCardMessageId: String,
    gameCard_status: String,
    gameCard_creationTime: String,
});

module.exports = mongoose.model('GameCard', game_info_cardSchema);
