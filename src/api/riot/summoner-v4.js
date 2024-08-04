const axios = require('axios');
const { riotApiKey } = require('../../../config.json');
const { logger } = require('../../utils/logger/logger');

/**
 * Search for a summoner by game name, region, and tag.
 * @param {string} puuid - The universal unique id.
 * @param {string} subRegion - The region of the summoner.
 * @returns {Promise<Object>} - A promise that resolves to the summoner data.
 */
async function searchSummoner(puuid, subRegion) {
    const riotURL = `.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/`;
    const fetchSummoner = `https://${subRegion}${riotURL}${puuid}?api_key=${riotApiKey}`;

    try {
        const response = await axios.get(fetchSummoner);
        // /* DEBUG */ logger.log('API response:', JSON.stringify(response.data, null, 2));

        // // Handle errors > à supprimer ?
        // if (response.data.status) {
        //     // Check for errors in the status object
        //     const { status_code, message } = response.data.status;
        //     throw new Error(`${status_code}: ${message}`);
        // }
        return response.data;
    } catch (error) {
        // /* DEBUG */ logger.log('Error details:', JSON.stringify(error.response ? error.response.data : error, null, 2));

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
                        errorMessage = 'Summoner not found. Please check the game name and tag.';
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

module.exports = { searchSummoner };
