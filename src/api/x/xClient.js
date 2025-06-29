const { TwitterApi } = require('twitter-api-v2');
const { xBearerToken } = require('../../../config.json');

function initializeTwitterClient() {
    return new TwitterApi(xBearerToken);  
}

let xClientInstance = null;
function getXClient() {
    if (!xClientInstance) {
        xClientInstance = initializeTwitterClient();
    }
    return xClientInstance;
}

module.exports = { getXClient };