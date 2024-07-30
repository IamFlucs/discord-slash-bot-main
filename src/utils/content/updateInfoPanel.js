const { createInfoPanel } = require('./createInfoPanel');
const { createTimestamp } = require('../tools/timestamp');
const { logger } = require('../tools/logger');
const InfoChannel = require('../../schemas/info_channel');
const InfoPanel = require('../../schemas/info_panel_message');

/**
 * Update the info panel message.
 * @param {Client} client - The Discord client.
 * @param {string} guildId - The ID of the guild.
 */
async function updateInfoPanel(client, guildId) {
    try {
        const newTimestamp = createTimestamp();

        // Find the info Channel
        const searchedInfoChannel = await InfoChannel.findOne({ infoChannel_fk_guild: guildId });
        if (!searchedInfoChannel) {
            // logger.spam('Failed to find the info channel entry.');
            // We don't log this case because all guild that don't have infoChannel will pop an Error.
            // TODO: create a boolean in guild.js to quickly filter which guild has an infoChannel.
            return;
        }

        const channelId = searchedInfoChannel.infoChannel_channelId;

        // Find the info Panel
        const searchedInfoPanel = await InfoPanel.findOne({ infoPanel_fk_infoChannel: searchedInfoChannel._id });
        if (!searchedInfoPanel) {
            logger.error('Failed to find the info panel entry.');
            return;
        }

        // Generate new panel content
        const panelContent = await createInfoPanel(guildId, newTimestamp);

        // Fetch the channel and message
        const channel = await client.channels.fetch(channelId);
        if (!channel) {
            logger.error('Failed to fetch the channel.');
            return;
        }

        const message = await channel.messages.fetch(searchedInfoPanel.infoPanel_messageId);
        if (!message) {
            logger.error('Failed to fetch the message.');
            return;
        }

        // Edit the message with the new timestamp
        await message.edit({
            content: panelContent
        });

        // logger.info(`Info panel updated successfully.`);

    } catch (error) {
        logger.warning('/!\\ updateInfoPanel.js');
        logger.error(`Error refreshing info panel: ${error.message}`);
    }
}

module.exports = { updateInfoPanel };