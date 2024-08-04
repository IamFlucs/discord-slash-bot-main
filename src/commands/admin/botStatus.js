const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const { logger } = require('../../utils/logger/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-status')
        .setDescription('Change bot status')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option
                .setName('activity')
                .setDescription('The name of the activity')
                .setMaxLength(128)
                .setRequired(true))
        .addStringOption(option => option
                .setName('type')
                .setDescription('The type of activity')
                .addChoices(
                    { name: 'Competing', value: `${6}` },
                    { name: 'Listening', value: `${3}` },
                    { name: 'Streaming', value: `${2}` },
                    { name: 'Watching', value: `${4}` },
                    { name: 'Playing', value: `${1}` },
                    // { name: 'Custom', value: `${0}` }, // I didn't take the time to look how it works
                    )
                .setRequired(true))
        .addStringOption(option => option
                .setName('status')
                .setDescription('The status of the bot')
                .addChoices(
                    { name: 'Online', value: 'online' },
                    { name: 'Inactive', value: 'idle' },
                    { name: 'Do Not Disturb', value: 'dnd' },
                    { name: 'Invisible', value: 'invisible' },
                )
                .setRequired(true)),
    async execute(interaction) {
        // Checks if user has administrator permission level
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            logger.warning(`User ${interaction.user.username} do not have admin permission to use /set-status command.`);
            return await interaction.reply({ content: `You do not have admin permission to use /set-status command.`, ephemeral: true });
        }

        const activity = interaction.options.getString('activity');
        const type = interaction.options.getString('type');
        const status = interaction.options.getString('status');

        try {
            await interaction.client.user.setPresence({ 
                activities: [{ name: activity, type: type-1, url: `https://www.twitch.tv/flucss` }], 
                status: status 
            });
            logger.phase('>> Updating bot status...');
            logger.info(` > New activity : ${activity}`);
            logger.info(` > New status : ${status}`);
            await interaction.reply({ content: 'Bot status updated successfully.', ephemeral: true });
        } catch (error) {
            logger.error('Error updating bot status:', error);
            await interaction.reply({ content: 'There was an error updating bot status.', ephemeral: true });
        }
    },
};