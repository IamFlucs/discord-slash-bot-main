const { Schema, model } = require('mongoose');

const rankSchema = new Schema({
    rank_fk_leagueAccount: { 
        type: Schema.Types.ObjectId, 
        ref: 'LeagueAccount' 
    },
    // Solo/Duo
    rank_soloQTier: String,
    rank_soloQTier_buffer: String,
    rank_soloQTier_previous: String,

    rank_soloQRank: String,
    rank_soloQRank_buffer: String,
    rank_soloQRank_previous: String,

    rank_soloQLeaguePoints: String,
    rank_soloQLeaguePoints_buffer: String,
    rank_soloQLeaguePoints_previous: String,
    
    // Flex
    rank_flexTier: String,
    rank_flexTier_buffer: String,
    rank_flexTier_previous: String,

    rank_flexRank: String,
    rank_flexRank_buffer: String,
    rank_flexRank_previous: String,

    rank_flexLeaguePoints: String,
    rank_flexLeaguePoints_buffer: String,
    rank_flexLeaguePoints_previous: String,
});

module.exports = model('Rank', rankSchema);
