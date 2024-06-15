const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Give you a answer.'),

    async execute(interaction) {
        await interaction.reply({ 
            content: `This is an help message!`,
            ephemeral: true
        });
    },
};