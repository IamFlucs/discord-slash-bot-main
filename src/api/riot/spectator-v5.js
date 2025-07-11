const { riotApiKey } = require('../../../config.json');
const { createLogger } = require('../../utils/logger/logger');
const axios = require('axios');

const debugLog = false;
const logger = createLogger(debugLog);

/**
 * Search for a summoner by game name, region, and tag.
 * @param {string} puuid - The universal unique id.
 * @param {string} subRegion - The region of the summoner.
 * @returns {Promise<Object>} - Get current game information for the given puuid.
 */
async function searchCurrentGame(puuid, subRegion) {


    const riotURL = `.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/`;
    const fetchSummoner = `https://${subRegion}${riotURL}${puuid}?api_key=${riotApiKey}`;

    try {
        logger.info('');
        logger.phase(`[spectator-v5] Called with puuid=${puuid}, subRegion=${subRegion}`);
        logger.info(`[spectator-v5] Request URL : ${fetchSummoner}`);

        const response = await axios.get(fetchSummoner);
        // logger.info('[spectator-v5] API response:', JSON.stringify(response.data, null, 2));
        return response.data;

    } catch (error) {
        if (error.response) {
            if (error.response.status === 404){
                // Player not in game
                return null;
            }
            const { status_code, message } = error.response.data.status || {};
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
                    errorMessage = 'Data not found. Spectator game info isn\'t found.';
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

module.exports = { searchCurrentGame };