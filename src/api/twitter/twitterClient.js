const { TwitterApi } = require('twitter-api-v2');
const { xBearerToken } = require('../../../config.json');

function initializeTwitterClient() {
    return new TwitterApi(xBearerToken);  
}

let twitterClientInstance = null;
function getTwitterClient() {
    if (!twitterClientInstance) {
        twitterClientInstance = initializeTwitterClient();
    }
    return twitterClientInstance;
}

module.exports = { getTwitterClient };