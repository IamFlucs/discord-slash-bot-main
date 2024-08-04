const { logger } = require('../../utils/logger/logger');
const client = require('../../../index');
const guildSchema = require('../../database/schemas/guild');

module.exports = {
	name: 'guildDelete',
	async execute(guild) {
        logger.ok(`Bot has been excluded from guild: ${guild.name} (ID: ${guild.id}).`);
        try {
            await guildSchema.deleteOne({ guild_guildId: guild.id });
            logger.info(`Guild removed: ${guild.name} (ID: ${guild.id}).`);
        } catch (error) {
            logger.error(`Failed to remove guild: ${error.message}`);
        }
        //TODO: penser à supprimer les databases join to create
    },
};