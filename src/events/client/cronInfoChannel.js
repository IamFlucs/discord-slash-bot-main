const { createLogger } = require('../../utils/logger/logger');
const { updateInfoPanel } = require('../../content/infochannel/updateInfoPanel');
const { updateGameCards } = require('../../content/gamecard/updateGameCards');
const { updateRanks } = require('../../database/updateRanks');
const cron = require('node-cron');
const InfoChannel = require('../../database/schemas/info_channel');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * This event triggers once when the bot starts and sets up a recurring task 
 * that activates at a specified interval (e.g., every X minutes). 
 * The scheduling is defined using the 'node-cron' package.
 */
module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {

        // Schedule the task to run at a regular interval (e.g., every 20 minutes)
        cron.schedule(`*/20 * * * *`, async () => {
            try {
                logger.info('');
                logger.info('********************************************************************');
                logger.info(`[cronInfoChannel] Starting League of Legends ranking for InfoChannel`);
                logger.info('********************************************************************');
                // Fetch all infochannel IDs from the database
                const guilds = await InfoChannel.find({});
                for (const guild of guilds) {

                    const guildId = guild.infoChannel_fk_guild;

                    // Update ranks and information panels for each guild
                    await updateRanks(client, guildId);
                    await updateInfoPanel(client, guildId);

                    // Update game cards if enabled
                    const option = await InfoChannel.findOne({ infoChannel_fk_guild: guildId });
                                        
                    if (option && option.infoChannel_gameCardOption) {
                        // logger.ok('gameCardOption enable')
                        
                        await updateGameCards(client, guildId);
                    } else { 
                        if (!option) {
                            logger.ko(`No entry found in InfoChannel for guild ID: ${guildId}, exiting the cron job.`);
                        } else {
                            logger.ko(`No game card option found for guild ID: ${guildId}, exiting the cron job.`);
                        }
                        continue;
                    };
                }
            } catch (error) {
                logger.error('[cronInfoChannel] Error fetching guilds or updating info panels in the cron job.');
                logger.error(error);
            }
        });

        logger.ok('>> Crontab for infochannel has been set up.');
	}
};