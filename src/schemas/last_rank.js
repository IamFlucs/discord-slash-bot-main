const { Schema, model } = require('mongoose');

const lastRankSchema = new Schema({
    lastRank_fk_leagueAccounts: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'LeagueAccount' 
    }],
    lastRank_soloq: { type: Schema.Types.Mixed },
    lastRank_flex: { type: Schema.Types.Mixed },

    lastRank_soloqSecond: { type: Schema.Types.Mixed },
    lastRank_soloqDaily: { type: Schema.Types.Mixed },
    lastRank_soloqWeekly: { type: Schema.Types.Mixed },
    lastRank_soloqMonthly: { type: Schema.Types.Mixed },

    lastRank_flexSecond: { type: Schema.Types.Mixed },
    lastRank_flexDaily: { type: Schema.Types.Mixed },
    lastRank_flexWeekly: { type: Schema.Types.Mixed },
    lastRank_flexMonthly: { type: Schema.Types.Mixed },
});

module.exports = model('lastRank', lastRankSchema);
