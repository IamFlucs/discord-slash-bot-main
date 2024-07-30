const { logger } = require('../../utils/tools/logger');
const { updateInfoPanel } = require('../../utils/content/updateInfoPanel');
const cron = require('node-cron');
const Guild = require('../../schemas/guild');

/**
 * This events starts at boot and activate every {X} minutes. 
 * Defined in the cron, using npm install node-cron
 */
module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {

        // Schedule the task every X minutes (for example, every 30 minutes)
        cron.schedule(`*/20 * * * *`, async () => {
            try {
                // Fetch all guild IDs from the database
                const guilds = await Guild.find({});
                for (const guild of guilds) {
                    await updateInfoPanel(client, guild.guild_guildId);
                    await updateRanks(guild.guild_guildId);
                }
            } catch (error) {
                logger.error('Error fetching guilds or updating info panels:', error.message);
            }
        });

        logger.ok('>> Scheduled task to refresh info panels every 20 minutes.');
	}
};