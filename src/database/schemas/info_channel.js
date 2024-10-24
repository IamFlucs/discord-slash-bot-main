const { Schema, model } = require('mongoose');

const info_channelSchema = new Schema({
    infoChannel_fk_guild: {
        type: String,
        ref: 'Guild'
    },
    infoChannel_channelId: String,
    infoChannel_gameCardOption: {
        type: Boolean,
        default: false
    },
    infoChannel_activeGames: [{
        type: String,
        default: []
    }],
});

module.exports = model('InfoChannel', info_channelSchema);
