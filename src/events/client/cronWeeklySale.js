const { createLogger } = require('../../utils/logger/logger');
const { createWeeklySaleEmbed } = require('../../content/weeklysale/createWeeklySale');
const cron = require('node-cron');
const wsSchema = require('../../database/schemas/weekly_sale');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * This event triggers once when the bot starts and sets up a recurring task 
 * that activates at a specified interval (e.g., every X days). 
 * The scheduling is defined using the 'node-cron' package.
 */
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {

        // Schedule the task to run at a regular interval (e.g., every monday at 7 PM '0 19 * * 1')
        cron.schedule(`15 19 * * 1`, async () => {
            try {
                // Fetch all weekly-sale_channel_IDs from the database
                const guilds = await wsSchema.find({});
                for (const guild of guilds) {

                    const guildId = guild.ws_fk_guildId;
                    const channelId = guild.ws_channelId;

                    // Post weekly sale for every channel found
                    logger.info('🔄 Running Weekly Sale cron job...');
                    await createWeeklySaleEmbed(client, guildId, channelId);
                    
                }
            } catch (error) {
                logger.warning('Error fetching guilds or updating in the cron job.');
                logger.error(error);
            }
        });

        logger.ok('>> Crontab for Weekly sale has been set up.');
    }
};