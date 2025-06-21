const { EmbedBuilder } = require('discord.js');
const { createRankEmbed } = require('./createRankEmbed');
const { updateRanks } = require('../../database/updateRanks');
const { createLogger } = require('../../utils/logger/logger');
const capitalize = require('../../utils/string/capitalize');
const LastRank = require('../../database/schemas/last_rank');
const RankChannel = require('../../database/schemas/rank_channel');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * Handle rank update and send the periodic rank updates messages
 * @param {Client} client - The Discord client.
 * @param {string} guildId - The ID of the guild.
 * @param {string} type - The periodicity (daily, weekly or monthly)
 * @returns 
 */
async function handleRankUpdate(client, guildId, type) {
    try {
        // Check if the bot is still in the guild
        const guild = client.guilds.fetch(guildId);
        if (!guild) {
            logger.error(`The bot is no longer a member of the guild with ID: ${guildId}`);
            return;
        }

        // Check rankChannel existence
        const searchedRankChannel = await RankChannel.findOne({ rankChannel_fk_guild: guildId });
        if (!searchedRankChannel) {
            logger.error('Failed to find the info channel entry.');
            return;
        }

        // Update current ranks to get the most recent values
        await updateRanks(client, guildId);
        logger.info(`updateRanks successfully executed.`);

        // Prepare embed generation
        const embedColor = getEmbedColor(type);
        const Type = capitalize(type);
        const endTimestamp = Math.floor(Date.now() / 1000); // Current date
        let startTimestamp; // Start of the period

        // Get the last timestamp used from latest update
        switch (type) {
            case 'daily':
                startTimestamp = searchedRankChannel.rankChannel_updateDaily;
                break;
            case 'weekly':
                startTimestamp = searchedRankChannel.rankChannel_updateWeekly;
                break;
            case 'monthly':
                startTimestamp = searchedRankChannel.rankChannel_updateMonthly;
                break;
            default:
                logger.warning('Invalid periodicity type.')
                return;
        }

        logger.info(`Preparing to start the rankList.`);

        // Get the list of players who played during the period
        const rankList = await createRankEmbed(client, guildId, type, endTimestamp);
        if (rankList.length === 0) {
            logger.info(`No rank updates for guild ${guildId}.`);
            return;
        } else if (!rankList){
            logger.info(`La rankList n’existe pas.`)
        } else {
            logger.ok(`Ranklist successfully executed. Type : ${typeof rankList}.`);
        }

        const gainContent = [];
        const lossContent = [];

        // Start filing the lists with the result of 'createRankEmbed'
        logger.info('Start filing the lists');
        rankList.forEach(entry => {
            if (entry.type === 'gain') {
                gainContent.push(entry.message);
            } else if (entry.type === 'loss') {
                lossContent.push(entry.message);
            }
        });


        try {
            const embed = await generateEmbed({
                Type: type,
                searchedRankChannel: searchedRankChannel, // Remplacez par vos données
                startTimestamp: startTimestamp,
                endTimestamp: endTimestamp, // Exemple de timestamp
                gainContent: gainContent, // Exemple de données
                lossContent: lossContent, // Exemple de données
                embedColor: embedColor // Couleur exemple
            });

            logger.info(`Going to send the embed for ${type} rank update.`);

            // Send the message
            const channel = await client.channels.fetch(searchedRankChannel.rankChannel_channelId)
            if (channel) {
                await channel.send({ embeds: [embed] });
                logger.ok(`${Type} rank update sended.`)
            } else {
                logger.warning(`Cannot send the ${Type} rank update.`)
                throw new Error(`Channel ${searchedRankChannel.rankChannel_channelId} not found`);
            }
    
        } catch (error) {
            logger.error(`Error in handleRankUpdate: ${error.message}`);
        }

        // try {
        //     logger.info('Start generating the embed message.');

        //     // Generate the message
        //     const embed = new EmbedBuilder()
        //         .setColor(embedColor)
        //         .setTitle(`${Type} Rank Update`)
        //         .setDescription(`Rank changes between <t:${searchedRankChannel[`rankChannel_update${Type}`]}:d> and <t:${endTimestamp}:d>`
        //         );

        //     // Check if gainContent and lossContent are populated
        //     logger.debug(`gainContent: ${JSON.stringify(gainContent)}, length: ${gainContent.length}`);
        //     logger.debug(`lossContent: ${JSON.stringify(lossContent)}, length: ${lossContent.length}`);

        //     // Verify searchedRankChannel and endTimestamp
        //     logger.debug(`searchedRankChannel: ${JSON.stringify(searchedRankChannel)}`);
        //     logger.debug(`endTimestamp: ${endTimestamp}`);

        //     // Check if there are no games played
        //     if (gainContent.length === 0 && lossContent.length === 0) {
        //         logger.info('No games played. Adding fallback message.');
        //         embed.addFields({ name: 'No games played', value: 'Maybe another time!', inline: false });
        //     } else {
        //         if (gainContent.length > 0) {
        //             logger.info('Adding successful players to the embed.');
        //             embed.addFields({ name: 'Most successful players', value: gainContent.join('\n'), inline: false });
        //         } else {
        //             logger.info('No successful players to show.');
        //             embed.addFields({ name: 'Most successful players', value: 'Bad results for everyone. This is a sad day for the server.', inline: false });
        //         }

        //         if (lossContent.length > 0) {
        //             logger.info('Adding least successful players to the embed.');
        //             embed.addFields({ name: 'Least successful players', value: lossContent.join('\n'), inline: false });
        //         } else {
        //             logger.info('No rank drops to report.');
        //             embed.addFields({ name: 'Least successful players', value: 'All victorious: No rank drops in sight! Good job!', inline: false });
        //         }
        //     }
        // } catch (error) {
        //     logger.error(`Error generating embed message: ${error.message}`);
        //     logger.debug(error.stack);
        // }
        
        // logger.info(`Going to send the embed for ${type} rank update.`);

        // // Send the message
        // const channel = await client.channels.fetch(searchedRankChannel.rankChannel_channelId)
        // if (channel) {
        //     await channel.send({ embeds: [embed] });
        //     logger.ok(`${Type} rank update sended.`)
        // } else {
        //     logger.warning(`Cannot send the ${Type} rank update.`)
        //     throw new Error(`Channel ${searchedRankChannel.rankChannel_channelId} not found`);
        // }

        // Update rankChannel database
        searchedRankChannel[`rankChannel_update${Type}`] = endTimestamp;
        await searchedRankChannel.save();

    } catch (error) {
        logger.warning(`/!\\ Error in handleRankUpdate for ${type}`);
        logger.error(error);
    }
}

/**
 * Get the color of the embed based on the type of update
 * @param {string} type - The type of update (daily, weekly, monthly)
 * @returns {number} - The color code
 */
function getEmbedColor(type) {
    switch (type) {
        case 'daily':
            return 0x2B2D31; // Gray
        case 'weekly':
            return 0xF2F3F5; // White
        case 'monthly':
            return 0x00FFFF; // Cyan
        default:
            return 0x000000; // Default to black if type is unknown
    }
}

/**
 * Generate an embed message summarizing rank changes.
 * Handles success and failure messages based on the provided rank data.
 * This function retries the generation in case of temporary errors.
 * @param {Object[]} gainContent - The list of players with LP gains.
 * @param {Object[]} lossContent - The list of players with LP losses.
 * @param {Object} searchedRankChannel - The rank channel configuration.
 * @param {Object} startTimestamp - The timestamp from the database of the update period. 
 * @param {number} endTimestamp - The timestamp marking the end of the update period.
 * @returns {EmbedBuilder} - The generated embed message.
 */
async function generateEmbed({ Type, searchedRankChannel, startTimestamp, endTimestamp, gainContent, lossContent, embedColor }) {
    try {
        logger.info('Start generating the embed message.');

        // Create the embed
        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle(`${Type} Rank Update`)
            .setDescription(`Rank changes between <t:${startTimestamp}:d> and <t:${endTimestamp}:d>`);

        // Log debug info
        logger.debug(`gainContent: ${JSON.stringify(gainContent)}, length: ${gainContent.length}`);
        logger.debug(`lossContent: ${JSON.stringify(lossContent)}, length: ${lossContent.length}`);
        logger.debug(`searchedRankChannel: ${JSON.stringify(searchedRankChannel)}`);
        logger.debug(`endTimestamp: ${endTimestamp}`);

        // Populate the embed
        if (gainContent.length === 0 && lossContent.length === 0) {
            logger.info('No games played. Adding fallback message.');
            embed.addFields({ name: 'No games played', value: 'Maybe another time!', inline: false });
        } else {
            if (gainContent.length > 0) {
                logger.info('Adding successful players to the embed.');
                embed.addFields({ name: 'Most successful players', value: gainContent.join('\n'), inline: false });
            } else {
                logger.info('No successful players to show.');
                embed.addFields({ name: 'Most successful players', value: 'Bad results for everyone. This is a sad day for the server.', inline: false });
            }

            if (lossContent.length > 0) {
                logger.info('Adding least successful players to the embed.');
                embed.addFields({ name: 'Least successful players', value: lossContent.join('\n'), inline: false });
            } else {
                logger.info('No rank drops to report.');
                embed.addFields({ name: 'Least successful players', value: 'All victorious: No rank drops in sight! Good job!', inline: false });
            }
        }

        return embed;
    } catch (error) {
        logger.error(`Error generating embed message: ${error.message}`);
        logger.debug(error.stack);
        throw error; // Re-throw the error for higher-level handling
    }
}

module.exports = { handleRankUpdate };