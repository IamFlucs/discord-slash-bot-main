const { riotApiKey } = require('../../../config.json');
const { createLogger } = require('../../utils/logger/logger');
const axios = require('axios');

/**
 * Search for a summoner by game name, region, and tag.
 * @param {string} gameName - The game name of the summoner.
 * @param {string} region - The region of the summoner.
 * @param {string} tag - The tag of the summoner.
 * @returns {Promise<Object>} - A promise that resolves to the summoner data.
 */
async function searchAccount(gameName, region, tag) {
    const debugLog = false;
    const logger = createLogger(debugLog);

    const riotURL = `.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tag}`;
    const fetchAccount = `https://${region}${riotURL}?api_key=${riotApiKey}`;

    try {
        const response = await axios.get(fetchAccount);
        return response.data;
    } catch (error) {
        logger.info('Error details:', JSON.stringify(error.response ? error.response.data : error, null, 2));

        if (error.response) {
            if (error.response && error.response.data.status) {
                // Request was made and the server responded with a status object
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
                        errorMessage = 'Summoner not found 2. Please check the game name and tag.';
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
                // Request was made but no response was received
                throw new Error('No response received from the server.');
            } else {
                // Something happened in setting up the request that triggered an Error
                throw new Error('Error setting up the request.');
            }
        }
    }
}

module.exports = { searchAccount };

// Example
// {
//     "puuid": "0Z6K4rkBJZJNFbQXnPHfs4fRsjVyRiIjpwo_...",
//     "gameName": "IamFlucs",
//     "tagLine": "EUW"
// }
// Warning: when changing API key all puuid change
