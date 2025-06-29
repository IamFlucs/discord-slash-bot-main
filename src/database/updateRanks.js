const LeagueAccount = require('./schemas/league_account');
const LastRank = require('./schemas/last_rank');
const Player = require('./schemas/player');
const { tierOrder, rankOrder } = require('../utils/api/riotMessageUtil');
const { searchRank } = require('../api/riot/league-v4');
const { createLogger } = require('../utils/logger/logger');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * Get the current & previous rank updated for every registered players.
 * @param {*} client - The Discord client.
 * @param {*} guildId - The ID of the guild.
 * @returns 
 */
async function updateRanks(client, guildId) {
    logger.info('');
    logger.info(`[updateRanks] Called with guildId=${guildId}`);
    
    // Ensure the bot is still in the specified guild
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
        logger.warning(`[updateRanks] The bot is no longer a member of the Discord server (ID=${guildId})`);
        logger.warning('[updateRanks] Aborting function');
        return;
    }

    // Get all registered players of the guild in the database
    const registeredPlayers = await Player.find({ player_fk_guildId: guildId });
    for (const player of registeredPlayers) {
        
        // Get all riot accounts for each players in the database (could be one account or more)
        const leagueAccounts = await LeagueAccount.find({ _id: { $in: player.player_fk_leagueAccounts } });
        for (const account of leagueAccounts) {
            let rankData;
            try {
                rankData = await searchRank(account.leagueAccount_puuid, account.leagueAccount_server);
            } catch (error) {
                logger.error(`[updateRanks] Exception using league-v4 with summonerId=${account.leagueAccount_nameId}`);
                logger.error(`${error}`);
                continue;
            }
            if (!rankData) { 
                logger.warning(`[updateRanks] No data found with summonerId=${account.leagueAccount_nameId}`);
                continue;
            }

            let lastRankEntry = await LastRank.findOne({ lastRank_fk_leagueAccounts: account._id });
            
            const soloQData = rankData.find(data => data.queueType === 'RANKED_SOLO_5x5') || null;
            const flexQData = rankData.find(data => data.queueType === 'RANKED_FLEX_SR') || null;

            if (!lastRankEntry) {
                logger.info(`[updateRanks] First time seeing ${account.leagueAccount_nameId}. Initializing 'last rank' entry in the database.`);
                // Initialize lastRank entry if it doesn't exist in database
                lastRankEntry = new LastRank({
                    lastRank_fk_leagueAccounts: account._id,
                    lastRank_account:account.leagueAccount_nameId,
                    lastRank_soloqPrevious: soloQData,
                    lastRank_flexPrevious: flexQData,
                    lastRank_soloqCurrent: soloQData,
                    lastRank_soloqDaily: soloQData,
                    lastRank_soloqWeekly: soloQData,
                    lastRank_soloqMonthly: soloQData,
                    lastRank_flexCurrent: flexQData,
                    lastRank_flexDaily: flexQData,
                    lastRank_flexWeekly: flexQData,
                    lastRank_flexMonthly: flexQData,
                });
                await lastRankEntry.save();

            } else {
                // Update database soloQ and flex
                try {
                    const soloQData = rankData.find(data => data.queueType === 'RANKED_SOLO_5x5');
                    const flexQData = rankData.find(data => data.queueType === 'RANKED_FLEX_SR');
                    if (soloQData) {
                        await updateLastRank(lastRankEntry, soloQData, 'soloq');
                    }
                    if (flexQData) {
                        await updateLastRank(lastRankEntry, flexQData, 'flex');
                    }
                    await lastRankEntry.save();

                } catch (error) {
                    logger.error(`[updateRanks] Error saving lastRankEntry for ${account.leagueAccount_nameId}`);
                    logger.error(`${error}`);
                }
            }
        }
    }
    logger.info(`[updateRanks] ${registeredPlayers.length} member(s) have been successfully updated.`);
}

/**
 * Update the new rank and stock previous rank.
 * @param {*} lastRankEntry - database entry
 * @param {*} currentRank - fetched current rank
 * @param {string} queueType 
 * @returns 
 */
async function updateLastRank(lastRankEntry, currentRank, queueType) {
    const lastRank = queueType === 'soloq' ? lastRankEntry.lastRank_soloqCurrent : lastRankEntry.lastRank_flexCurrent;
    if (lastRank && compareRanks(lastRank, currentRank)) {
        // logger.info(`[updateLastRank] This account might be unranked or didn't change between latch fetch`);
        return; // No change in rank
    }
    if (queueType === 'soloq') {
        // logger.info(`[updateLastRank][Solo] Updating last rank in database`);
        lastRankEntry.lastRank_soloqPrevious = { ...lastRankEntry.lastRank_soloqCurrent };
        // logger.info(`[updateLastRank][Solo] Updating new rank in databases`);
        lastRankEntry.lastRank_soloqCurrent = currentRank;
        
    } else if (queueType === 'flex') {
        // logger.info(`[updateLastRank][Flex] Updating last rank in database`);
        lastRankEntry.lastRank_flexPrevious = { ...lastRankEntry.lastRank_flexCurrent };
        // logger.info(`[updateLastRank][Flex] Updating new rank in databases`);
        lastRankEntry.lastRank_flexCurrent = currentRank;
    }
}

/**
 * Check if entries are both the same in rank.
 * @param {*} lastRank - database entry
 * @param {*} currentRank - fetched current rank
 * @returns {boolean}
 */
function compareRanks(lastRank, currentRank) {
    return lastRank.tier === currentRank.tier &&
           lastRank.rank === currentRank.rank &&
           lastRank.leaguePoints === currentRank.leaguePoints;
}

/**
 * Get a custom message of the LP variation for a given player.
 * @param {string} accountId - Riot accound Id.
 * @returns {message} for InfoPanel.
 */
async function rankVariation(accountId) {
    const lastRankEntry = await LastRank.findOne({ lastRank_fk_leagueAccounts: accountId });

    if (!lastRankEntry) return { soloQVariation: '', flexQVariation: '' };;

    const soloQVariation = calculateVariation(lastRankEntry.lastRank_soloqCurrent, lastRankEntry.lastRank_soloqPrevious);
    const flexQVariation = calculateVariation(lastRankEntry.lastRank_flexCurrent, lastRankEntry.lastRank_flexPrevious);

    return { soloQVariation, flexQVariation };
}

/**
 * Get a custom message of the LP variation of the latest game. Used in infochannel.
 * @param {*} currentRank - fetched current rank
 * @param {*} lastRank - database entry
 * @returns {message} for InfoPanel.
 */
function calculateVariation(currentRank, lastRank) {
    if (!lastRank || !currentRank) return ''; // | (? / Solo/Duo)

    let variationMessage = '';

    // Compare tiers
    if (tierOrder[currentRank.tier] !== tierOrder[lastRank.tier]) {
        if (tierOrder[currentRank.tier] > tierOrder[lastRank.tier]) {
            variationMessage = '| (<:greentriangle:1280627014507827250> Rank Up / Solo/Duo)'; // EzBot 1267052111753904139
        } else {
            variationMessage = '| (<:redtriangle:1280627038188732534> Rank Lost / Solo/Duo)'; // EzBot 1267052146650513420
        }
    } else if (rankOrder[currentRank.rank] !== rankOrder[lastRank.rank]) {
        // Compare ranks if tiers are the same
        if (rankOrder[currentRank.rank] > rankOrder[lastRank.rank]) {
            variationMessage = '| (<:greentriangle:1280627014507827250> Division Up / Solo/Duo)';
        } else {
            variationMessage = '| (<:redtriangle:1280627038188732534> Division Lost / Solo/Duo)';
        }
    } else {
        // Compare LP if tiers and ranks are the same
        const lpDifference = currentRank.leaguePoints - lastRank.leaguePoints;
        if (lpDifference > 0) {
            variationMessage = `| (<:greentriangle:1280627014507827250> +${lpDifference} / Solo/Duo)`;
        } else if (lpDifference < 0) {
            variationMessage = `| (<:redtriangle:1280627038188732534> ${lpDifference} / Solo/Duo)`;
        } else {
            variationMessage = ''; // | (? / Solo/Duo)
        }
    }

    return variationMessage;
}

module.exports = { updateRanks, rankVariation };
