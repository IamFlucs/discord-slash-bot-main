const { Schema, model } = require('mongoose');

const lastRankSchema = new Schema({
    lastRank_fk_leagueAccounts: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'LeagueAccount' 
    }],
    lastRank_account: String,
    lastRank_soloqPrevious: { type: Schema.Types.Mixed },
    lastRank_flexPrevious: { type: Schema.Types.Mixed },

    lastRank_soloqCurrent: { type: Schema.Types.Mixed },
    lastRank_soloqDaily: { type: Schema.Types.Mixed },
    lastRank_soloqWeekly: { type: Schema.Types.Mixed },
    lastRank_soloqMonthly: { type: Schema.Types.Mixed },

    lastRank_flexCurrent: { type: Schema.Types.Mixed },
    lastRank_flexDaily: { type: Schema.Types.Mixed },
    lastRank_flexWeekly: { type: Schema.Types.Mixed },
    lastRank_flexMonthly: { type: Schema.Types.Mixed },
});

module.exports = model('lastRank', lastRankSchema);
