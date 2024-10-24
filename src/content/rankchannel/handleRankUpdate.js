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

        // Get the list of players who played during the period
        const rankList = await createRankEmbed(client, guildId, type, endTimestamp);

        const gainContent = [];
        const lossContent = [];

        // Start filing the lists with the result of 'createRankEmbed'
        rankList.forEach(entry => {
            if (entry.type === 'gain') {
                gainContent.push(entry.message);
            } else if (entry.type === 'loss') {
                lossContent.push(entry.message);
            }
        });

        // Generate the message
        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle(`${Type} Rank Update`)
            .setDescription(`Rank changes between <t:${searchedRankChannel[`rankChannel_update${Type}`]}:d> and <t:${endTimestamp}:d>`)

        if (gainContent.length === 0 && lossContent.length === 0) {
            embed.addFields({ name: 'No games played', value: 'Maybe another time!', inline: false });
        } else {
            if (gainContent.length > 0) {
                embed.addFields({ name: 'Most successful players', value: gainContent.join('\n'), inline: false });
            } else {
                embed.addFields({ name: 'Most successful players', value: 'Bad results for everyone. This is a sad day for the server.', inline: false });
            }
            
            if (lossContent.length > 0) {
                embed.addFields({ name: 'Least successful players', value: lossContent.join('\n'), inline: false });
            } else {
                embed.addFields({ name: 'Least successful players', value: 'All victorious: No rank drops in sight! Good job!', inline: false });
            }
        }
        
        // Send the message
        const channel = await client.channels.fetch(searchedRankChannel.rankChannel_channelId)
        if (channel) {
            await channel.send({ embeds: [embed] });
        } else {
            throw new Error(`Channel ${searchedRankChannel.rankChannel_channelId} not found`);
        }

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
            return 0x00FFFF; // Cyan
        case 'monthly':
            return 0xF2F3F5; // White
        default:
            return 0x000000; // Default to black if type is unknown
    }
}

module.exports = { handleRankUpdate };