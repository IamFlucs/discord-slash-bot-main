const { Schema, model } = require('mongoose');

const leagueAccountSchema = new Schema({
    leagueAccount_fk_player: { 
        type: Schema.Types.ObjectId, 
        ref: 'Player',
        required: true,
    },
    leagueAccount_name: String,
    leagueAccount_nameId: String,
    leagueAccount_summonerId: String,
    leagueAccount_accountId: String,
    leagueAccount_puuid: String,
    leagueAccount_server: String,
});

module.exports = model('LeagueAccount', leagueAccountSchema);
