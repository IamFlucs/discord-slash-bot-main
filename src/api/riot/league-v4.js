const { riotApiKey } = require('../../../config.json');
const { createLogger } = require('../../utils/logger/logger');
const axios = require('axios');

const debugLog = false;
const logger = createLogger(debugLog);

/**
 * Search rank informations in league for a summoner.
 * Get /lol/league/v4/entries/by-puuid/{encryptedPUUID}
 * @param {string} encryptedPUUID - The encryptedPUUID.
 * @param {string} subRegion - The region of the summoner.
 * @returns {Promise<Object>} - Get league entries in all queues for a given encryptedPUUID.
 */
async function searchRank(encryptedPUUID, subRegion) {
    const riotURL = `.api.riotgames.com/lol/league/v4/entries/by-puuid/`;
    const fetchSummoner = `https://${subRegion}${riotURL}${encryptedPUUID}?api_key=${riotApiKey}`;

    try {
        logger.info('');
        logger.phase(`[league-v4] Called with encryptedPUUID=${encryptedPUUID}, subRegion=${subRegion}`);
        logger.info(`[league-v4] Request URL : ${fetchSummoner}`);
        
        const response = await axios.get(fetchSummoner);
        return response.data;

    } catch (error) {
        if (error.response) {
            if (error.response && error.response.data.status) {
                // The request was made and the server responded with a status object
                const { status_code, message } = error.response.data.status;
                let errorMessage;
    
                switch (status_code) {
                    case 400:
                        errorMessage = 'Bad request. Please check the entered data.';
                        break;
                    case 401:
                        errorMessage = 'Unauthorized. Please check your API key.';
                        break;
                    case 403:
                        errorMessage = 'Forbidden. Access is denied.';
                        break;
                    case 404:
                        errorMessage = 'Summoner not found 4. Please check the game name and tag.';
                        break;
                    case 405:
                        errorMessage = 'Method not allowed.';
                        break;
                    case 415:
                        errorMessage = 'Unsupported media type.';
                        break;
                    case 429:
                        errorMessage = 'Rate limit exceeded. Please try again later.';
                        break;
                    case 500:
                        errorMessage = 'Internal server error. Please try again later.';
                        break;
                    case 502:
                        errorMessage = 'Bad gateway.';
                        break;
                    case 503:
                        errorMessage = 'Service unavailable. Please try again later.';
                        break;
                    case 504:
                        errorMessage = 'Gateway timeout. Please try again later.';
                        break;
                    default:
                        errorMessage = `An unknown error occurred: ${message}`;
                }
                throw new Error(errorMessage);
            } else if (error.request) {
                // The request was made but no response was received
                throw new Error('No response received from the server.');
            } else {
                // Something happened in setting up the request that triggered an Error
                throw new Error('Error setting up the request.');
            }
        }
    }
}

module.exports = { searchRank };

// Example
// [
//     {
//       "leagueId": "5ce62f3e-8c28-45c9-93d9...",
//       "queueType": "RANKED_FLEX_SR",
//       "tier": "EMERALD",
//       "rank": "I",
//       "summonerId": "1j0miQbViwN0QKI90IMF_NN_...",
//       "leaguePoints": 15,
//       "wins": 5,
//       "losses": 2,
//       "veteran": false,
//       "inactive": false,
//       "freshBlood": false,
//       "hotStreak": true
//     },
//     {
//       "queueType": "CHERRY",
//       "summonerId": "1j0miQbViwN0QKI90IMF_NN_...",
//       "leaguePoints": 0,
//       "wins": 19,
//       "losses": 24,
//       "veteran": false,
//       "inactive": false,
//       "freshBlood": false,
//       "hotStreak": false
//     },
//     {
//       "leagueId": "311eb19b-eefd-4c59-9bc8-...",
//       "queueType": "RANKED_SOLO_5x5",
//       "tier": "PLATINUM",
//       "rank": "I",
//       "summonerId": "1j0miQbViwN0QKI90IMF_NN_...",
//       "leaguePoints": 78,
//       "wins": 13,
//       "losses": 12,
//       "veteran": false,
//       "inactive": false,
//       "freshBlood": false,
//       "hotStreak": false
//     }
//   ]
// Warning: when changing API key all encryptedSummonerId change