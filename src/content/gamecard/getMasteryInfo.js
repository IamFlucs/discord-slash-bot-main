const { searchChampionMastery } = require('../../api/riot/champion-mastery-v4');
const { emblemDict } = require('../../utils/api/riotMessageUtil');
const { createLogger } = require('../../utils/logger/logger');

const debugLog = false;
const logger = createLogger(debugLog);

/**
 * Function to retrieve a champion's mastery information.
 * @param {string} puuid - The UUID of the player to retrieve mastery information for.
 * @param {number} championId - The champion's ID.
 * @returns {Object} - The champion's mastery information.
 */
async function getMasteryInfo(puuid, championId) {
    try {
        const fetchMastery = await searchChampionMastery(puuid, championId);
        if (!fetchMastery) {
            throw new Error(`No mastery data found for championId ${championId}`);
        }
        const fetchMasteryEmblem = fetchMastery.championLevel;
        let MasteryEmblem = emblemDict[fetchMasteryEmblem] || ''; 

        if (fetchMasteryEmblem >= 10) {
            MasteryEmblem = '<:crestandbannermastery10:1277347026639781940>';
        }

        return {
            emblem: MasteryEmblem,
            points: fetchMastery.championPoints || 0
        };
    } catch (error) {
        logger.error(`Mastery null for this player with this champion - ${error.message}`);
        return {
            emblem: '<:mastery0:1280969963724603556>',
            points: 0
        };    }
}

module.exports = { getMasteryInfo };