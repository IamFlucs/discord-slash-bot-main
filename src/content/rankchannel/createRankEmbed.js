const { searchMatch } = require('../../api/riot/match-v5');
const { lpVariation } = require('../../utils/player/lpVariation');
const { createLogger } = require('../../utils/logger/logger');
const Player = require('../../database/schemas/player');
const LastRank = require('../../database/schemas/last_rank');
const RankChannel = require('../../database/schemas/rank_channel');
const LeagueAccount = require('../../database/schemas/league_account');
const capitalize = require('../../utils/string/capitalize');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * Create a rank embed message with LP variation for periodic updates.
 * @param {string} guildId - The ID of the guild.
 * @param {string} type - The periodicity (daily, weekly, or monthly).
 * @returns {Object} - An object containing gainList and lossList.
 */
async function createRankEmbed(client, guildId, type, endTime) {    
    try {
        const rankList = [];

        // Get guild information
        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            logger.warning(`Guild with ID ${guildId} not found in cache. Skipping.`);
            return rankList; // Return an empty list or ignore this guild
        }

        // Fetch startTime from RankChannel database
        const rankChannel = await RankChannel.findOne({ rankChannel_fk_guild: guildId });
        if (!rankChannel) {
            logger.warning(`RankChannel not found for guild ID: ${guildId}. Skipping.`);
            return rankList; // Ignore guild if no configuration found
        }

        const startTime = rankChannel[`rankChannel_update${capitalize(type)}`];

        // Fetch players from the database
        const registeredPlayers = await Player.find({ player_fk_guildId: guildId });

        // Process all players of the server
        for (const player of registeredPlayers) {
            try {
                // Fetch the accounts linked to the player
                const playerAccounts = await LeagueAccount.find({ _id: { $in: player.player_fk_leagueAccounts } });

                // const guild = client.guilds.cache.get(guildId);
                const member = await guild.members.fetch(player.player_discordId);
                const nickname = member.nickname || member.displayName;

                // Process account(s) of the player
                for (const account of playerAccounts) {

                    const Type = capitalize(type);
                    const lastRankData = await LastRank.findOne({ lastRank_fk_leagueAccounts: account._id });

                    // Skip if Unranked in soloq & flex or no data
                    if (!lastRankData.lastRank_soloqCurrent && !lastRankData.lastRank_flexCurrent) continue;
                    if (!lastRankData) {
                        logger.info(`lastRankData not found in Mongo for account: ${lastRankData._id}`);
                        continue;
                    }

                    const { leagueAccount_puuid: puuid, leagueAccount_server: server, leagueAccount_nameId: summonerName } = account;
                    
                    // Process SoloQ
                    if (lastRankData.lastRank_soloqCurrent) {
                        const soloQVariation = lpVariation(lastRankData[`lastRank_soloq${capitalize(type)}`], lastRankData.lastRank_soloqCurrent);
                        const soloQMatches = await searchMatch(puuid, server, startTime, endTime, 'soloq');
                        const soloQMatchCount = soloQMatches.length;

                        // Skip the SoloQ part if no matches are found
                        if (soloQMatchCount > 0) {
                            const soloQEmoji = soloQVariation === 0 && soloQMatchCount > 0 ? ':arrows_counterclockwise: ' : getEmoji(soloQVariation);

                            const soloQEntry = {
                                accountName: player.player_discordId,
                                message: `${soloQEmoji} **${soloQVariation >= 0 ? '+' : ''}${soloQVariation} LP: ${nickname}** (${summonerName}) | *${soloQMatchCount} games / Solo/Duo*`,
                                lpVariation: soloQVariation,
                                type: soloQVariation >= 0 ? 'gain' : 'loss'
                            };
                            rankList.push(soloQEntry);

                            // Update the rank
                            lastRankData[`lastRank_soloq${Type}`] = { ...lastRankData.lastRank_soloqCurrent };
                            await lastRankData.save();
                        }
                    }

                    // Process FlexQ
                    if (lastRankData.lastRank_flexCurrent) {
                        const flexQVariation = lpVariation(lastRankData[`lastRank_flex${capitalize(type)}`], lastRankData.lastRank_flexCurrent);
                        const flexQMatches = await searchMatch(puuid, server, startTime, endTime, 'flex');
                        const flexQMatchCount = flexQMatches.length;

                        // Skip the FlexQ part if no matches are found
                        if (flexQMatchCount  > 0) {
                            const flexQEmoji = flexQVariation === 0 && flexQMatchCount > 0 ? ':arrows_counterclockwise: ' : getEmoji(flexQVariation);

                            const flexQEntry = {
                                accountName: player.player_discordId,
                                message: `${flexQEmoji} **${flexQVariation >= 0 ? '+' : ''}${flexQVariation} LP: ${nickname}** (${summonerName}) | *${flexQMatchCount} games / Flex*`,
                                lpVariation: flexQVariation,
                                type: flexQVariation >= 0 ? 'gain' : 'loss'
                            };
                            rankList.push(flexQEntry);

                            // Update the rank
                            lastRankData[`lastRank_flex${Type}`] = { ...lastRankData.lastRank_flexCurrent };
                            await lastRankData.save();
                        }
                    }
                }
            } catch (playerError) {
                logger.warning(`Error processing player ${player.player_discordId}: ${playerError.message}`)
            }
        }
        
        // Sort the list by lpVariation in descending order for both
        rankList.sort((a, b) => {
            if (a.type === 'gain' && b.type === 'gain') return b.lpVariation - a.lpVariation;
            if (a.type === 'loss' && b.type === 'loss') return b.lpVariation - a.lpVariation;
            // Ensure gains are before losses in the list
            return a.type === 'gain' ? -1 : 1;
        });

        logger.ok(`RankList successfully sorted.`);

        return rankList;

    } catch (error) {
        logger.error(`Error in createRankEmbed: ${error.message}`);
        return [];
    }
}

/**
 * Returns an emoji corresponding to the LP variation.
 * @param {number} variation - The variation of the LPs, can be positive or negative.
 * @returns {string} - An emoji representing the variation.
 */
function getEmoji(variation) {
    if (variation >= 100) return ':rocket: '; // 🚀
    if (variation >= 50) return ':fire: '; // 🔥
    if (variation >= 0) return ':chart_with_upwards_trend: '; // 📈
    if (variation <= -100) return ':skull: '; // 💀
    if (variation <= -50) return ':thunder_cloud_rain: '; // ⛈️
    return ':chart_with_downwards_trend: '; // 📉
}

module.exports = { createRankEmbed };
