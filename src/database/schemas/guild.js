const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
    guild_guildName: String,
    guild_guildId: String,
});

module.exports = model('Guild', guildSchema, 'guilds');