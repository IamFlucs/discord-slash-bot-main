const Player = require('../../schemas/player');
const LeagueAccount = require('../../schemas/league_account');
const LastRank = require('../../schemas/last_rank');
const { searchRank } = require('../api/league-v4');
const { logger } = require('../tools/logger');

async function updateRanks(guildId) {
    // Get all registered users
    const registeredPlayers = await Player.find({ player_fk_guildId: guildId });

    // Processing registered players
    for (const player of registeredPlayers) {
        const leagueAccounts = await LeagueAccount.find({ _id: { $in: player.player_fk_leagueAccounts } });

        // Processing player accounts
        for (const account of leagueAccounts) {
            let rankData;
            try {
                rankData = await searchRank(account.leagueAccount_summonerId, account.leagueAccount_server);
            } catch (error) {
                logger.warning(`/!\\ updateRanks.js`);
                logger.error(`Error fetching rank for ${account.leagueAccount_nameId}: ${error}`);
                continue;
            }
            if (!rankData) {
                logger.warning(`No rank data found for ${account.leagueAccount_nameId}`);
                continue;
            }

            let lastRankEntry = await LastRank.findOne({ lastRank_fk_leagueAccounts: account._id });

            const soloQData = rankData.find(data => data.queueType === 'RANKED_SOLO_5x5') || null;
            const flexQData = rankData.find(data => data.queueType === 'RANKED_FLEX_SR') || null;
            if (!lastRankEntry) {
                // Initialize or update lastRank entry
                lastRankEntry = new LastRank({
                    lastRank_fk_leagueAccounts: account._id,
                    lastRank_soloq: soloQData,
                    lastRank_flex: flexQData,
                    lastRank_soloqSecond: soloQData,
                    lastRank_soloqDaily: soloQData,
                    lastRank_soloqWeekly: soloQData,
                    lastRank_soloqMonthly: soloQData,
                    lastRank_flexSecond: flexQData,
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
                    logger.error(`Error saving lastRankEntry for ${account.leagueAccount_nameId}: ${error}`);
                }
            }

            
        }
    }
}

async function updateLastRank(lastRankEntry, currentRank, queueType) {
    const lastRank = queueType === 'soloq' ? lastRankEntry.lastRank_soloq : lastRankEntry.lastRank_flex;
    if (lastRank && compareRanks(lastRank, currentRank)) return; // No change in rank

    if (queueType === 'soloq') {
        lastRankEntry.lastRank_soloq = { ...lastRankEntry.lastRank_soloqSecond };
        lastRankEntry.lastRank_soloqSecond = currentRank;
    } else if (queueType === 'flex') {
        lastRankEntry.lastRank_flex = { ...lastRankEntry.lastRank_flexSecond };
        lastRankEntry.lastRank_flexSecond = currentRank;
    }
}

function compareRanks(lastRank, currentRank) {
    return lastRank.tier === currentRank.tier &&
           lastRank.rank === currentRank.rank &&
           lastRank.leaguePoints === currentRank.leaguePoints;
}

async function rankVariation(accountId) {
    const lastRankEntry = await LastRank.findOne({ lastRank_fk_leagueAccounts: accountId });

    if (!lastRankEntry) return { soloQVariation: '', flexQVariation: '' };;

    const soloQVariation = calculateVariation(lastRankEntry.lastRank_soloqSecond, lastRankEntry.lastRank_soloq);
    const flexQVariation = calculateVariation(lastRankEntry.lastRank_flexSecond, lastRankEntry.lastRank_flex);

    return { soloQVariation, flexQVariation };
}

const tierOrder = {
    'Unranked': 0,
    'IRON': 1,
    'BRONZE': 2,
    'SILVER': 3,
    'GOLD': 4,
    'PLATINUM': 5,
    'EMERALD': 6,
    'DIAMOND': 7,
    'MASTER': 8,
    'GRANDMASTER': 9,
    'CHALLENGER': 10
};

const rankOrder = {
    'IV': 0,
    'III': 1,
    'II': 2,
    'I': 3
};

function calculateVariation(currentRank, lastRank) {
    if (!lastRank || !currentRank) return '| (? / Solo/Duo)';

    let variationMessage = '';

    // Compare tiers
    if (tierOrder[currentRank.tier] !== tierOrder[lastRank.tier]) {
        if (tierOrder[currentRank.tier] > tierOrder[lastRank.tier]) {
            variationMessage = '| (<:greentriangle:1267052111753904139> Rank Up / Solo/Duo)';
        } else {
            variationMessage = '| (<:redtriangle:1267052146650513420> Rank Lost / Solo/Duo)';
        }
    } else if (rankOrder[currentRank.rank] !== rankOrder[lastRank.rank]) {
        // Compare ranks if tiers are the same
        if (rankOrder[currentRank.rank] > rankOrder[lastRank.rank]) {
            variationMessage = '| (<:greentriangle:1267052111753904139> Division Up / Solo/Duo)';
        } else {
            variationMessage = '| (<:redtriangle:1267052146650513420> Division Lost / Solo/Duo)';
        }
    } else {
        // Compare LP if tiers and ranks are the same
        const lpDifference = currentRank.leaguePoints - lastRank.leaguePoints;
        if (lpDifference > 0) {
            variationMessage = `| (<:greentriangle:1267052111753904139> +${lpDifference} / Solo/Duo)`;
        } else if (lpDifference < 0) {
            variationMessage = `| (<:redtriangle:1267052146650513420> ${lpDifference} / Solo/Duo)`;
        } else {
            variationMessage = '| (? / Solo/Duo)';
        }
    }

    return variationMessage;
}

module.exports = { updateRanks, rankVariation };
