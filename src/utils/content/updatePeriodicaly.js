const { tierOrder, rankOrder } = require('../tools/rankUtils');
const LastRank = require('../../schemas/lastRank');
const { searchRank } = require('../api/league-v4');
const { logger } = require('../tools/logger');

async function updateDaily(accountId) {
    return await updatePeriodicalRank(accountId, 'Daily');
}

async function updateWeekly(accountId) {
    return await updatePeriodicalRank(accountId, 'Weekly');
}

async function updateMonthly(accountId) {
    return await updatePeriodicalRank(accountId, 'Monthly');
}

async function updatePeriodicalRank(accountId, period) {
    const lastRankEntry = await LastRank.findOne({ lastRank_fk_leagueAccounts: accountId });

    if (!lastRankEntry) return null;

    const rankData = await searchRank(lastRankEntry.lastRank_fk_leagueAccounts);

    const currentSoloQData = rankData.find(data => data.queueType === 'RANKED_SOLO_5x5');
    const currentFlexQData = rankData.find(data => data.queueType === 'RANKED_FLEX_SR');

    const soloQDiff = calculatePeriodicalDifference(lastRankEntry[`lastRank_soloq${capitalize(period)}`], currentSoloQData);
    const flexQDiff = calculatePeriodicalDifference(lastRankEntry[`lastRank_flex${capitalize(period)}`], currentFlexQData);

    // Update the database with the new rank
    lastRankEntry[`lastRank_soloq${capitalize(period)}`] = currentSoloQData;
    lastRankEntry[`lastRank_flex${capitalize(period)}`] = currentFlexQData;

    await lastRankEntry.save();

    return { soloQDiff, flexQDiff };
}

function calculatePeriodicalDifference(startRank, endRank) {
    if (!startRank || !endRank) return 0;

    const startTier = tierOrder[startRank.tier];
    const endTier = tierOrder[endRank.tier];

    const startRankOrder = rankOrder[startRank.rank];
    const endRankOrder = rankOrder[endRank.rank];

    const startLP = startRank.leaguePoints;
    const endLP = endRank.leaguePoints;

    // Convert rank in LP equivalent
    const totalStartLP = startTier * 400 + startRankOrder * 100 + startLP;
    const totalEndLP = endTier * 400 + endRankOrder * 100 + endLP;

    return totalEndLP - totalStartLP;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = { updateDaily, updateWeekly, updateMonthly };
