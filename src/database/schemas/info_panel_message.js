const { Schema, model } = require('mongoose');

const info_panel_messageSchema = new Schema({
    infoPanel_fk_infoChannel: {
        type: Schema.Types.ObjectId,
        ref: 'InfoChannel'
    },
    infoPanel_messageId: String
});

module.exports = model('InfoPanel', info_panel_messageSchema);
