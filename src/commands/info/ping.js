const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setTitle('Calculating Bot Ping...')
        // await interaction.deferReply({ ephemeral: true });
        await interaction.reply({ embeds: [embed], ephemeral: true });

        const apiPing = interaction.client.ws.ping || 'undefined';
        const botLatency = Date.now() - interaction.createdTimestamp;
        const FinalEmbed = new EmbedBuilder()
            .setColor('Blurple')
            .setTitle('🏓 Pong')
            .setDescription(`**API Ping:** ${apiPing}ms\n**Bot Ping:** ${botLatency}ms`)
        await interaction.followUp({ embeds: [FinalEmbed] });
    },
};