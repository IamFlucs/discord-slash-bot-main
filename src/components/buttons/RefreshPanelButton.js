const { ButtonInteraction, Client, GuildTextBasedChannel, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { updateInfoPanel } = require('../../content/infochannel/updateInfoPanel');
const { createInfoPanel } = require('../../content/infochannel/createInfoPanel');
const { createTimestamp } = require('../../utils/date/timestamp');
const { updateRanks } = require('../../database/updateRanks');
const { logger } = require('../../utils/logger/logger');
const InfoChannel = require('../../database/schemas/info_channel');
const InfoPanel = require('../../database/schemas/info_panel_message');

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

        await updateRanks(client, guildId);
        await updateInfoPanel(client, guildId);
        
        // Delete the confirmation message
        await interaction.deleteReply();
    }
}
