const { Schema, model } = require('mongoose');

const playerSchema = new Schema({
    player_fk_guildId: { 
        type: String, 
        ref: 'Guild' 
    },
    player_fk_leagueAccounts: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'LeagueAccount' 
    }],
    player_discordName: String,
    player_discordId: String,
    player_mentionnable: { type: Boolean, default: true },
});

module.exports = model('Player', playerSchema);
