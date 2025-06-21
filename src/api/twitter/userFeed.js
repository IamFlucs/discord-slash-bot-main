const { getTwitterClient } = require('./twitterClient');
const { createLogger } = require('../../utils/logger/logger');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * Récupère les tweets d'un utilisateur. 1
 * @param {string} username - Nom d'utilisateur Twitter sans @
 * @param {number} count - Nombre de tweets à récupérer (max 100)
 * @returns {Promise<Object>} - Données des tweets 
 */
async function getUserTweets(username) { // between 5 and 100
    try {
        const twitterClient = getTwitterClient();

        // Récupérer l'ID de l'utilisateur
        const userResponse = await twitterClient.v2.userByUsername(username);
        if (!userResponse.data) {
            throw new Error(`Utilisateur ${username} non trouvé`);
        }

        logger.debug(JSON.stringify(userResponse, null, 2));
        const userId = userResponse.data.id;
        logger.debug(`✅ Utilisateur trouvé: ${username} (ID: ${userId})`);

        const timeline = await twitterClient.v2.userTimeline(userId, { // ⚠️ 1 requests / 15 mins
            max_results: 5, // ⚠️ Min 5, max 100. Retrieve up to 100 Posts and 500 write per month
            expansions: 'attachments.media_keys',
            "tweet.fields": "text,created_at,id",
            "media.fields": "url,preview_image_url,type"
        })

        // logger.info(`✅ Tweets récupérés: ${JSON.stringify(timeline, null, 2)}`);
        // logger.info("The user timeline type is: ", typeof(timeline));
        if (timeline._realData.data) {
            logger.debug('✅ Timeline <_realData.data> valide.');
        }
        return { timeline };

    } catch (error) {
        logger.error(`❌ Erreur Twitter API:`, JSON.stringify(error, null, 2));
        logger.error(error);
        throw error;
    }
}

module.exports = { getUserTweets };