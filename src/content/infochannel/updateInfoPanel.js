const { createInfoPanel } = require('./createInfoPanel');
const { createTimestamp } = require('../../utils/date/timestamp');
const { createLogger } = require('../../utils/logger/logger');
const InfoChannel = require('../../database/schemas/info_channel');
const InfoPanel = require('../../database/schemas/info_panel_message');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * Update the info panel message.
 * @param {Client} client - The Discord client.
 * @param {string} guildId - The ID of the guild.
 */
async function updateInfoPanel(client, guildId) {
    try {
        logger.info('');
        logger.info(`[updateInfoPanel] Called with guildId=${guildId}`);
        const newTimestamp = createTimestamp();

        // Check if the bot is still in the guild
        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            logger.warning(`[updateInfoPanel] The bot is no longer a member of the Discord server (ID=${guildId})`);
            logger.warning('[updateInfoPanel] Aborting function')
            return;
        }

        // Get the Info Channel in the database
        const searchedInfoChannel = await InfoChannel.findOne({ infoChannel_fk_guild: guildId });
        if (!searchedInfoChannel) {
            // All guild that don't have infoChannel will pop an Error.
            // TODO: create a boolean in guild.js to quickly filter which guild has an infoChannel.
            return;
        }

        const channelId = searchedInfoChannel.infoChannel_channelId;

        // Find the info Panel
        const searchedInfoPanel = await InfoPanel.findOne({ infoPanel_fk_infoChannel: searchedInfoChannel._id });
        if (!searchedInfoPanel) {
            logger.error('[updateInfoPanel] Failed to find the info panel entry.');
            return;
        }

        // Generate new panel content
        const panelContent = await createInfoPanel(guildId, newTimestamp);

        // Fetch the channel and message
        const channel = await client.channels.fetch(channelId);
        if (!channel) {
            logger.error('[updateInfoPanel] Failed to fetch the channel.');
            return;
        }

        const message = await channel.messages.fetch(searchedInfoPanel.infoPanel_messageId);
        if (!message) {
            logger.error('[updateInfoPanel] Failed to fetch the message.');
            return;
        }

        // Check if the message author is the bot
        if (message.author.id !== client.user.id) {
            // logger.debug('The message was not authored by the bot. Skipping update.');
            return;
        }

        // Edit the message with the new timestamp
        await message.edit({
            content: panelContent,
            allowedMentions: { parse: [] }
        });

        logger.info(`[updateInfoPanel] Info Panel updated successfully.`);

    } catch (error) {
        logger.error(`[updateInfoPanel] Error refreshing info panel`);
        logger.error(`${error}`); 
    }
}

module.exports = { updateInfoPanel };
