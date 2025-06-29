const { handleRankUpdate } = require('../../content/rankchannel/handleRankUpdate');
const { createLogger } = require('../../utils/logger/logger');
const cron = require('node-cron');
const RankChannel = require('../../database/schemas/rank_channel');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * This event is triggered when the bot starts and sets up scheduled tasks that 
 * activate at specific times depending on the type (daily, weekly, monthly).
 * The scheduling is defined using the 'node-cron' package.
 * @param {Client} client - The Discord client instance.
 */
module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {

        // Schedule a daily message at 7:35 AM ('35 7 * * *'). 
        // For development, you might use every 30 minutes ('*/30 * * * *').
        cron.schedule('35 7 * * *', async () => {
            try {
                logger.info('');
                logger.info('***************************************************************');
                logger.info(`[cronDailyUpdate] Starting League of Legends Daily Update of LP`);
                logger.info('***************************************************************');
                const guilds = await RankChannel.find({});

                for (const guild of guilds) {
                    await handleRankUpdate(client, guild.rankChannel_fk_guild, 'daily');
                }
            } catch (error) {
                logger.error('[cronDailyUpdate][Daily] rankUpdateScheduler.js');
                logger.error(error);
            }            
        });

        // Schedule a weekly message every Monday at 6:35 AM ('35 6 * * 1').
        // For development, you might use every 2 hours ('0 */2 * * *').
        cron.schedule('35 6 * * 1', async () => {
            try {
                logger.info('');
                logger.info('****************************************************************');
                logger.info(`[cronDailyUpdate] Starting League of Legends Weekly Update of LP`);
                logger.info('****************************************************************');
                const guilds = await RankChannel.find({});

                for (const guild of guilds) {
                    await handleRankUpdate(client, guild.rankChannel_fk_guild, 'weekly');
                }
            } catch (error) {
                logger.error('[cronDailyUpdate][Weekly] rankUpdateScheduler.js');
                logger.error(error);
            }  
        });

        // Schedule a monthly message on the 1st of every month at 00:35 AM ('35 0 1 * *').
        // For development, you might use daily at 00:30 AM ('30 0 * * *').
        cron.schedule('35 0 1 * *', async () => {
            try {
                logger.info('');
                logger.info('*****************************************************************');
                logger.info(`[cronDailyUpdate] Starting League of Legends Monthly Update of LP`);
                logger.info('*****************************************************************');
                const guilds = await RankChannel.find({});

                for (const guild of guilds) {
                    await handleRankUpdate(client, guild.rankChannel_fk_guild, 'monthly');
                }
            } catch (error) {
                logger.error('[cronDailyUpdate][Monthly] rankUpdateScheduler.js');
                logger.error(error);
            }  
        });
        logger.ok('>> Crontab for rankchannel has been set up.');
	}
};