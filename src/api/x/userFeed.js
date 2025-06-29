const { getXClient } = require('./xClient');
const { createLogger } = require('../../utils/logger/logger');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * Fetches tweets from a given user.
 * @param {string} username - X username without the @
 * @param {number} count - Number of tweets to fetch (max 100/month)
 * @returns {Promise<Object>} - Tweet data
 */
async function getUserTweets(username) { // between 5 and 100
    try {
        logger.phase(`[getUserTweets] Called with username=${username}`);
        
        const xClient = getXClient();

        // Retrieve the userId from username
        const userResponse = await xClient.v2.userByUsername(username);
        if (!userResponse.data) {
            throw new Error(`[getUserTweets] User not found with username=${username}`);
        }
        const userId = userResponse.data.id;
        
        logger.info(`[getUserTweets] User found wither username=${username} (UserId=${userId})`);

        const timeline = await xClient.v2.userTimeline(userId, { // ⚠️ 1 requests / 15 mins
            max_results: 5, // ⚠️ Min 5, max 100. Retrieve up to 100 Posts and 500 write per month
            expansions: 'attachments.media_keys',
            "tweet.fields": "text,created_at,id",
            "media.fields": "url,preview_image_url,type"
        })

        return { timeline };

    } catch (error) {
        logger.error(`[getUserTweets] Error while fetching user feed`, JSON.stringify(error, null, 2));
        logger.error(error);
        throw error;
    }
}

module.exports = { getUserTweets };