const { Schema, model } = require('mongoose');

const weeklysaleSchema = new Schema({
    ws_fk_guildId: {
        type: String, 
        ref: 'Guild',
        required: true,
    },
    ws_channelName: String,
    ws_channelId: String,
});

module.exports = model('weeklysale', weeklysaleSchema);