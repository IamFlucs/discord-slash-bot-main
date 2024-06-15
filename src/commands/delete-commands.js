const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const { clientId, guildId, token } = require('../../config.json');
const { logger } = require('../utils/logger.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-commands')
        .setDescription('Deletes all global slash commands'),
    // Need an admin protection for this command !
    // ToDo !!
    async execute(interaction) {
    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(token);
    try {
      // Delete all application commands
      await rest.put(Routes.applicationCommands(clientId), { body: [] });
      await interaction.reply('All global slash commands have been deleted.');
      logger.info('All slash commands have been cleared.');
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to delete global slash commands.');
      logger.error('There was an error clearing slash commands.')
    }
  },
};