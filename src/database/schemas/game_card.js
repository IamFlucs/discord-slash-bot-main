const { Schema, model } = require('mongoose');

const game_cardSchema = new Schema({
    gameCard_fk_currentGame: { 
        type: Schema.Types.ObjectId, 
        ref: 'CurrentGame' 
    },
    gameCard_id: String,
    gameCard_data: Schema.Types.Mixed,
    gameCard_creationTime: String,
});

module.exports = model('GameCard', game_cardSchema);
