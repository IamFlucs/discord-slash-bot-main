const { ButtonInteraction, Client } = require('discord.js');
const { updateInfoPanel } = require('../../content/infochannel/updateInfoPanel');
const { updateGameCards } = require('../../content/gamecard/updateGameCards');
const { updateRanks } = require('../../database/updateRanks');
const { createLogger } = require('../../utils/logger/logger');
const InfoChannel = require('../../database/schemas/info_channel');

const debugLog = true;
const logger = createLogger(debugLog);

/**
 * Handle refresh button interaction for InfoPanel
 * @param {ButtonInteraction} interaction 
 * @param {Client} client 
 */
module.exports = {
    // cooldown: 10, //TODO: put a cooldown of 5 minutes for this button
    data: {
        name: 'refresh-infochannel-button',
    },
    
    async execute(interaction, client) {
        const guildId = interaction.guild.id;

        // Send a confirmation message
        await interaction.reply({
            content: 'Your server will be refreshed in a few seconds!',
            ephemeral: true
        });

        await updateRanks(client, guildId);
        await updateInfoPanel(client, guildId);

        const option = await InfoChannel.findOne({ infoChannel_fk_guild: guildId });
                            
        if (option && option.infoChannel_gameCardOption) {
            // logger.ok('gameCardOption enable')
            
            await updateGameCards(client, guildId);
        } else { 
            if (!option) {
                logger.ko(`No entry found in InfoChannel for guild ID: ${guildId}, exiting the cron job.`);
            } else {
                logger.ko(`No game card option found for guild ID: ${guildId}, exiting the cron job.`);
            }
        };
        
        // Delete the confirmation message
        await interaction.deleteReply();
    }
}
