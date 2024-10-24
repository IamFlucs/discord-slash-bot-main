const { createLogger } = require('../../utils/logger/logger');
const guildSchema = require('../../database/schemas/guild');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * This event push a new entry when the bot join a new guild.
 */
module.exports = {
	name: 'guildCreate',

	async execute(guild) {
        logger.info(`Bot added the a new guild: ${guild.name} (ID: ${guild.id}).`);
        try {
            await guildSchema.create({
                guild_guildName: guild.name,
                guild_guildId: guild.id,
            });
            logger.ok(`New guild added: ${guild.name} (ID: ${guild.id}).`);
        } catch (error) {
            logger.error(`Failed to add new guild: ${error.message}`);
        }
    },
};