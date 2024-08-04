const { Schema, model } = require('mongoose');

const newNameSchema = new Schema({
    name_nameId: { type: String },
    name_roles: { type: Array, default: null },
    name_Boolean: { type: Boolean, default: false },
    name_time: { type: Number, default: 0 },
});

module.exports = model('Name', newNameSchema);