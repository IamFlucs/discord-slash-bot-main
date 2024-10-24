const { reverseQueueType, regionDict } = require('../../utils/api/riotMessageUtil');
const { riotApiKey } = require('../../../config.json');
const { createLogger } = require('../../utils/logger/logger');
const axios = require('axios');

/**
 * Search for matches based on criteria.
 * @param {string} puuid - The universal unique id of the summoner.
 * @param {string} subRegion - The region of the summoner.
 * @param {string} startTime - Epoch timestamp in seconds to begin the search.
 * @param {string} endTime - Epoch timestamp in seconds to end the search.
 * @param {string} queueType - Filter a list of match by a specific queue id. 
 * @returns {Promise<Object>} - Get a list of match ids.
 */
async function searchMatch(puuid, subRegion, startTime, endTime, queueType) {
    const debugLog = false;
    const logger = createLogger(debugLog);

    const riotURL = `.api.riotgames.com/lol/match/v5/matches/by-puuid/`;
    const fetchMatch = `https://${regionDict[subRegion]}${riotURL}${puuid}/ids?startTime=${startTime}&endTime=${endTime}&queue=${reverseQueueType[queueType]}&start=0&count=100&api_key=${riotApiKey}`;

    try {
        const response = await axios.get(fetchMatch);
        logger.info('API response:', JSON.stringify(response.data, null, 2));
        return response.data;

    } catch (error) {
        logger.info('Error details:', JSON.stringify(error.response ? error.response.data : error, null, 2));

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
                        errorMessage = 'Summoner not found 5. Please check the game name and tag.';
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
        } else {
            // If there’s no response or request object, log the general error
            logger.error('An unknown error occurred in match-v5:', error);
            throw new Error('An unknown error occurred in match-v5.');
        }
    }
}

module.exports = { searchMatch };

// Example
// [
//     "EUW1_706394...",
//     "EUW1_706388..."
// ]