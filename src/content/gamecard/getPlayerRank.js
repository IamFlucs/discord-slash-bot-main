const { tierDict, rankDict, tierEmojiDict } = require('../../utils/api/riotMessageUtil');
const { searchRank } = require('../../api/riot/league-v4');

/**
 * Function to retrieve a player's rank and LP.
 * @param {Object} currentGame - The current game data.
 * @param {string} summonerId - The ID of the player to retrieve information for.
 * @param {string} server - The League account server to retrieve data from.
 * @returns {Object} - The player's rank and LP information.
 */
async function getPlayerRankInfo(currentGame, summonerId, server) {
    // Call the Riot API to retrieve rank information
    const fetchPlayer = await searchRank(summonerId, server); 
    let player_Tier = "Unranked";
    let player_Rank = "";
    let player_LP = 0;
    let player_emblem = '';

    if (currentGame.gameQueueConfigId === 440) { // TYPE 440 corresponds to Flex
        const fetchRank = fetchPlayer.find(data => data.queueType === 'RANKED_FLEX_SR') || null;
        if (fetchRank) {
            player_Tier = tierDict[fetchRank.tier] || player_Tier;
            player_Rank = rankDict[fetchRank.rank] || player_Rank;
            player_LP = fetchRank.leaguePoints || player_LP;
            player_emblem = tierEmojiDict[fetchRank.tier] || '';
        }
    } else {
        const fetchRank = fetchPlayer.find(data => data.queueType === 'RANKED_SOLO_5x5') || null;
        if (fetchRank) {
            player_Tier = tierDict[fetchRank.tier] || player_Tier;
            player_Rank = rankDict[fetchRank.rank] || player_Rank;
            player_LP = fetchRank.leaguePoints || player_LP;
            player_emblem = tierEmojiDict[fetchRank.tier] || '';
        }
    }

    return {
        rank: player_Tier === "Unranked" ? "<:unranked:1280220249337237595> Unranked" : `${player_emblem} ${player_Tier} ${player_Rank}`,
        lp: player_LP
    };
}

module.exports = { getPlayerRankInfo };