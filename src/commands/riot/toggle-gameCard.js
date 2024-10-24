const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const InfoChannel = require('../../database/schemas/info_channel');
const { createLogger } = require('../../utils/logger/logger');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * This command toggle the option for game card creation.
 * The boolean is stock in MongoDB.
 * If enable, game cards will be send in the InfoChannel.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggle-gamecard-option')
        .setDescription('Toggle the game card option for this InfoChannel')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            // Verify that the command is executed in the InfoChannel lounge
            const channelId = interaction.channelId;
            const infoChannel = await InfoChannel.findOne({ infoChannel_channelId: channelId });

            if (!infoChannel) {
                await interaction.reply({
                    content: 'This channel is not configured as an InfoChannel. Please use this command in the correct channel.',
                    ephemeral: true,
                });
                return;
            }

            // Toggle gameCardOption
            const currentSetting = infoChannel.infoChannel_gameCardOption || false;
            infoChannel.infoChannel_gameCardOption = !currentSetting;

            await infoChannel.save();

            const status = infoChannel.infoChannel_gameCardOption ? 'enabled' : 'disabled';
            await interaction.reply({
                content: `The game card option has been **${status}** for this InfoChannel.`,
                ephemeral: true,
            });

            logger.ok(`Game card option set to ${status} for channel ID: ${channelId}`);

        } catch (error) {
            logger.error(`Error toggling game card option: ${error.message}`);
            await interaction.reply({
                content: 'An error occurred while trying to change the game card option. Please try again later.',
                ephemeral: true,
            });
        }
    },
};
