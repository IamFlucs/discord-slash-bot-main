const { logger } = require('../../utils/tools/logger');
const guildSchema = require('../../schemas/guild');

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