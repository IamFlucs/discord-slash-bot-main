const { EmbedBuilder } = require('discord.js');
const { getUserTweets } = require('../../api/twitter/userFeed');
const { createLogger } = require('../../utils/logger/logger');

const logger = createLogger(true);
/**
 * Fetches the latest Weekly Sale tweet from SkinSpotlights and sends an embed to the specified channel.
 * @param {object} client - The Discord client instance.
 * @param {string} guildId - The ID of the guild where the message should be sent.
 * @param {string} ws_channelId - The ID of the channel where the message should be sent.
 */
async function createWeeklySaleEmbed(client, guildId, channelId) {
  try {
    const username = 'SkinSpotlights';
    const twitterResponse = await getUserTweets(username);
    const jsonData = twitterResponse.timeline;

    if (!jsonData._realData || !jsonData._realData.data) {
        logger.error('❌ No valid Twitter data found.');
        return;
    }

    // Find the latest Weekly Sale tweet
    const weeklySaleTweet = jsonData._realData.data.find(tweet =>
        tweet.text?.toLowerCase().includes('weekly sale')
    );
    if (!weeklySaleTweet) {
        logger.warning('⚠️ No "Weekly Sale" tweet found.');
        return;
    }

    const tweetId = weeklySaleTweet.id;
    const tweetText = weeklySaleTweet.text;

    // 🔍 Check for media attachments
    const mediaKeys = weeklySaleTweet.attachments?.media_keys || [];
    if (mediaKeys.length === 0) {
        logger.warning('⚠️ No images found in the Weekly Sale tweet.');
        return;
    }
    
    // 🔍 Find the associated media
    if (!jsonData._realData.includes || !jsonData._realData.includes.media) {
        logger.warning('⚠️ No media included in the Twitter response.');
        return;
    }

    const media = jsonData._realData.includes.media.find(m => 
        mediaKeys.includes(m.media_key)
    );
    
    if (!media || !media.url) {
        logger.warning('⚠️ No image URL found for the Weekly Sale tweet.');
        return;
    }

    // 📅 Compute the promotion end date (+7 days)
    const now = new Date();
    now.setDate(now.getDate() + 7);
    const endDate = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

    // 📌 Create embed
    const embed = new EmbedBuilder()
        .setTitle(`🪙 Promotions jusqu'au ${endDate}`)
        // .setDescription(tweetText)
        .setImage(media.url)
        .setColor(0x020A14)
        // .setURL(`https://twitter.com/${username}/status/${tweetId}`);

    // 📢 Send the embed to the specified channel
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
        logger.error(`❌ Guild not found: ${guildId}`);
        return;
    }

    const channel = guild.channels.cache.get(channelId);
    if (!channel) {
        logger.error(`❌ Channel not found: ${channelId}`);
        return;
    }

    await channel.send({ embeds: [embed] });
    logger.ok(`✅ Weekly Sale embed sent in channel ${channelId}`);
  } catch (error) {
    logger.error(`❌ Erreur de traitement: ${error.message}`, error);
    // logger.error(`❌ Erreur de traitement:`, JSON.stringify(error, null, 2));
  }
}

module.exports = { createWeeklySaleEmbed };