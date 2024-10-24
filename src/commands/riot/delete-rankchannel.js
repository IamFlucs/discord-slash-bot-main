const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const { createLogger } = require('../../utils/logger/logger');
const RankChannel = require('../../database/schemas/rank_channel');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * Perms: @administrator.
 * Description: delete the rankchannel.
 * Dependance: command must be executed from the channel to be deleted.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-rankchannel')
        .setDescription('Delete the rankchannel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const channelId = interaction.channel.id;

        try {
            const rankChannel = await RankChannel.findOne({ rankChannel_channelId: channelId });

            // Check if the command is executed from a info-channel 
            if (!rankChannel) {
                return interaction.reply({
                    content: `This channel is not an \`rankchannel\`.`,
                    ephemeral: true
                });
            }

            // Delete the database
            await RankChannel.deleteOne({ rankChannel_channelId: channelId });

            // Delete the discord channel
            await interaction.channel.delete();

            // await interaction.reply({ 
            //     content: `Rank channel deleted successfully.`, 
            //     ephemeral: true 
            // });
        } catch (error) {
            logger.warning('/!\\ delete-rankchannel.js')
            logger.error('Error deleting info channel:', error.message);
            await interaction.reply({ 
                content: `Failed to delete the info channel.`, 
                ephemeral: true 
            });
        }
    }
};
