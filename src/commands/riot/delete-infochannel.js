const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const { createLogger } = require('../../utils/logger/logger');
const InfoChannel = require('../../database/schemas/info_channel');
const InfoPanel = require('../../database/schemas/info_panel_message');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * Perms: @administrator.
 * Description: delete an infochannel.
 * Dependance: command must be executed from the channel to be deleted.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-infochannel')
        .setDescription('Delete the information channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const channelId = interaction.channel.id;

        try {
            const infoChannel = await InfoChannel.findOne({ infoChannel_channelId: channelId });

            // Check if the command is executed from a info-channel 
            if (!infoChannel) {
                return interaction.reply({
                    content: `This channel is not an \`info-channel\`.`,
                    ephemeral: true
                });
            }

            // Delete the database
            await InfoPanel.deleteOne({ infoPanel_fk_infoChannel: infoChannel._id });
            await InfoChannel.deleteOne({ infoChannel_channelId: channelId });

            logger.phase('> Deleting database info channel & panel');

            // Delete the discord channel
            await interaction.channel.delete();

            logger.phase('> Then deleting channel');

            // await interaction.reply({ 
            //     content: `Info channel deleted successfully.`, 
            //     ephemeral: true 
            // });
            
        } catch (error) {
            logger.error('Error deleting info channel:', {
                message: error.message,
            });
            await interaction.reply({ 
                content: `Failed to delete the info channel.`, 
                ephemeral: true 

            });
        }
    }
};
