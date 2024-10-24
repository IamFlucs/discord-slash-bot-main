const { SlashCommandBuilder } = require('discord.js');
const { extractChampionKeys } = require('../../utils/api/extractChampionKey');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Give you a answer.'),

    async execute(interaction) {

        await interaction.reply({ 
            content: `This is an help message.:crossed_swords:`,
            ephemeral: true,
        });
    }
};