const { Schema, model } = require('mongoose');

const info_channelSchema = new Schema({
    infoChannel_fk_guild: {
        type: String,
        ref: 'Guild'
    },
    infoChannel_channelId: String
    // No 'infoChannel_channelName' cause the name can be modified after creation
});

module.exports = model('InfoChannel', info_channelSchema);
