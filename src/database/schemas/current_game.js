const { Schema, model } = require('mongoose');

const current_gameSchema = new Schema({
    currentGame_fk_leagueAccount: { 
        type: Schema.Types.ObjectId, 
        ref: 'LeagueAccount' 
    },
    currentGame_id: String, // GameId
    currentGame_data: { type: Schema.Types.Mixed }, // Raw data
    currentGame_server: String, // Server Id: euw1
});

module.exports = model('CurrentGame', current_gameSchema);
