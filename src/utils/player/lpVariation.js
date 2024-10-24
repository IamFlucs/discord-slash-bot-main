const { tierOrder, rankOrder } = require('../../utils/api/riotMessageUtil');

/**
 * Function for calculating the League Points variation
 * @param {*} startRank - Old rank, fetch from database
 * @param {*} endRank - Current rank
 * @returns {number} - return an LP equivalent number of the difference between 2 ranks.
 */
function lpVariation(startRank, endRank) {
    if (!startRank || !endRank) return 0;

    const startTier = tierOrder[startRank.tier];
    const endTier = tierOrder[endRank.tier];

    const startRankOrder = rankOrder[startRank.rank];
    const endRankOrder = rankOrder[endRank.rank];

    const startLP = startRank.leaguePoints;
    const endLP = endRank.leaguePoints;

    // Convert all to LP equivalent
    const totalStartLP = startTier * 400 + startRankOrder * 100 + startLP;
    const totalEndLP = endTier * 400 + endRankOrder * 100 + endLP;

    return totalEndLP - totalStartLP;
}

module.exports = { lpVariation };