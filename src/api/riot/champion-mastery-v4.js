const { riotApiKey } = require('../../../config.json');
const { createLogger } = require('../../utils/logger/logger');
const axios = require('axios');

/**
 * Get a champion mastery by puuid and champion ID.
 * @param {string} puuid - The universal unique id of the summoner.
 * @param {string} id - Champion ID to retrieve Champion Mastery.
 * @returns {Promise<Object>} - A promise that get a champion mastery.
 */
async function searchChampionMastery(puuid, id) {
    const debugLog = false;
    const logger = createLogger(debugLog);

    const region = `euw1`; // FIXME: -> fetchAccountData.leagueAccount_server
    const riotURL = `.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/by-champion/${id}`;
    const fetchAccount = `https://${region}${riotURL}?api_key=${riotApiKey}`;

    try {
        const response = await axios.get(fetchAccount);
        if (response.status !== 200 || !response.data) {
            throw new Error(`Failed to fetch mastery data for ${puuid}`);
        }
        return response.data;
    } catch (error) {
        logger.info('Error details:', JSON.stringify(error.response ? error.response.data : error, null, 2));

        if (error.response) {
            if (error.response && error.response.data.status) {
                // Request was made and the server responded with a status object
                const { status_code, message } = error.response.data.status || {};

                if (status_code === 404) {
                    logger.warning(`Summoner not found - Champion mastery not found.`);
                    return null;
                }
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
                throw new Error(errorMessage || `An error occurred: ${message}`);
            } else if (error.request) {
                // Request was made but no response was received
                throw new Error('No response received from the server.');
            } else {
                // Something happened in setting up the request that triggered an Error
                throw new Error('Error setting up the request.');
            }
        }
    }
}

module.exports = { searchChampionMastery };

// Example
// {
//     "puuid": "0Z6K4rkBJZJNFbQXnPHfs4fRsjVyRiIjpw...",
//     "championId": 81,
//     "championLevel": 20,
//     "championPoints": 235883,
//     "lastPlayTime": 1724581053000,
//     "championPointsSinceLastLevel": 50283,
//     "championPointsUntilNextLevel": -39283,
//     "markRequiredForNextLevel": 2,
//     "tokensEarned": 1,
//     "championSeasonMilestone": 5,
//     "milestoneGrades": [
//         "C+",
//         "B",
//         "S",
//         "B-",
//         "A+"
//     ],
//     "nextSeasonMilestone": {
//         "requireGradeCounts": {
//             "S-": 3
//         },
//         "rewardMarks": 1,
//         "bonus": true,
//         "totalGamesRequires": 3
//     }
// }

// Example for no mastery on a champion (never played)
// {
//     "status": {
//         "status_code": 404,
//         "message": "Not found"
//     }
// }
// Warning: when changing API key all puuid change