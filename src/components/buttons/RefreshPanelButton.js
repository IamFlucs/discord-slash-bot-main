const { ButtonInteraction, Client, GuildTextBasedChannel, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { updateInfoPanel } = require('../../utils/content/updateInfoPanel');
const { createInfoPanel } = require('../../utils/content/createInfoPanel');
const { createTimestamp } = require('../../utils/tools/timestamp');
const { updateRanks } = require('../../utils/content/updateRanks');
const { logger } = require('../../utils/tools/logger');
const InfoChannel = require('../../schemas/info_channel');
const InfoPanel = require('../../schemas/info_panel_message');

/**
 * Handle refresh button interaction
 * @param {ButtonInteraction} interaction 
 * @param {Client} client 
 */
module.exports = {
    // cooldown: 10,
    data: {
        name: 'refresh-infochannel-button',
    },
    async execute(interaction, client) {
        const guildId = interaction.guild.id;
        const channelId = interaction.channel.id;
        const messageId = interaction.message.id;

        // Send a confirmation message
        await interaction.reply({
            content: 'Your server will be refreshed in a few seconds!',
            ephemeral: true
        });

        await updateInfoPanel(client, guildId);
        await updateRanks(guildId);
        
        // Delete the confirmation message
        await interaction.deleteReply();
    }
}
