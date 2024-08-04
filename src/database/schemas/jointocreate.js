const { Schema, model } = require('mongoose');

const jointocreateSchema = new Schema({
    jtc_fk_guildId: {
        type: String, 
        ref: 'Guild',
        required: true,
    },
    jtc_channelName: String,
    jtc_channelId: String,
    jtc_isPermanent: { type: Boolean, default: false },
});

module.exports = model('jointocreate', jointocreateSchema);