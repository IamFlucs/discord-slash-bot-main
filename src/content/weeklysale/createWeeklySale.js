const { EmbedBuilder } = require('discord.js');
const { getUserTweets } = require('../../api/x/userFeed');
const { createLogger } = require('../../utils/logger/logger');

const logger = createLogger(true);
/**
 * Embed latest tweets from SkinSpotlights in a message and sends it channels setup for it.
 * @param {object} client - The Discord client instance.
 * @param {string} guildId - The ID of the guild where the message should be sent.
 * @param {string} ws_channelId - The ID of the channel where the message should be sent.
 */
async function createWeeklySaleEmbed(client, guildId, channelId) {
  try {
    const username = 'SkinSpotlights';
    logger.info('');
    logger.info(`[createWeeklySaleEmbed] Called with guildId=${guildId}, channelId=${channelId}`);
    const twitterResponse = await getUserTweets(username);
    const jsonData = twitterResponse.timeline;

    if (!jsonData._realData || !jsonData._realData.data) {
        logger.error('[createWeeklySaleEmbed] No valid data found in the user feed');
        return;
    }

    // Find the latest Weekly Sale tweet
    const weeklySaleTweet = jsonData._realData.data.find(tweet =>
        tweet.text?.toLowerCase().includes('weekly sale')
    );
    if (!weeklySaleTweet) {
        logger.warning('[createWeeklySaleEmbed] The Weekly Sale tweet was not found in the feed');
        return;
    }

    // const tweetId = weeklySaleTweet.id;
    // const tweetText = weeklySaleTweet.text;

    // Check for media attachments
    const mediaKeys = weeklySaleTweet.attachments?.media_keys || [];
    if (mediaKeys.length === 0) {
        logger.warning('[createWeeklySaleEmbed] No image found in the Weekly Sale tweet');
        return;
    }
    
    // Find the associated media
    if (!jsonData._realData.includes || !jsonData._realData.includes.media) {
        logger.warning('[createWeeklySaleEmbed] No media included in the Twitter feed');
        return;
    }

    const media = jsonData._realData.includes.media.find(m => 
        mediaKeys.includes(m.media_key)
    );
    
    if (!media || !media.url) {
        logger.warning('[createWeeklySaleEmbed] No image URL found in the Weekly Sale tweet');
        return;
    }

    // Compute the promotion end date (+7 days from today)
    const now = new Date();
    now.setDate(now.getDate() + 7);
    const endDate = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    logger.info(`[createWeeklySaleEmbed] New date: ${endDate}`);

    const embed = new EmbedBuilder()
        .setTitle(`🪙 Promotions jusqu'au ${endDate}`)
        // .setDescription(tweetText)
        .setImage(media.url)
        .setColor(0x020A14)
        // .setURL(`https://twitter.com/${username}/status/${tweetId}`);

    // Send the embed to the specified channel
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
        logger.error(`[createWeeklySaleEmbed] Guild not found: ${guildId}`);
        return;
    }
    const channel = guild.channels.cache.get(channelId);
    if (!channel) {
        logger.error(`[createWeeklySaleEmbed] Channel not found: ${channelId}`);
        return;
    }
    await channel.send({ embeds: [embed] });
    logger.info(`[createWeeklySaleEmbed] Weekly Sale embed sent in channel ${channelId}`);

  } catch (error) {
    logger.error(`[createWeeklySaleEmbed] Error while processing the embed construction: ${error.message}`, error);
  }
}

module.exports = { createWeeklySaleEmbed };