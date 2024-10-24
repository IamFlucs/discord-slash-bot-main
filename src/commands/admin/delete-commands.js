const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { clientId, token } = require('../../../config.json');
const { createLogger } = require('../../utils/logger/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-commands')
        .setDescription('Deletes all global slash commands.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const debugLog = true;
        const logger = createLogger(debugLog);
      
        // Construct and prepare an instance of the REST module
        const rest = new REST().setToken(token);
        try {
            // Delete all application commands
            await rest.put(Routes.applicationCommands(clientId), { body: [] });
            await interaction.reply('All global slash commands have been deleted.');
            logger.info('All slash commands have been cleared.');

        } catch (error) {
            logger.error(error);
            await interaction.reply('Failed to delete global slash commands.');
            logger.error('There was an error clearing slash commands.')
        }
    },
};