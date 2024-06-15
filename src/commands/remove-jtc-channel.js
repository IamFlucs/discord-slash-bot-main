// Delete a voice-channel from the joinToCreate channels list
const { SlashCommandBuilder } = require('discord.js');
const { logger } = require('../utils/logger.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-jtc-channel')
        .setDescription('Remove the voice channel from the JoinToCreate channels list.')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('Select a voice channel')
                .setRequired(true)),
    async execute(interaction) {
        const selectedChannel = interaction.options.getChannel('channel');
        const folder = `./src/database/joinToCreate`;

        // Check if the selected channel is a voice channel
        if (selectedChannel.type !== 2) { // GUILD_VOICE = 2
            return interaction.reply({ content: 'Please select a voice channel.', ephemeral: true });
        }

        // Check if the selected channel is NOT in the join-to-create list
        if (!fs.existsSync(`${folder}/${selectedChannel.id}.json`)) {
            return interaction.reply({ content: `${selectedChannel.name} is not in the joinToCreate list.`, ephemeral: true });
        }

        // Remove json of the selected channel
        if (fs.existsSync(`${folder}/${selectedChannel?.id}.json`)) {
            fs.unlinkSync(`${folder}/${selectedChannel?.id}.json`);
        }

        // Log the updated list of selected voice channels
        logger.info(`\x1b[1mdeleted-jtc-channel.js:\x1b[0m \x1b[31m${selectedChannel.name} removed\x1b[0m from the joinToCreate list.`);
        // Check if folder joinToCreate is empty
        if (fs.readdirSync(`${folder}/`).length === 0) {
            logger.info(`There is no join-to-create channels.`);
        } else { // If folder not empty
            logger.info(`List of join-to-create channels:`);
            for (const file of fs.readdirSync(folder).filter(file => file.endsWith('.json'))) {
                fs.readFile(`${folder}/${file}`, 'utf-8', (err, data) => {                
                    var channel = JSON.parse(data)
                    logger.info(`- ${channel.name} (${channel.id})`);
                });
            }
        }
        return interaction.reply({ content: `**${selectedChannel.name}** has been removed from the joinToCreate list.`, ephemeral: true });
    }
};