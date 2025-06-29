const { EmbedBuilder } = require('discord.js');
const { createRankEmbed } = require('./createRankEmbed');
const { updateRanks } = require('../../database/updateRanks');
const { createLogger } = require('../../utils/logger/logger');
const capitalize = require('../../utils/string/capitalize');
// const LastRank = require('../../database/schemas/last_rank');
const RankChannel = require('../../database/schemas/rank_channel');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * Handles rank updates and sends periodic update messages to the configured rank channel.
 * @param {Client} client - The Discord client.
 * @param {string} guildId - The guild ID.
 * @param {string} type - The update frequency (daily, weekly, or monthly).
 * @returns 
 */
async function handleRankUpdate(client, guildId, type) {
    try {
        logger.info('');
        logger.info(`[handleRankUpdate] Called with guildId=${guildId}, type=${type}`);
        
        // Ensure the bot is still in the specified guild
        const guild = client.guilds.fetch(guildId);
        if (!guild) {
            logger.warning(`[handleRankUpdate] The bot is no longer a member of the Discord server (ID=${guildId})`);
            logger.warning('[handleRankUpdate] Aborting function');
            return;
        }

        // Retrieve rank channel configuration
        const searchedRankChannel = await RankChannel.findOne({ rankChannel_fk_guild: guildId });
        if (!searchedRankChannel) {
            logger.warning('[handleRankUpdate] Failed to find the info channel entry');
            logger.warning('[handleRankUpdate] Aborting function');
            return;
        }

        // Update current rank data
        await updateRanks(client, guildId);
        logger.info(`[handleRankUpdate] Rank data successfully updated.`);

        // Prepare timestamps and embed metadata
        const embedColor = getEmbedColor(type);
        const Type = capitalize(type);
        const endTimestamp = Math.floor(Date.now() / 1000); // Current date
        let startTimestamp; // Start of the period

        // Determine the starting timestamp based on type
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
                logger.warning('[handleRankUpdate] Invalid update frequency type provided.');
                return;
        }

        logger.info(`[handleRankUpdate] Preparing to generate the rank list...`);

        // Generate rank list
        const rankList = await createRankEmbed(client, guildId, type, endTimestamp);

        if (!rankList) {
            logger.warning('[handleRankUpdate] Rank list could not be generated.');
            logger.warning('[handleRankUpdate] Aborting function');
            return;
        } else if (rankList.length === 0) {
            logger.warning(`[handleRankUpdate] No player activity to report for guild ${guildId}.`);
            logger.warning('[handleRankUpdate] Aborting function');
            return;
        } else {
            logger.info(`[handleRankUpdate] Rank list generated successfully. Type: ${typeof rankList}`);
        }

        // Separate players by gain or loss
        const gainContent = [];
        const lossContent = [];

        logger.info('[handleRankUpdate] Categorizing player rank changes...');
        rankList.forEach(entry => {
            if (entry.type === 'gain') {
                gainContent.push(entry.message);
            } else if (entry.type === 'loss') {
                lossContent.push(entry.message);
            }
        });

        try {
            // Build the embed
            const embed = await generateEmbed({
                Type: type,
                searchedRankChannel: searchedRankChannel,
                startTimestamp: startTimestamp,
                endTimestamp: endTimestamp,
                gainContent: gainContent,
                lossContent: lossContent,
                embedColor: embedColor
            });

            logger.info(`[handleRankUpdate] Sending ${type} rank update embed...`);

            // Send the embed to the channel
            const channel = await client.channels.fetch(searchedRankChannel.rankChannel_channelId)
            if (channel) {
                await channel.send({ embeds: [embed] });
                logger.ok(`[handleRankUpdate] ${Type} rank update successfully sent.`)
            } else {
                logger.warning(`[handleRankUpdate] Unable to send ${Type} rank update - channel not found.`)
                throw new Error(`[handleRankUpdate] Channel ${searchedRankChannel.rankChannel_channelId} not found`);
            }
    
        } catch (error) {
            logger.error(`[handleRankUpdate] Failed to generate or send embed.`);
            logger.error(`${error}`);
        }

        // Save the updated timestamp in the database
        searchedRankChannel[`rankChannel_update${Type}`] = endTimestamp;
        await searchedRankChannel.save();

    } catch (error) {
        logger.error(`[handleRankUpdate] Unexpected error during ${type} rank update process.`);
        logger.error(error);
    }
}

/**
 * Returns a color code for the embed based on the update type.
 * @param {string} type - The update frequency (daily, weekly, monthly).
 * @returns {number} - Discord embed color code.
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
 * Generates a Discord embed summarizing player rank gains and losses.
 * Handles success and failure messages based on the provided rank data.
 * @param {Object[]} gainContent - The list of players with LP gains.
 * @param {Object[]} lossContent - The list of players with LP losses.
 * @param {Object} searchedRankChannel - The rank channel configuration.
 * @param {Object} startTimestamp - The timestamp from the database of the update period. 
 * @param {number} endTimestamp - The timestamp marking the end of the update period.
 * @returns {EmbedBuilder} - The generated embed message.
 */
async function generateEmbed({ Type, searchedRankChannel, startTimestamp, endTimestamp, gainContent, lossContent, embedColor }) {
    try {
        logger.info('');
        logger.info(`[generateEmbed] Called with Type=${Type}, startTimestamp=${startTimestamp}, endTimestamp=${endTimestamp}, embedColor=${embedColor}`);

        // Create the embed
        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle(`${Type} Rank Update`)
            .setDescription(`Rank changes between <t:${startTimestamp}:d> and <t:${endTimestamp}:d>`);

        // Log debug info
        logger.debug(`[generateEmbed] gainContent: ${JSON.stringify(gainContent)}, length: ${gainContent.length}`);
        logger.debug(`[generateEmbed] lossContent: ${JSON.stringify(lossContent)}, length: ${lossContent.length}`);
        logger.debug(`[generateEmbed] searchedRankChannel: ${JSON.stringify(searchedRankChannel)}`);
        logger.debug(`[generateEmbed] endTimestamp: ${endTimestamp}`);

        // Populate the embed
        if (gainContent.length === 0 && lossContent.length === 0) {
            logger.info('[generateEmbed] No rank activity. Adding fallback message.');
            embed.addFields({ name: 'No games played', value: 'Maybe another time!', inline: false });
        } else {
            if (gainContent.length > 0) {
                logger.info('[generateEmbed] Adding players with rank gains.');
                embed.addFields({ name: 'Most successful players', value: gainContent.join('\n'), inline: false });
            } else {
                logger.info('[generateEmbed] rank gains to report.');
                embed.addFields({ name: 'Most successful players', value: 'Bad results for everyone. This is a sad day for the server.', inline: false });
            }

            if (lossContent.length > 0) {
                logger.info('[generateEmbed] Adding players with rank losses.');
                embed.addFields({ name: 'Least successful players', value: lossContent.join('\n'), inline: false });
            } else {
                logger.info('[generateEmbed] No rank losses to report.');
                embed.addFields({ name: 'Least successful players', value: 'All victorious: No rank drops in sight! Good job!', inline: false });
            }
        }

        return embed;
    } catch (error) {
        logger.error(`[generateEmbed] Failed to generate embed: ${error.message}`);
        logger.error(error.stack);
        throw error; // Re-throw the error for higher-level handling
    }
}

module.exports = { handleRankUpdate };