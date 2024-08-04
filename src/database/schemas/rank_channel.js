const { Schema, model } = require('mongoose');

const rank_channelSchema = new Schema({
    rankChannel_fk_guild: {
        type: String,
        ref: 'Guild'
    },
    rankChannel_channelId: String,
    rankChannel_messageId: String
    // No 'rankChannel_channelName' cause the name can be modified after creation
});

module.exports = model('InfoChannel', rank_channelSchema);
